import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import { spawn } from 'child_process';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from multiple possible locations
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, 'medbot-app', '.env') });

const app = express();

// CORS configuration - Allow requests from your frontend
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log("Received file:", file.originalname, file.mimetype);
    if (!file.mimetype.startsWith('image/')) {
      console.log("Rejected file: Invalid MIME type", file.mimetype);
      return cb(new Error('Only image files are allowed'), false);
    }
    console.log("File accepted:", file.originalname);
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Word limiting functions
function truncateWords(text, maxWords = 150) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(' ') + '...';
}

function addWordLimitToPrompt(userMessage, maxWords = 150) {
  const medicalContext = `You are a helpful medical AI assistant. Provide accurate, concise health information while always reminding users to consult healthcare professionals for medical advice.`;
  const wordLimitInstruction = `Please provide a concise response in under ${maxWords} words. Be direct and to the point.`;
  return `${medicalContext}\n\n${wordLimitInstruction}\n\nUser question: ${userMessage}`;
}

// Word limit configuration
const MAX_WORDS = 150; // Configurable word limit for responses

// ECG Analysis configuration
let ecgAnalyzerAvailable = false;

// In-memory storage for ECG data (in production, use a proper database)
let ecgDataStorage = [];

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper to append ECG analysis to rag/ecg_analysis.json
function appendECGAnalysisToRag(analysis) {
  const ragDir = path.join(__dirname, 'rag');
  const ragFile = path.join(ragDir, 'ecg_analysis.json');
  if (!fs.existsSync(ragDir)) {
    fs.mkdirSync(ragDir, { recursive: true });
  }
  let data = [];
  if (fs.existsSync(ragFile)) {
    try {
      data = JSON.parse(fs.readFileSync(ragFile, 'utf-8'));
    } catch (e) {
      data = [];
    }
  }
  data.unshift(analysis); // latest first
  fs.writeFileSync(ragFile, JSON.stringify(data, null, 2));
}

// Helper to store ECG data for Gemini access
function storeECGDataForGemini(ecgData) {
  ecgDataStorage.unshift(ecgData); // Add to beginning
  // Keep only last 50 records
  if (ecgDataStorage.length > 50) {
    ecgDataStorage = ecgDataStorage.slice(0, 50);
  }
}

// Helper to get latest ECG analysis from rag/ecg_analysis.json
function getLatestECGAnalysis() {
  const ragFile = path.join(__dirname, 'rag', 'ecg_analysis.json');
  if (!fs.existsSync(ragFile)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(ragFile, 'utf-8'));
    return data.length > 0 ? data[0] : null;
  } catch (e) {
    return null;
  }
}

// ECG Analysis endpoint
app.post('/api/ecg-analysis', async (req, res) => {
  try {
    const { imagePath } = req.body;
    if (!imagePath) {
      return res.status(400).json({ error: 'Image path is required' });
    }
    console.log('Received ECG analysis request for:', imagePath);
    if (!ecgAnalyzerAvailable) {
      return res.status(503).json({ error: 'ECG analysis service not available. Please ensure Python dependencies are installed.' });
    }
         const pythonCommand = process.platform === 'win32' ? 'py' : 'python';
     const pythonProcess = spawn(pythonCommand, ['medbot-app/analyze_ecg.py', imagePath]);
    let result = '';
    let error = '';
    pythonProcess.stdout.on('data', (data) => { result += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { error += data.toString(); console.log(`🐍 Python ECG: ${data.toString().trim()}`); });
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`ECG analysis failed with code ${code}`);
        res.status(500).json({ error: 'ECG analysis failed', details: error });
      } else {
        try {
          const analysisResult = JSON.parse(result);
          appendECGAnalysisToRag(analysisResult); // <-- Store in RAG
          console.log('ECG analysis completed successfully');
          res.json(analysisResult);
        } catch (e) {
          console.error('Failed to parse ECG analysis result:', e);
          res.status(500).json({ error: 'Failed to parse ECG analysis result', raw_result: result });
        }
      }
    });
    pythonProcess.on('error', (err) => {
      console.error('Failed to start ECG analysis process:', err);
      res.status(500).json({ error: 'Failed to start ECG analysis process', details: err.message });
    });
  } catch (err) {
    console.error('ECG Analysis Error:', err);
    res.status(500).json({ error: 'Failed to process ECG analysis request. Please try again.', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

// GET /api/ecg-latest endpoint
app.get('/api/ecg-latest', (req, res) => {
  const latest = getLatestECGAnalysis();
  if (!latest) {
    return res.status(404).json({ error: 'No ECG analysis found' });
  }
  res.json(latest);
});

// GET /api/ecg-data-for-gemini endpoint
app.get('/api/ecg-data-for-gemini', (req, res) => {
  try {
    const formattedData = ecgDataStorage.map(item => `
File: ${item.fileName}
Timestamp: ${item.timestamp}
Heart Rate: ${item.heartRate.data} ${item.heartRate.unit}
Blood Pressure: ${item.bloodPressure.data}
Severity: ${item.severity.data} (${item.severity.level})
Rhythm: ${item.rhythm.data} (${(item.rhythm.confidence * 100).toFixed(1)}% confidence)
Urgency: ${item.urgency.data} (${item.urgency.level})
Symptoms: ${item.symptoms.data.join(', ')}
Medical Advice: ${item.medicalAdvice.data}
Recommendations: ${item.recommendations.data.join('; ')}
    `).join('\n---\n');

    res.json({
      data: formattedData,
      totalRecords: ecgDataStorage.length,
      latestRecord: ecgDataStorage[0] || null
    });
  } catch (error) {
    console.error('Error providing ECG data for Gemini:', error);
    res.status(500).json({ error: 'Failed to provide ECG data' });
  }
});

// POST /api/store-ecg-data endpoint
app.post('/api/store-ecg-data', (req, res) => {
  try {
    const ecgData = req.body;
    if (!ecgData || !ecgData.fileName) {
      return res.status(400).json({ error: 'Invalid ECG data format' });
    }
    
    storeECGDataForGemini(ecgData);
    console.log('ECG data stored for Gemini access');
    res.json({ success: true, message: 'ECG data stored successfully' });
  } catch (error) {
    console.error('Error storing ECG data:', error);
    res.status(500).json({ error: 'Failed to store ECG data' });
  }
});

// Gemini endpoint (prepend ECG context if prompt is about ECG)
app.post('/api/gemini', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }
    console.log('Received message:', userMessage);
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ error: 'AI service not configured. Please check your environment variables.' });
    }
    let context = '';
    // If prompt is about ECG, prepend stored ECG data
    if (/ecg|electrocardiogram|heart rate|blood pressure|severity|symptoms/i.test(userMessage)) {
      if (ecgDataStorage.length > 0) {
        const formattedData = ecgDataStorage.map(item => `
Patient Record - ${item.fileName}
Date: ${new Date(item.timestamp).toLocaleDateString()}
${item.heartRate.label}: ${item.heartRate.data} ${item.heartRate.unit}
${item.bloodPressure.label}: ${item.bloodPressure.data}
${item.severity.label}: ${item.severity.data} (${item.severity.level})
${item.rhythm.label}: ${item.rhythm.data} (${(item.rhythm.confidence * 100).toFixed(1)}% confidence)
${item.urgency.label}: ${item.urgency.data} (${item.urgency.level})
${item.symptoms.label}: ${item.symptoms.data.join(', ')}
${item.medicalAdvice.label}: ${item.medicalAdvice.data}
${item.recommendations.label}: ${item.recommendations.data.join('; ')}
        `).join('\n---\n');
        
        context = `Patient ECG Data:\n${formattedData}\n\n`;
      } else {
      const latestECG = getLatestECGAnalysis();
      if (latestECG) {
        context = `Patient ECG Analysis (from RAG):\n${JSON.stringify(latestECG, null, 2)}\n\n`;
        }
      }
    }
    // Apply soft limit via prompt engineering
    const enhancedPrompt = context + addWordLimitToPrompt(userMessage, MAX_WORDS);
    console.log('Enhanced prompt with word limit:', enhancedPrompt);
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({ contents: [ { parts: [{ text: enhancedPrompt }] } ] }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    const fullReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';
    console.log('AI Response (before truncation):', fullReply);
    const finalReply = truncateWords(fullReply, MAX_WORDS);
    const originalWordCount = fullReply.trim().split(/\s+/).length;
    const finalWordCount = finalReply.trim().split(/\s+/).length;
    console.log(`Word count: ${originalWordCount} → ${finalWordCount} (limit: ${MAX_WORDS})`);
    res.json({ reply: finalReply });
  } catch (err) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: 'Failed to get response from AI. Please try again.', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MEDBOT AI server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    wordLimit: MAX_WORDS,
    ecgAnalysis: ecgAnalyzerAvailable ? 'available' : 'unavailable'
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    cors: 'CORS is properly configured',
    timestamp: new Date().toISOString()
  });
});

// Test prescription OCR endpoint
app.get('/api/prescription-ocr-test', (req, res) => {
  res.json({ 
    message: 'Prescription OCR endpoint is available',
    scriptPath: path.join(__dirname, 'medbot-app', 'prescription_ocr_pipeline.py'),
    scriptExists: fs.existsSync(path.join(__dirname, 'medbot-app', 'prescription_ocr_pipeline.py')),
    timestamp: new Date().toISOString()
  });
});

// File upload endpoint for ECG images
app.post('/api/upload-ecg', upload.single('ecgImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('ECG image uploaded:', req.file.filename);
    
    res.json({ 
      imagePath: req.file.path,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
    
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.post('/api/prescription-ocr', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path;
            const scriptPath = path.join(__dirname, 'medbot-app', 'pil_ocr_pipeline.py');
    
    console.log(`Processing prescription image: ${req.file.originalname}`);
    console.log(`Image path: ${imagePath}`);
    console.log(`Script path: ${scriptPath}`);
    
    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      console.error(`Script not found: ${scriptPath}`);
      return res.status(500).json({ error: 'Prescription OCR script not found' });
    }
    
    // Use 'py' command on Windows, fallback to 'python'
    const pythonCommand = process.platform === 'win32' ? 'py' : 'python';
    const python = spawn(pythonCommand, ['pil_ocr_pipeline.py', imagePath]);

    let output = '';
    let errorOutput = '';
    
    python.stdout.on('data', (data) => { 
      output += data.toString(); 
      console.log('Python stdout:', data.toString());
    });
    
    python.stderr.on('data', (data) => { 
      errorOutput += data.toString(); 
      console.error('Python stderr:', data.toString());
    });

    python.on('close', (code) => {
      try {
        console.log(`Python process exited with code: ${code}`);
        console.log(`Python stdout: ${output}`);
        console.log(`Python stderr: ${errorOutput}`);
        
        // Read the latest result from Prescription.json
        const prescriptionJsonPath = path.join(__dirname, 'medbot-app', 'public', 'Prescription.json');
        let latest = null;
        
        if (fs.existsSync(prescriptionJsonPath)) {
          try {
            const fileContent = fs.readFileSync(prescriptionJsonPath, 'utf-8');
            console.log(`Prescription.json content: ${fileContent.substring(0, 200)}...`);
            const arr = JSON.parse(fileContent);
            if (Array.isArray(arr) && arr.length > 0) {
              latest = arr[0];
              console.log(`Found ${arr.length} prescription records`);
            }
          } catch (parseError) {
            console.error('Error parsing Prescription.json:', parseError);
          }
        } else {
          console.log('Prescription.json does not exist');
        }
        
        // Clean up uploaded file
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log('Cleaned up uploaded file');
          }
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
        
        if (code === 0 && latest && latest.processing_status === 'success') {
          console.log('Prescription OCR completed successfully');
          res.json(latest);
        } else {
          console.error(`Python process failed with code ${code}`);
          console.error('Error output:', errorOutput);
          res.status(500).json({ 
            error: 'Failed to process prescription image',
            details: errorOutput || 'Unknown error',
            code: code,
            output: output
          });
        }
        
      } catch (error) {
        console.error('Error in prescription OCR response handling:', error);
        res.status(500).json({ 
          error: 'Error processing prescription results',
          details: error.message
        });
      }
    });

    python.on('error', (error) => {
      console.error('Error spawning Python process:', error);
      res.status(500).json({ 
        error: 'Failed to start prescription processing',
        details: error.message
      });
    });

  } catch (error) {
    console.error('Error in prescription OCR endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`MEDBOT AI server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
}); 