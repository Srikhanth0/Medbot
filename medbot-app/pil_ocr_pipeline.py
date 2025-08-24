#!/usr/bin/env python3
"""
Prescription OCR Pipeline
Processes prescription images using OCR and extracts medical information
"""

import sys
import json
import os
from datetime import datetime
import cv2
import numpy as np
from PIL import Image
import pytesseract
import re

# Configure tesseract path for Windows (adjust if needed)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def preprocess_image(image_path):
    """
    Preprocess image for better OCR results
    """
    try:
        # Load image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply noise reduction
        denoised = cv2.medianBlur(gray, 5)
        
        # Apply adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        # Morphological operations to clean up
        kernel = np.ones((2, 2), np.uint8)
        cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        
        return cleaned
        
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

def extract_text_from_image(image_path):
    """
    Extract text from prescription image using OCR
    """
    try:
        # Preprocess image
        processed_image = preprocess_image(image_path)
        if processed_image is None:
            return ""
        
        # Convert back to PIL Image for tesseract
        pil_image = Image.fromarray(processed_image)
        
        # Configure tesseract for better medical text recognition
        custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:-/() '
        
        # Extract text
        text = pytesseract.image_to_string(pil_image, config=custom_config)
        
        return text.strip()
        
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""

def parse_prescription_text(text):
    """
    Parse extracted text to identify medical information
    """
    # Common medical patterns
    medication_patterns = [
        r'(?i)(tablet|capsule|syrup|injection|mg|ml|drops?)\s*:?\s*([A-Za-z\s]+)',
        r'(?i)([A-Za-z]+(?:cillin|mycin|prazole|metformin|atenolol|amlodipine))',
        r'(?i)(paracetamol|ibuprofen|aspirin|metformin|atorvastatin)'
    ]
    
    dosage_patterns = [
        r'(\d+)\s*(mg|ml|g|mcg)',
        r'(\d+)\s*x\s*(\d+)',
        r'(\d+)\s*times?\s*(daily|day|week)',
        r'(morning|evening|night|bedtime|before|after)\s*(meal|food)'
    ]
    
    medications = []
    dosages = []
    instructions = []
    
    # Extract medications
    for pattern in medication_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            if isinstance(match, tuple):
                medications.extend([m.strip() for m in match if m.strip()])
            else:
                medications.append(match.strip())
    
    # Extract dosages
    for pattern in dosage_patterns:
        matches = re.findall(pattern, text)
        dosages.extend([' '.join(match) if isinstance(match, tuple) else match for match in matches])
    
    # Extract general instructions
    instruction_keywords = ['take', 'apply', 'use', 'before', 'after', 'with', 'without', 'daily', 'twice', 'morning', 'evening']
    lines = text.split('\n')
    for line in lines:
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in instruction_keywords):
            instructions.append(line.strip())
    
    # Clean and deduplicate
    medications = list(set([med for med in medications if len(med) > 2]))[:10]  # Limit to 10
    dosages = list(set(dosages))[:10]
    instructions = list(set([inst for inst in instructions if len(inst) > 5]))[:10]
    
    return medications, dosages, instructions

def analyze_prescription(image_path):
    """
    Complete prescription analysis pipeline
    """
    try:
        # Extract text from image
        extracted_text = extract_text_from_image(image_path)
        
        if not extracted_text:
            return {
                "fileName": os.path.basename(image_path),
                "timestamp": datetime.now().isoformat(),
                "processing_status": "error",
                "error": "No text could be extracted from the image",
                "confidence": 0.0
            }
        
        # Parse medical information
        medications, dosages, instructions = parse_prescription_text(extracted_text)
        
        # Calculate confidence based on extracted data quality
        confidence = 0.3  # Base confidence
        if medications:
            confidence += 0.4
        if dosages:
            confidence += 0.2
        if instructions:
            confidence += 0.1
        
        confidence = min(confidence, 0.95)  # Cap at 95%
        
        # Generate analysis
        analysis = "Prescription analysis completed. "
        if medications:
            analysis += f"Identified {len(medications)} medication(s). "
        if dosages:
            analysis += f"Found {len(dosages)} dosage instruction(s). "
        
        analysis += "Please verify all information with healthcare provider."
        
        # Structure the response
        result = {
            "fileName": os.path.basename(image_path),
            "timestamp": datetime.now().isoformat(),
            "processing_status": "success",
            "confidence": round(confidence, 2),
            "extractedText": extracted_text,
            "medications": {
                "label": "Identified Medications",
                "data": medications,
                "count": len(medications)
            },
            "dosages": {
                "label": "Dosage Information",
                "data": dosages,
                "count": len(dosages)
            },
            "instructions": {
                "label": "Usage Instructions",
                "data": instructions,
                "count": len(instructions)
            },
            "analysis": {
                "label": "Analysis Summary",
                "data": analysis
            },
            "warnings": {
                "label": "Important Notes",
                "data": [
                    "This is an automated analysis and may contain errors",
                    "Always consult with healthcare provider before taking medications",
                    "Verify all medication names and dosages with original prescription"
                ]
            },
            "processingInfo": {
                "textLength": len(extracted_text),
                "processingTime": "< 2 seconds",
                "ocrEngine": "Tesseract OCR"
            }
        }
        
        return result
        
    except Exception as e:
        return {
            "fileName": os.path.basename(image_path) if image_path else "unknown",
            "timestamp": datetime.now().isoformat(),
            "processing_status": "error",
            "error": str(e),
            "message": "Failed to analyze prescription image"
        }

def save_to_json(result, output_dir="public"):
    """
    Save result to Prescription.json file
    """
    try:
        json_path = os.path.join(output_dir, "Prescription.json")
        
        # Create directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Load existing data or create new list
        data = []
        if os.path.exists(json_path):
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if not isinstance(data, list):
                        data = []
            except:
                data = []
        
        # Add new result at the beginning
        data.insert(0, result)
        
        # Keep only last 50 records
        data = data[:50]
        
        # Save updated data
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return True
        
    except Exception as e:
        print(f"Error saving to JSON: {e}")
        return False

def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            "error": "Usage: python pil_ocr_pipeline.py <image_path>",
            "processing_status": "error"
        }))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({
            "error": f"Image file not found: {image_path}",
            "processing_status": "error"
        }))
        sys.exit(1)
    
    # Analyze the prescription image
    result = analyze_prescription(image_path)
    
    # Save to JSON file
    save_to_json(result)
    
    # Output JSON result
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
