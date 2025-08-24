// Removed unused import

export interface ECGAnalysisData {
  fileName: string;
  timestamp: string;
  heartRate: {
    label: string;
    data: string;
    unit: string;
  };
  bloodPressure: {
    label: string;
    data: string;
    systolic?: number;
    diastolic?: number;
  };
  severity: {
    label: string;
    data: string;
    level: 'low' | 'medium' | 'high' | 'critical';
  };
  symptoms: {
    label: string;
    data: string[];
  };
  rhythm: {
    label: string;
    data: string;
    confidence: number;
  };
  urgency: {
    label: string;
    data: string;
    level: 'low' | 'medium' | 'high' | 'critical';
  };
  recommendations: {
    label: string;
    data: string[];
  };
  medicalAdvice: {
    label: string;
    data: string;
  };
}

class ECGDataStorage {
  private static instance: ECGDataStorage;
  private data: ECGAnalysisData[] = [];

  private constructor() {
    // Load existing data from ECG.json
    this.loadFromECGJson();
  }

  public static getInstance(): ECGDataStorage {
    if (!ECGDataStorage.instance) {
      ECGDataStorage.instance = new ECGDataStorage();
    }
    return ECGDataStorage.instance;
  }

  public async loadFromECGJson(): Promise<void> {
    try {
      const response = await fetch('/ECG.json');
      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json)) {
          this.data = json;
        } else if (json && typeof json === 'object') {
          this.data = [json];
        }
      }
    } catch (error) {
      console.error('Failed to load ECG data from ECG.json:', error);
      this.data = [];
    }
  }

  public addECGData(ecgData: ECGAnalysisData): void {
    this.data.unshift(ecgData); // Add to beginning of array
    this.saveToECGJson();
  }

  public getAllECGData(): ECGAnalysisData[] {
    return [...this.data];
  }

  public getLatestECGData(): ECGAnalysisData | null {
    return this.data.length > 0 ? this.data[0] : null;
  }

  public getECGDataByFileName(fileName: string): ECGAnalysisData | null {
    return this.data.find(item => item.fileName === fileName) || null;
  }

  public getECGDataForGemini(): string {
    // Format data for Gemini to understand
    return this.data.map(item => `
File: ${item.fileName}
Timestamp: ${item.timestamp}
${item.heartRate.label}: ${item.heartRate.data} ${item.heartRate.unit}
${item.bloodPressure.label}: ${item.bloodPressure.data}
${item.severity.label}: ${item.severity.data} (${item.severity.level})
${item.rhythm.label}: ${item.rhythm.data} (${(item.rhythm.confidence * 100).toFixed(1)}% confidence)
${item.urgency.label}: ${item.urgency.data} (${item.urgency.level})
${item.symptoms.label}: ${item.symptoms.data.join(', ')}
${item.medicalAdvice.label}: ${item.medicalAdvice.data}
${item.recommendations.label}: ${item.recommendations.data.join('; ')}
    `).join('\n---\n');
  }

  public getAnalyticsData(): {
    totalRecords: number;
    averageHeartRate: number;
    severityDistribution: Record<string, number>;
    urgencyDistribution: Record<string, number>;
    recentData: ECGAnalysisData[];
  } {
    if (this.data.length === 0) {
      return {
        totalRecords: 0,
        averageHeartRate: 0,
        severityDistribution: {},
        urgencyDistribution: {},
        recentData: []
      };
    }

    const heartRates = this.data
      .map(item => parseFloat(item.heartRate.data))
      .filter(rate => !isNaN(rate));

    const averageHeartRate = heartRates.length > 0 
      ? heartRates.reduce((sum, rate) => sum + rate, 0) / heartRates.length 
      : 0;

    const severityDistribution = this.data.reduce((acc, item) => {
      acc[item.severity.level] = (acc[item.severity.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const urgencyDistribution = this.data.reduce((acc, item) => {
      acc[item.urgency.level] = (acc[item.urgency.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRecords: this.data.length,
      averageHeartRate: Math.round(averageHeartRate),
      severityDistribution,
      urgencyDistribution,
      recentData: this.data.slice(0, 5) // Last 5 records
    };
  }

  private async saveToECGJson(): Promise<void> {
    try {
      await fetch('/ECG.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data, null, 2)
      });
    } catch (error) {
      console.error('Failed to save ECG data to ECG.json:', error);
    }
  }
}

export default ECGDataStorage; 