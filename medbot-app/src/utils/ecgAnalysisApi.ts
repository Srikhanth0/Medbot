// ECG Analysis API Utility
// Handles communication with the ECG analysis backend

import { ecgRagStorage, ECGAnalysisResult } from './ecgRagStorage';

const API_BASE_URL = 'http://localhost:3001';

export interface ECGAnalysisRequest {
  imageFile: File;
  fileName: string;
}

export interface ECGAnalysisResponse {
  timestamp: string;
  image_path: string;
  ocr_analysis?: {
    extracted_text: string;
    heart_rate?: number;
    unit?: string;
    confidence: string;
  };
  waveform_analysis?: {
    classification: {
      predicted_label: string;
      confidence: number;
    };
    rhythm_analysis: {
      description: string;
      severity: string;
      characteristics: string;
    };
    medical_advice: string;
  };
  combined_insights?: {
    heart_rate_consistency: string;
    overall_assessment: string;
    confidence_level: string;
    key_findings: string[];
  };
  medical_summary?: {
    urgency_level: string;
    recommendations: string[];
    limitations: string[];
  };
  error?: string;
}

/**
 * Upload ECG image and get analysis results
 */
export const analyzeECGImage = async (request: ECGAnalysisRequest): Promise<ECGAnalysisResult> => {
  try {
    // First, upload the image to get a path
    const imagePath = await uploadECGImage(request.imageFile);
    
    // Then analyze the uploaded image
    const response = await fetch(`${API_BASE_URL}/api/ecg-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imagePath }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'ECG analysis failed');
    }

    const analysisData: ECGAnalysisResponse = await response.json();
    
    // Convert API response to our format
    const result: ECGAnalysisResult = {
      id: generateId(),
      timestamp: analysisData.timestamp,
      imagePath: analysisData.image_path,
      fileName: request.fileName,
      ocrAnalysis: analysisData.ocr_analysis ? {
        extractedText: analysisData.ocr_analysis.extracted_text,
        heartRate: analysisData.ocr_analysis.heart_rate,
        unit: analysisData.ocr_analysis.unit,
        confidence: analysisData.ocr_analysis.confidence,
      } : undefined,
      waveformAnalysis: analysisData.waveform_analysis ? {
        predictedLabel: analysisData.waveform_analysis.classification.predicted_label,
        confidence: analysisData.waveform_analysis.classification.confidence,
        rhythmAnalysis: {
          description: analysisData.waveform_analysis.rhythm_analysis.description,
          severity: analysisData.waveform_analysis.rhythm_analysis.severity,
          characteristics: analysisData.waveform_analysis.rhythm_analysis.characteristics,
        },
        medicalAdvice: analysisData.waveform_analysis.medical_advice,
      } : undefined,
      combinedInsights: analysisData.combined_insights ? {
        heartRateConsistency: analysisData.combined_insights.heart_rate_consistency,
        overallAssessment: analysisData.combined_insights.overall_assessment,
        confidenceLevel: analysisData.combined_insights.confidence_level,
        keyFindings: analysisData.combined_insights.key_findings,
      } : undefined,
      medicalSummary: analysisData.medical_summary ? {
        urgencyLevel: analysisData.medical_summary.urgency_level,
        recommendations: analysisData.medical_summary.recommendations,
        limitations: analysisData.medical_summary.limitations,
      } : undefined,
      tags: generateTags(analysisData),
    };

    // Store in RAG storage
    ecgRagStorage.storeAnalysis(result);
    
    return result;
    
  } catch (error) {
    console.error('ECG Analysis Error:', error);
    throw error;
  }
};

/**
 * Upload ECG image file to server
 */
const uploadECGImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('ecgImage', file);
    
    const response = await fetch(`${API_BASE_URL}/api/upload-ecg`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload ECG image');
    }

    const result = await response.json();
    return result.imagePath;
    
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};

/**
 * Check if ECG analysis service is available
 */
export const checkECGAnalysisHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) return false;
    
    const healthData = await response.json();
    return healthData.ecgAnalysis === 'available';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

/**
 * Generate unique ID for analysis
 */
const generateId = (): string => {
  return `ecg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate tags based on analysis results
 */
const generateTags = (analysisData: ECGAnalysisResponse): string[] => {
  const tags: string[] = ['ecg', 'analysis'];
  
  if (analysisData.ocr_analysis?.heart_rate) {
    tags.push(`hr-${analysisData.ocr_analysis.heart_rate}`);
  }
  
  if (analysisData.waveform_analysis?.classification.predicted_label) {
    tags.push(analysisData.waveform_analysis.classification.predicted_label.toLowerCase());
  }
  
  if (analysisData.waveform_analysis?.rhythm_analysis.severity) {
    tags.push(analysisData.waveform_analysis.rhythm_analysis.severity);
  }
  
  if (analysisData.medical_summary?.urgency_level) {
    tags.push(analysisData.medical_summary.urgency_level);
  }
  
  return tags;
};

/**
 * Simulate ECG analysis for development/testing
 */
export const simulateECGAnalysis = async (request: ECGAnalysisRequest): Promise<ECGAnalysisResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const result: ECGAnalysisResult = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    imagePath: URL.createObjectURL(request.imageFile),
    fileName: request.fileName,
    ocrAnalysis: {
      extractedText: "HR: 72 BPM, Lead II, Normal sinus rhythm",
      heartRate: 72,
      unit: "bpm",
      confidence: "high",
    },
    waveformAnalysis: {
      predictedLabel: "normal",
      confidence: 0.89,
      rhythmAnalysis: {
        description: "Normal sinus rhythm",
        severity: "normal",
        characteristics: "Regular rhythm with normal P waves, QRS complexes, and T waves",
      },
      medicalAdvice: "Normal ECG pattern. Continue regular health monitoring.",
    },
    combinedInsights: {
      heartRateConsistency: "normal",
      overallAssessment: "reliable",
      confidenceLevel: "high",
      keyFindings: ["Heart rate: 72 bpm (normal)", "Rhythm classification: normal"],
    },
    medicalSummary: {
      urgencyLevel: "routine",
      recommendations: ["Continue regular health monitoring"],
      limitations: [
        "This is an automated analysis and should not replace professional medical evaluation",
        "Results are based on image quality and model accuracy",
        "Always consult healthcare professionals for medical decisions"
      ],
    },
    tags: ["ecg", "analysis", "hr-72", "normal", "normal", "routine"],
  };
  
  // Store in RAG storage
  ecgRagStorage.storeAnalysis(result);
  
  return result;
}; 