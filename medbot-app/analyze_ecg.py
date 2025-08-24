#!/usr/bin/env python3
"""
ECG Analysis Pipeline
Analyzes ECG images and returns structured health data
"""

import sys
import json
import os
from datetime import datetime
import cv2
import numpy as np

def analyze_ecg_image(image_path):
    """
    Analyze ECG image and extract health metrics
    This is a simplified version - in production, you'd use advanced ML models
    """
    try:
        # Load and process image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Basic image analysis (simplified for demo)
        height, width = gray.shape
        mean_intensity = np.mean(gray)
        
        # Simulate ECG analysis results based on image characteristics
        # In production, this would use trained ML models
        
        # Generate realistic but simulated results
        base_hr = 70 + int((mean_intensity - 127) / 10)
        heart_rate = max(50, min(120, base_hr))
        
        # Determine severity based on heart rate
        if heart_rate < 60:
            severity = "Bradycardia"
            severity_level = "moderate"
            urgency = "Monitor closely"
            urgency_level = "medium"
        elif heart_rate > 100:
            severity = "Tachycardia" 
            severity_level = "moderate"
            urgency = "Consult physician"
            urgency_level = "high"
        else:
            severity = "Normal"
            severity_level = "low"
            urgency = "Routine monitoring"
            urgency_level = "low"
        
        # Generate blood pressure estimate
        systolic = 120 + int((heart_rate - 70) * 0.5)
        diastolic = 80 + int((heart_rate - 70) * 0.3)
        bp = f"{systolic}/{diastolic}"
        
        # Generate rhythm analysis
        rhythm_confidence = 0.85 + (mean_intensity % 10) / 100
        rhythm = "Sinus rhythm" if heart_rate >= 60 and heart_rate <= 100 else "Irregular rhythm"
        
        # Generate symptoms and recommendations
        symptoms = []
        recommendations = []
        
        if heart_rate < 60:
            symptoms.extend(["Fatigue", "Dizziness"])
            recommendations.extend(["Regular monitoring", "Lifestyle assessment"])
        elif heart_rate > 100:
            symptoms.extend(["Palpitations", "Shortness of breath"])
            recommendations.extend(["Stress management", "Cardiac evaluation"])
        else:
            symptoms.append("No significant symptoms")
            recommendations.extend(["Maintain healthy lifestyle", "Regular checkups"])
        
        # Medical advice
        advice = f"Heart rate of {heart_rate} bpm detected. "
        if severity != "Normal":
            advice += f"{severity} identified. Recommend consultation with healthcare provider."
        else:
            advice += "ECG appears within normal parameters. Continue regular monitoring."
        
        # Structure the response
        result = {
            "fileName": os.path.basename(image_path),
            "timestamp": datetime.now().isoformat(),
            "processing_status": "success",
            "heartRate": {
                "label": "Heart Rate",
                "data": str(heart_rate),
                "unit": "bpm"
            },
            "bloodPressure": {
                "label": "Blood Pressure (estimated)",
                "data": bp
            },
            "severity": {
                "label": "Severity Assessment",
                "data": severity,
                "level": severity_level
            },
            "rhythm": {
                "label": "Rhythm Analysis",
                "data": rhythm,
                "confidence": rhythm_confidence
            },
            "urgency": {
                "label": "Urgency Level",
                "data": urgency,
                "level": urgency_level
            },
            "symptoms": {
                "label": "Associated Symptoms",
                "data": symptoms
            },
            "medicalAdvice": {
                "label": "Medical Advice",
                "data": advice
            },
            "recommendations": {
                "label": "Recommendations",
                "data": recommendations
            },
            "imageAnalysis": {
                "dimensions": f"{width}x{height}",
                "meanIntensity": round(mean_intensity, 2),
                "processingTime": "< 1 second"
            }
        }
        
        return result
        
    except Exception as e:
        return {
            "fileName": os.path.basename(image_path) if image_path else "unknown",
            "timestamp": datetime.now().isoformat(),
            "processing_status": "error",
            "error": str(e),
            "message": "Failed to analyze ECG image"
        }

def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            "error": "Usage: python analyze_ecg.py <image_path>",
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
    
    # Analyze the ECG image
    result = analyze_ecg_image(image_path)
    
    # Output JSON result
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
