// ECG RAG Storage Utility
// Stores and retrieves ECG analysis results for RAG (Retrieval-Augmented Generation)

export interface ECGAnalysisResult {
  id: string;
  timestamp: string;
  imagePath: string;
  fileName: string;
  ocrAnalysis?: {
    extractedText: string;
    heartRate?: number;
    unit?: string;
    confidence: string;
  };
  waveformAnalysis?: {
    predictedLabel: string;
    confidence: number;
    rhythmAnalysis: {
      description: string;
      severity: string;
      characteristics: string;
    };
    medicalAdvice: string;
  };
  combinedInsights?: {
    heartRateConsistency: string;
    overallAssessment: string;
    confidenceLevel: string;
    keyFindings: string[];
  };
  medicalSummary?: {
    urgencyLevel: string;
    recommendations: string[];
    limitations: string[];
  };
  tags: string[];
  userId?: string;
}

class ECGRagStorage {
  private storageKey = 'medbot_ecg_analysis_data';
  private maxEntries = 100; // Keep last 100 analyses

  /**
   * Store ECG analysis result
   */
  storeAnalysis(result: ECGAnalysisResult): void {
    try {
      const existingData = this.getAllAnalyses();
      
      // Add new result
      existingData.unshift(result);
      
      // Keep only the latest entries
      if (existingData.length > this.maxEntries) {
        existingData.splice(this.maxEntries);
      }
      
      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(existingData));
      
      console.log(`✅ ECG analysis stored: ${result.id}`);
    } catch (error) {
      console.error('❌ Failed to store ECG analysis:', error);
    }
  }

  /**
   * Get all stored analyses
   */
  getAllAnalyses(): ECGAnalysisResult[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Failed to retrieve ECG analyses:', error);
      return [];
    }
  }

  /**
   * Get analysis by ID
   */
  getAnalysisById(id: string): ECGAnalysisResult | null {
    const analyses = this.getAllAnalyses();
    return analyses.find(analysis => analysis.id === id) || null;
  }

  /**
   * Search analyses by tags or content
   */
  searchAnalyses(query: string): ECGAnalysisResult[] {
    const analyses = this.getAllAnalyses();
    const lowerQuery = query.toLowerCase();
    
    return analyses.filter(analysis => {
      // Search in tags
      if (analysis.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        return true;
      }
      
      // Search in extracted text
      if (analysis.ocrAnalysis?.extractedText.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Search in predicted label
      if (analysis.waveformAnalysis?.predictedLabel.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Search in medical advice
      if (analysis.waveformAnalysis?.medicalAdvice.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * Get analyses by severity level
   */
  getAnalysesBySeverity(severity: string): ECGAnalysisResult[] {
    const analyses = this.getAllAnalyses();
    return analyses.filter(analysis => 
      analysis.waveformAnalysis?.rhythmAnalysis.severity === severity
    );
  }

  /**
   * Get recent analyses (last N days)
   */
  getRecentAnalyses(days: number = 30): ECGAnalysisResult[] {
    const analyses = this.getAllAnalyses();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return analyses.filter(analysis => 
      new Date(analysis.timestamp) > cutoffDate
    );
  }

  /**
   * Delete analysis by ID
   */
  deleteAnalysis(id: string): boolean {
    try {
      const analyses = this.getAllAnalyses();
      const filteredAnalyses = analyses.filter(analysis => analysis.id !== id);
      
      if (filteredAnalyses.length !== analyses.length) {
        localStorage.setItem(this.storageKey, JSON.stringify(filteredAnalyses));
        console.log(`✅ ECG analysis deleted: ${id}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Failed to delete ECG analysis:', error);
      return false;
    }
  }

  /**
   * Clear all stored analyses
   */
  clearAllAnalyses(): void {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('✅ All ECG analyses cleared');
    } catch (error) {
      console.error('❌ Failed to clear ECG analyses:', error);
    }
  }

  /**
   * Export analyses as JSON file
   */
  exportAnalyses(): void {
    try {
      const analyses = this.getAllAnalyses();
      const dataStr = JSON.stringify(analyses, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `ecg_analyses_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      console.log('✅ ECG analyses exported');
    } catch (error) {
      console.error('❌ Failed to export ECG analyses:', error);
    }
  }

  /**
   * Import analyses from JSON file
   */
  importAnalyses(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const analyses = JSON.parse(content) as ECGAnalysisResult[];
          
          // Validate the imported data
          if (Array.isArray(analyses)) {
            const existingData = this.getAllAnalyses();
            const mergedData = [...analyses, ...existingData];
            
            // Remove duplicates based on ID
            const uniqueData = mergedData.filter((analysis, index, self) => 
              index === self.findIndex(a => a.id === analysis.id)
            );
            
            localStorage.setItem(this.storageKey, JSON.stringify(uniqueData));
            console.log('✅ ECG analyses imported successfully');
            resolve(true);
          } else {
            reject(new Error('Invalid file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Get statistics about stored analyses
   */
  getStatistics() {
    const analyses = this.getAllAnalyses();
    
    const severityCounts = analyses.reduce((acc, analysis) => {
      const severity = analysis.waveformAnalysis?.rhythmAnalysis.severity || 'unknown';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const urgencyCounts = analyses.reduce((acc, analysis) => {
      const urgency = analysis.medicalSummary?.urgencyLevel || 'unknown';
      acc[urgency] = (acc[urgency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalAnalyses: analyses.length,
      severityCounts,
      urgencyCounts,
      averageConfidence: analyses.length > 0 
        ? analyses.reduce((sum, analysis) => 
            sum + (analysis.waveformAnalysis?.confidence || 0), 0) / analyses.length
        : 0
    };
  }
}

// Export singleton instance
export const ecgRagStorage = new ECGRagStorage(); 