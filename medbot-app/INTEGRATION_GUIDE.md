# Prescription OCR Pipeline Integration Guide

## Overview

The prescription OCR pipeline is now fully integrated with the MedBot application using advanced AI models for superior text extraction and structured medicine information parsing.

## Architecture

### 1. Frontend (IntegrationPage.tsx)
- **File Upload**: Users can upload prescription images (JPG, PNG, PDF)
- **Real-time Status**: Shows processing status with loading indicators
- **Error Handling**: Displays detailed error messages for failed uploads
- **Results Display**: Shows extracted medicines with confidence scores and source information

### 2. Backend (server.js)
- **File Upload Endpoint**: `/api/prescription-ocr` handles file uploads
- **Python Process Spawning**: Spawns the prescription OCR pipeline
- **Error Handling**: Comprehensive error handling and logging
- **File Cleanup**: Automatically cleans up uploaded files

### 3. Python Pipeline (prescription_ocr_pipeline.py)
- **Advanced OCR**: Uses `chinmays18/medical-prescription-ocr` for text extraction
- **Structured Extraction**: Uses `Muizzzz8/phi3-prescription-reader` for medicine parsing
- **Medicine Matching**: Fuzzy matching against comprehensive medicine database
- **Structured Output**: JSON-based results storage with confidence scores

## Data Flow

```
User Upload → Frontend → Backend → Python Pipeline → Results → Frontend Display
```

### Step-by-Step Process:

1. **User Uploads Image**
   - User selects prescription image in IntegrationPage
   - File is uploaded to `/api/prescription-ocr` endpoint

2. **Backend Processing**
   - Server receives file via multer
   - Spawns Python process with image path
   - Monitors Python process output

3. **Python Pipeline**
   - **Step 1**: Preprocesses image for optimal OCR
   - **Step 2**: Uses Donut OCR to extract text from image
   - **Step 3**: Uses LLM to extract structured medicine information
   - **Step 4**: Matches extracted medicines against database
   - **Step 5**: Saves results to `public/Prescription.json`

4. **Results Return**
   - Backend reads latest results from JSON
   - Returns structured data to frontend
   - Cleans up uploaded file

5. **Frontend Display**
   - Shows processing status and results
   - Updates PrescriptionReport component
   - Displays medicines with confidence scores and sources

## Key Features

### Advanced OCR Models
- **Donut OCR**: `chinmays18/medical-prescription-ocr` for superior text extraction
- **LLM Parser**: `Muizzzz8/phi3-prescription-reader` for structured medicine extraction
- **GPU Acceleration**: Automatic CUDA detection for faster processing

### Medicine Matching
- **Exact Matches**: Direct database lookups with 100% confidence
- **Fuzzy Matching**: Handles OCR errors with 80%+ confidence
- **Token-based Matching**: Partial word matching with 75% confidence
- **Source Tracking**: Shows whether match was exact, fuzzy, or token-based

### Enhanced Output
- **OCR Text**: Raw extracted text from prescription
- **Structured LLM Output**: Parsed medicine names and dosages
- **Confidence Scores**: Reliability indicators for each match
- **Source Information**: How each medicine was matched

### Error Handling
- **Graceful Degradation**: Continues working if models fail
- **Detailed Logging**: Comprehensive error tracking
- **User-Friendly Messages**: Clear error display in UI
- **File Validation**: Proper file type and size checks

## File Structure

```
medbot-app/
├── prescription_ocr_pipeline.py    # Main OCR pipeline (v2.0)
├── public/
│   ├── medicines.json             # Medicine database
│   └── Prescription.json          # Results storage
├── src/pages/
│   └── IntegrationPage.tsx        # Frontend upload interface
└── server.js                      # Backend API endpoints
```

## Usage

### For Users:
1. Go to Integration page
2. Upload prescription image (JPG, PNG, PDF)
3. Wait for processing (shows loading indicator)
4. View results in PrescriptionReport component
5. Ask Gemini AI about medicines (automatically includes prescription data)

### For Developers:
1. **Test Pipeline**: `python test_new_pipeline.py`
2. **Test Integration**: `python test_integration.py`
3. **Monitor Logs**: Check server console for detailed logs
4. **Debug Issues**: Use error messages in UI and server logs

## Configuration

### Medicine Database
- Location: `medbot-app/public/medicines.json`
- Format: JSON with medicine names, descriptions, and diseases
- Extensible: Add new medicines by updating the JSON file

### OCR Models
- **Donut OCR**: `chinmays18/medical-prescription-ocr`
- **LLM Parser**: `Muizzzz8/phi3-prescription-reader`
- **Auto-download**: Models are downloaded automatically on first use
- **GPU Support**: Automatic CUDA detection for faster processing

### File Upload Limits
- **Size**: 10MB maximum
- **Types**: JPG, PNG, PDF
- **Validation**: Automatic file type checking

## Troubleshooting

### Common Issues:

1. **"No file uploaded"**
   - Check file size (max 10MB)
   - Ensure file is JPG, PNG, or PDF

2. **"Failed to process prescription image"**
   - Check Python dependencies are installed
   - Verify models are downloaded
   - Check server logs for detailed errors

3. **"No medicines detected"**
   - Image quality may be too low
   - Try uploading a clearer image
   - Check if medicine names are in database

4. **Server connection errors**
   - Ensure server is running: `node server.js`
   - Check port 3001 is available
   - Verify CORS configuration

5. **Model loading errors**
   - Install required dependencies: `pip install -r requirements.txt`
   - Check internet connection for model downloads
   - Verify sufficient disk space for model files

### Debug Commands:
```bash
# Test new pipeline directly
python test_new_pipeline.py

# Test integration
python test_integration.py

# Check server logs
node server.js

# Install dependencies
pip install -r requirements.txt

# Check model downloads
python -c "from transformers import DonutProcessor; DonutProcessor.from_pretrained('chinmays18/medical-prescription-ocr')"
```

## Integration with Gemini AI

The prescription data is automatically available to Gemini AI:
- **Context Inclusion**: When users ask about medicines, prescription data is included
- **Real-time Updates**: Latest prescription results are used
- **Structured Format**: Medicine names, descriptions, confidence scores, and sources

## Performance Considerations

- **Model Loading**: Models are loaded once at startup
- **GPU Acceleration**: Automatic CUDA detection for faster processing
- **Memory Management**: Automatic cleanup of uploaded files
- **Caching**: Results are cached in JSON for quick access
- **Batch Processing**: Efficient handling of multiple uploads

## Security

- **File Validation**: Strict file type checking
- **Size Limits**: Prevents large file uploads
- **Path Sanitization**: Prevents directory traversal attacks
- **Error Handling**: No sensitive data in error messages
- **Model Security**: Uses trusted HuggingFace models

## Pipeline Version 2.0 Features

- **Advanced OCR**: Medical prescription-specific OCR model
- **Structured Extraction**: LLM-based medicine parsing
- **Enhanced Matching**: Multiple matching strategies with confidence scores
- **Source Tracking**: Shows how each medicine was matched
- **GPU Support**: Automatic CUDA detection for faster processing
- **Comprehensive Logging**: Detailed processing logs for debugging 