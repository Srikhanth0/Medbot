import Tesseract from 'tesseract.js';

export interface PrescriptionData {
  patientName?: string;
  doctorName?: string;
  date?: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  instructions?: string;
  rawText: string;
}

/**
 * Processes a prescription image using OCR and extracts structured data
 * @param imageFile The prescription image file to process
 * @returns Promise that resolves to the extracted prescription data
 */
export async function processPrescriptionImage(imageFile: File): Promise<PrescriptionData> {
  try {
    // Step 1: Use Tesseract.js to extract text from the image
    // Create a worker for Tesseract
    const worker = await Tesseract.createWorker('eng');
    
    try {
      // Set the character whitelist
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.,():;\/\n\r\t ',
      });
      
      // Recognize the image
      const { data: { text } } = await worker.recognize(imageFile);
      return parsePrescriptionText(text);
    } finally {
      // Always terminate the worker when done
      await worker.terminate();
    }

  } catch (error) {
    console.error('Error processing prescription image:', error);
    throw new Error('Failed to process prescription image');
  }
}

/**
 * Parses the raw OCR text into structured prescription data
 * @param text The raw text extracted from the prescription
 * @returns Structured prescription data
 */
function parsePrescriptionText(text: string): PrescriptionData {
  // This is a basic implementation - you may need to adjust the parsing logic
  // based on the actual format of your prescription images
  console.log('Raw OCR text:', text);
  const lines = text.split('\n').filter(line => line.trim() !== '');
  console.log('OCR lines:', lines);
  
  const result: PrescriptionData = {
    medications: [],
    rawText: text
  };
  
  // Common medication names to look for (you can expand this list)
  const commonMedications = [
    'amoxicillin', 'ibuprofen', 'paracetamol', 'acetaminophen', 'aspirin',
    'metformin', 'lisinopril', 'atorvastatin', 'omeprazole', 'amlodipine',
    'simvastatin', 'levothyroxine', 'azithromycin', 'hydrochlorothiazide',
    'gabapentin', 'clopidogrel', 'montelukast', 'rosuvastatin', 'escitalopram',
    'albuterol', 'sertraline', 'prednisone', 'tramadol', 'trazodone',
    'losartan', 'pantoprazole', 'furosemide', 'clonazepam', 'cyclobenzaprine',
    'ciprofloxacin', 'doxycycline', 'warfarin', 'insulin', 'morphine',
    'codeine', 'diazepam', 'lorazepam', 'alprazolam', 'zolpidem'
  ];

  // Simple parsing logic - this should be enhanced based on actual prescription formats
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Extract patient name (look for lines that might contain patient info)
    if (line.toLowerCase().includes('patient') && line.toLowerCase().includes('name') && !result.patientName) {
      result.patientName = line.replace(/patient\s*name[:\s]*/i, '').trim();
    }
    
    // Extract doctor name
    else if (line.toLowerCase().includes('doctor') || line.toLowerCase().includes('dr.')) {
      result.doctorName = line.replace(/doctor\s*name[:\s]*/i, '')
                            .replace(/^dr\.?\s*/i, '')
                            .trim();
    }
    
    // Extract date (simple date format matching)
    else if (/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(line)) {
      result.date = line.trim();
    }
    
    // Simple medication extraction - look for known medication names in the text
    // This works similar to how patient and doctor names are extracted
    const lineText = line.toLowerCase();
    
    // Check if this line contains any known medication names
    for (const medName of commonMedications) {
      if (lineText.includes(medName.toLowerCase())) {
        // Found a medication! Extract it simply
        const medicationName = medName.charAt(0).toUpperCase() + medName.slice(1);
        
        // Try to find dosage in the same line
        let dosage = 'As prescribed';
        const dosageMatch = line.match(/(\d+\s*(?:mg|ml|g|mcg|units?))/i);
        if (dosageMatch) {
          dosage = dosageMatch[1];
        }
        
        // Try to find frequency
        let frequency = 'As directed';
        if (lineText.includes('twice') || lineText.includes('2x')) {
          frequency = 'Twice daily';
        } else if (lineText.includes('once') || lineText.includes('daily')) {
          frequency = 'Once daily';
        } else if (lineText.includes('three times') || lineText.includes('3x')) {
          frequency = 'Three times daily';
        }
        
        // Try to find duration
        let duration = 'As directed';
        const durationMatch = line.match(/(\d+\s*(?:days?|weeks?|months?))/i);
        if (durationMatch) {
          duration = durationMatch[1];
        }
        
        // Add the medication (avoid duplicates)
        const exists = result.medications.some(med => med.name.toLowerCase() === medicationName.toLowerCase());
        if (!exists) {
          result.medications.push({
            name: medicationName,
            dosage: dosage,
            frequency: frequency,
            duration: duration
          });
          console.log('Found medication:', medicationName, 'in line:', line);
        }
        break; // Found one medication in this line, move to next line
      }
    }
  }

  return result;
}

/**
 * Simulates OCR processing for development/testing
 */
export async function simulatePrescriptionOcr(_imageFile: File): Promise<PrescriptionData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock data
  return {
    patientName: 'John Doe',
    doctorName: 'Dr. Smith',
    date: new Date().toLocaleDateString(),
    medications: [
      {
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '7 days'
      },
      {
        name: 'Ibuprofen',
        dosage: '200mg',
        frequency: 'Every 6 hours as needed',
        duration: 'As needed'
      }
    ],
    instructions: 'Take with food. Complete all medications as prescribed.',
    rawText: 'Mock prescription data for development and testing.'
  };
}

// Export the interface and functions
type PrescriptionOcrExports = {
  processPrescriptionImage: typeof processPrescriptionImage;
  simulatePrescriptionOcr: typeof simulatePrescriptionOcr;
  parsePrescriptionText: typeof parsePrescriptionText;
};

const prescriptionOcr: PrescriptionOcrExports = {
  processPrescriptionImage,
  simulatePrescriptionOcr,
  parsePrescriptionText
};

export default prescriptionOcr;
