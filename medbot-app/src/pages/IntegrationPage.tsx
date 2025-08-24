import React, { useState, useEffect } from 'react';
import { FileText, Activity, Clock, CheckCircle, AlertCircle, RefreshCw, Heart, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize, formatDate } from '@/lib/utils';
import FileUpload from '@/components/FileUpload';
import { analyzeECGImage, simulateECGAnalysis, checkECGAnalysisHealth } from '@/utils/ecgAnalysisApi';
import { ECGAnalysisResult } from '@/utils/ecgRagStorage';
import ECGDataStorage, { ECGAnalysisData } from '@/utils/ecgDataStorage';
import { processPrescriptionImage, simulatePrescriptionOcr } from '@/utils/prescriptionOcr';
import type { PrescriptionData } from '@/utils/prescriptionOcr';

type BaseFile = {
  id: string;
  name: string;
  uploadDate: Date;
  size: number;
  extractedData?: any;
};

type ProcessingFile = BaseFile & {
  status: 'processing';
  type: 'ecg' | 'prescription';
  error?: never;
  ecgAnalysis?: never;
  prescriptionData?: never;
};

type CompletedECGFile = BaseFile & {
  status: 'completed';
  type: 'ecg';
  error?: never;
  ecgAnalysis: ECGAnalysisResult;
  prescriptionData?: never;
};

type CompletedPrescriptionFile = BaseFile & {
  status: 'completed';
  type: 'prescription';
  error?: never;
  prescriptionData: PrescriptionData;
  ecgAnalysis?: never;
};

type ErrorFile = BaseFile & {
  status: 'error';
  type: 'ecg' | 'prescription';
  error: string;
  ecgAnalysis?: never;
  prescriptionData?: never;
};

type ProcessedFile = ProcessingFile | CompletedECGFile | CompletedPrescriptionFile | ErrorFile;

// Type guard for completed ECG files
function isCompletedECGFile(file: ProcessedFile): file is ProcessedFile & { 
  status: 'completed',
  type: 'ecg',
  ecgAnalysis: ECGAnalysisResult 
} {
  return file.status === 'completed' && file.type === 'ecg' && !!file.ecgAnalysis;
}

// Type guard for completed Prescription files
function isCompletedPrescriptionFile(file: ProcessedFile): file is ProcessedFile & { 
  status: 'completed',
  type: 'prescription',
  prescriptionData: PrescriptionData 
} {
  return file.status === 'completed' && file.type === 'prescription' && !!file.prescriptionData;
}

// Type guard for error files
function isErrorFile(file: ProcessedFile): file is ProcessedFile & { status: 'error', error: string } {
  return file.status === 'error';
}

// Type guard for processing files
function isProcessingFile(file: ProcessedFile): file is ProcessedFile & { status: 'processing' } {
  return file.status === 'processing';
}

// Utility to append to public/ECG.json (for demo/dev only)
async function appendToECGJson(newRecord: ECGAnalysisData) {
  try {
    const response = await fetch('/ECG.json');
    let data = [];
    if (response.ok) {
      const text = await response.text();
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          data = parsed;
        } else if (parsed && typeof parsed === 'object') {
          data = [parsed];
        }
      } catch (parseError) {
        console.warn('Failed to parse existing ECG.json, starting fresh:', parseError);
      }
    }
    
    data.push(newRecord);
    console.log('Would append to ECG.json:', newRecord);
  } catch (error) {
    console.error('Error appending to ECG.json:', error);
  }
}

// Prescription report component
const PrescriptionReport: React.FC = () => {
  return (
    <div className="bg-card rounded-2xl p-6 mt-8">
      <h2 className="text-xl font-bold text-card-foreground mb-4">Prescription Analysis Report</h2>
      <p className="text-card-foreground mb-4">
        Upload prescription images to extract medication information, dosages, and doctor instructions.
        Our AI-powered OCR system can process handwritten and printed prescriptions with high accuracy.
      </p>
    </div>
  );
};

const IntegrationPage: React.FC = () => {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [ecgAnalysisAvailable, setEcgAnalysisAvailable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [, setPrescriptionData] = useState<any>(null);
  // Removed unused state



  // Check ECG analysis availability on component mount
  useEffect(() => {
    checkECGAnalysisHealth().then(setEcgAnalysisAvailable);
  }, []);

  // Removed unused stats update

  const processFile = async (file: File, type: 'ecg' | 'prescription'): Promise<void> => {
    const fileId = `${Date.now()}-${file.name}`;
    const baseFile: BaseFile = {
      id: fileId,
      name: file.name,
      uploadDate: new Date(),
      size: file.size
    };

    // Add processing file to state
    const processingFile: ProcessingFile = {
      ...baseFile,
      status: 'processing',
      type
    };

    setProcessedFiles(prev => [...prev, processingFile]);

    try {
      if (type === 'ecg') {
        // Process ECG file
        let analysis: ECGAnalysisResult;
        
        if (ecgAnalysisAvailable) {
          analysis = await analyzeECGImage({ imageFile: file, fileName: file.name });
        } else {
          analysis = await simulateECGAnalysis({ imageFile: file, fileName: file.name });
        }

        // Store in ECG data storage
        const ecgData: ECGAnalysisData = {
          fileName: file.name,
          timestamp: new Date().toISOString(),
          heartRate: {
            label: 'Heart Rate',
            data: analysis.ocrAnalysis?.heartRate?.toString() || 'N/A',
            unit: analysis.ocrAnalysis?.unit || 'bpm'
          },
          bloodPressure: {
            label: 'Blood Pressure',
            data: 'N/A' // ECGAnalysisResult doesn't have blood pressure data
          },
          severity: {
            label: 'Severity',
            data: analysis.waveformAnalysis?.rhythmAnalysis?.severity || 'Unknown',
            level: (analysis.waveformAnalysis?.rhythmAnalysis?.severity?.toLowerCase() as 'low' | 'medium' | 'high' | 'critical') || 'low'
          },
          symptoms: {
            label: 'Symptoms',
            data: [] // ECGAnalysisResult doesn't have symptoms data
          },
          rhythm: {
            label: 'Rhythm',
            data: analysis.waveformAnalysis?.predictedLabel || 'Normal',
            confidence: analysis.waveformAnalysis?.confidence || 0.5
          },
          urgency: {
            label: 'Urgency',
            data: analysis.medicalSummary?.urgencyLevel || 'Low',
            level: (analysis.medicalSummary?.urgencyLevel?.toLowerCase() as 'low' | 'medium' | 'high' | 'critical') || 'low'
          },
          recommendations: {
            label: 'Recommendations',
            data: analysis.medicalSummary?.recommendations || []
          },
          medicalAdvice: {
            label: 'Medical Advice',
            data: analysis.waveformAnalysis?.medicalAdvice || 'Consult your doctor'
          }
        };

        ECGDataStorage.getInstance().addECGData(ecgData);
        await appendToECGJson(ecgData);

        // Update file status to completed
        const completedFile: CompletedECGFile = {
          ...baseFile,
          status: 'completed',
          type: 'ecg',
          ecgAnalysis: analysis
        };

        setProcessedFiles(prev => 
          prev.map(f => f.id === fileId ? completedFile : f)
        );

      } else if (type === 'prescription') {
        // Process prescription file
        let prescriptionResult: PrescriptionData;
        
        try {
          prescriptionResult = await processPrescriptionImage(file);
        } catch (error) {
          prescriptionResult = await simulatePrescriptionOcr(file);
        }

        // Update file status to completed
        const completedFile: CompletedPrescriptionFile = {
          ...baseFile,
          status: 'completed',
          type: 'prescription',
          prescriptionData: prescriptionResult
        };

        setProcessedFiles(prev => 
          prev.map(f => f.id === fileId ? completedFile : f)
        );

        // Also update the main prescription data state
        console.log('Setting prescription data:', prescriptionResult);
        setPrescriptionData(prescriptionResult);
      }

    } catch (error) {
      console.error(`Error processing ${type} file:`, error);
      
      // Update file status to error
      const errorFile: ErrorFile = {
        ...baseFile,
        status: 'error',
        type,
        error: error instanceof Error ? error.message : 'Processing failed'
      };

      setProcessedFiles(prev => 
        prev.map(f => f.id === fileId ? errorFile : f)
      );

      if (type === 'prescription') {
        setOcrError(error instanceof Error ? error.message : 'Processing failed');
      }
    }
  };

  const handlePrescriptionUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setOcrError(null);
    setPrescriptionData(null);
    
    try {
      for (const file of files) {
        await processFile(file, 'prescription');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleECGUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    for (const file of files) {
      await processFile(file, 'ecg');
    }
  };

  const handleViewDetails = (id: string) => {
    console.log('View details for file:', id);
  };

  const handleReprocess = async (id: string) => {
    const file = processedFiles.find(f => f.id === id);
    if (!file) return;

    // Remove the current file and reprocess
    setProcessedFiles(prev => prev.filter(f => f.id !== id));
    
    // Create a new File object (this is a simplified approach)
    // In a real app, you'd need to store the original file data
    const mockFile = new File([''], file.name, { type: 'application/octet-stream' });
    
    if (isErrorFile(file)) {
      await processFile(mockFile, file.type);
    }
  };

  const getStatusIcon = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'completed':
        return 'Processed';
      case 'processing':
        return 'Processing...';
      case 'error':
        return 'Error';
    }
  };

  return (
    <div className="space-y-8">
      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-card-foreground">{processedFiles.length}</div>
          <div className="text-card-foreground">Total Files</div>
        </div>
        <div className="bg-card rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {processedFiles.filter(f => f.status === 'completed').length}
          </div>
          <div className="text-card-foreground">Processed</div>
        </div>
        <div className="bg-card rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {processedFiles.filter(f => f.status === 'processing').length}
          </div>
          <div className="text-card-foreground">Processing</div>
        </div>
        <div className="bg-card rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {processedFiles.filter(f => f.status === 'error').length}
          </div>
          <div className="text-card-foreground">Errors</div>
        </div>
      </div>

      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Medical Data Integration</h1>
        <p className="text-white text-lg">
          Connect your data sources for a comprehensive health overview
        </p>
      </div>

      {/* File Upload Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ECG Upload Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upload ECG Data</h2>
          <FileUpload
            title="Upload your ECG"
            subtitle="ECG Data File"
            acceptedTypes=".pdf,.jpg,.jpeg,.png,.txt,.csv"
            onFileUpload={handleECGUpload}
          />
        </div>

        {/* Prescription Upload Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upload Prescription Data</h2>
          <FileUpload
            title="Upload Prescription"
            subtitle="Upload a clear image of your medical prescription (PNG, JPG, JPEG)"
            acceptedTypes="image/png,image/jpeg,image/jpg"
            onFileUpload={handlePrescriptionUpload}
          />
          
          {isProcessing && (
            <div className="flex items-center justify-center p-6 bg-muted/50 rounded-lg">
              <RefreshCw className="w-6 h-6 mr-2 animate-spin" />
              <span>Processing your prescription...</span>
            </div>
          )}
          
          {ocrError && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{ocrError}</span>
              </div>
            </div>
          )}
          

        </div>
      </div>
      
      {/* Processed Files Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Processed Files</h2>
        
        {processedFiles.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <FileText className="w-12 h-12 mx-auto text-white mb-2" />
            <p className="text-white">No files processed yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {processedFiles.map((file) => {
              if (isErrorFile(file)) {
                return (
                  <div key={file.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <p className="text-sm text-white">
                          {formatDate(file.uploadDate)} • {formatFileSize(file.size)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {getStatusText(file.status)}
                        </span>
                        {getStatusIcon(file.status)}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-red-500">
                      {file.error}
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReprocess(file.id)}
                      >
                        Retry
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(file.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              }
              
              if (isProcessingFile(file)) {
                return (
                  <div key={file.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <p className="text-sm text-white">
                          {formatDate(file.uploadDate)} • {formatFileSize(file.size)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {getStatusText(file.status)}
                        </span>
                        {getStatusIcon(file.status)}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-white">
                      Processing file...
                    </div>
                  </div>
                );
              }
              
              if (isCompletedECGFile(file)) {
                return (
                  <div key={file.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <p className="text-sm text-white">
                          {formatDate(file.uploadDate)} • {formatFileSize(file.size)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {getStatusText(file.status)}
                        </span>
                        {getStatusIcon(file.status)}
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <strong>ECG Analysis Complete</strong>
                        <div className="mt-1">
                          <span className="text-white">Confidence: </span>
                          <span>{(file.ecgAnalysis.waveformAnalysis?.confidence ? (file.ecgAnalysis.waveformAnalysis.confidence * 100).toFixed(1) : '0.0')}%</span>
                        </div>
                        
                        {/* ECG Analysis Details */}
                        {file.type === 'ecg' && file.ecgAnalysis && (
                          <div className="mt-2 space-y-2">
                            <div className="bg-blue-50 border border-blue-200 rounded p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Heart className="w-4 h-4 text-blue-600" />
                                <strong className="text-blue-800">ECG Analysis</strong>
                              </div>
                              <div className="text-xs space-y-1 text-blue-900">
                                <div><strong>Confidence:</strong> {file.ecgAnalysis.waveformAnalysis?.confidence?.toFixed(2) || 'N/A'}</div>
                                <div><strong>Severity:</strong> {file.ecgAnalysis.waveformAnalysis?.rhythmAnalysis?.severity || 'N/A'}</div>
                                <div><strong>Urgency:</strong> {file.ecgAnalysis.medicalSummary?.urgencyLevel || 'N/A'}</div>
                              </div>
                            </div>
                            
                            {file.ecgAnalysis.medicalSummary?.recommendations && file.ecgAnalysis.medicalSummary.recommendations.length > 0 && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <Brain className="w-4 h-4 text-yellow-600" />
                                  <strong className="text-yellow-800">Medical Advice</strong>
                                </div>
                                <div className="text-xs text-yellow-900">
                                  {file.ecgAnalysis.medicalSummary.recommendations[0]}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              
              if (isCompletedPrescriptionFile(file)) {
                return (
                  <div key={file.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <p className="text-sm text-white">
                          {formatDate(file.uploadDate)} • {formatFileSize(file.size)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {getStatusText(file.status)}
                        </span>
                        {getStatusIcon(file.status)}
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <strong>Prescription Analysis Complete</strong>
                        
                        {/* Prescription Analysis Details */}
                        {file.type === 'prescription' && file.prescriptionData && (
                          <div className="mt-2 space-y-2">
                            <div className="bg-blue-50 border border-blue-200 rounded p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <strong className="text-blue-800">Prescription Data</strong>
                              </div>
                              <div className="text-xs space-y-1 text-blue-900">
                                <div><strong>Patient:</strong> {file.prescriptionData.patientName || 'N/A'}</div>
                                <div><strong>Doctor:</strong> {file.prescriptionData.doctorName || 'N/A'}</div>
                                <div><strong>Date:</strong> {file.prescriptionData.date || 'N/A'}</div>
                              </div>
                              
                              {/* Medications List */}
                              {file.prescriptionData.medications && file.prescriptionData.medications.length > 0 && (
                                <div className="mt-2">
                                  <div className="bg-green-50 border border-green-200 rounded p-2">
                                    <div className="flex items-center gap-2 mb-2">
                                      <FileText className="w-4 h-4 text-green-600" />
                                      <strong className="text-green-800">Medications ({file.prescriptionData.medications.length})</strong>
                                    </div>
                                    <div className="space-y-2">
                                      {file.prescriptionData.medications.map((med: any, index: number) => (
                                        <div key={index} className="bg-white border border-green-100 rounded p-2">
                                          <div className="text-xs space-y-1 text-green-900">
                                            <div><strong>Name:</strong> {med.name || 'N/A'}</div>
                                            <div><strong>Dosage:</strong> {med.dosage || 'N/A'}</div>
                                            <div><strong>Frequency:</strong> {med.frequency || 'N/A'}</div>
                                            <div><strong>Duration:</strong> {med.duration || 'N/A'}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Fallback for any unhandled file types
              return (
                <div key={(file as BaseFile).id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{(file as BaseFile).name}</h3>
                      <p className="text-sm text-white">
                        {formatDate((file as BaseFile).uploadDate)} • {formatFileSize((file as BaseFile).size)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {getStatusText((file as ProcessedFile).status)}
                      </span>
                      {getStatusIcon((file as ProcessedFile).status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Integration Options */}
      <div className="bg-card rounded-2xl p-6">
        <h2 className="text-xl font-bold text-card-foreground mb-4">Integration Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Activity className="w-6 h-6 mb-2" />
            Connect Wearable Device
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <FileText className="w-6 h-6 mb-2" />
            Import from EHR System
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <CheckCircle className="w-6 h-6 mb-2" />
            Sync with Health App
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-card rounded-2xl p-6 mt-8">
        <p className="text-card-foreground text-sm leading-relaxed">
          <strong>Note:</strong> Ensure Files Are In A Compatible Format For OCR Processing. Supported Formats Include 
          PDF And Image Files. For Assistance, Please Refer To Our Help Section. All uploaded files are processed 
          using advanced AI to extract relevant medical information while maintaining HIPAA compliance.
        </p>
      </div>

      {/* Prescription Report */}
      <PrescriptionReport />
    </div>
  );
};

export default IntegrationPage;
