import ECGDataStorage from './ecgDataStorage';

export interface GeminiPromptData {
  patientData: string;
  recentAnalyses: string;
  statistics: string;
  recommendations: string;
  prescriptionSummary?: string;
}

class GeminiDataProvider {
  private static instance: GeminiDataProvider;
  private dataStorage: ECGDataStorage;

  private constructor() {
    this.dataStorage = ECGDataStorage.getInstance();
  }

  public static getInstance(): GeminiDataProvider {
    if (!GeminiDataProvider.instance) {
      GeminiDataProvider.instance = new GeminiDataProvider();
    }
    return GeminiDataProvider.instance;
  }

  private async getPrescriptionSummary(): Promise<string> {
    try {
      const res = await fetch('/Prescription.json');
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return '';
      const latest = data[0];
      
      let summary = 'Latest Prescription Analysis:\n';
      
      // Add patient info if available
      if (latest.structured_info) {
        if (latest.structured_info.patient_name) {
          summary += `Patient: ${latest.structured_info.patient_name}\n`;
        }
        if (latest.structured_info.date) {
          summary += `Date: ${latest.structured_info.date}\n`;
        }
        if (latest.structured_info.medicines && latest.structured_info.medicines.length > 0) {
          summary += `Medicines Detected: ${latest.structured_info.medicines.length}\n`;
        }
        if (latest.structured_info.instructions && latest.structured_info.instructions.length > 0) {
          summary += `Instructions: ${latest.structured_info.instructions.length} found\n`;
        }
      }
      
      // Add recognized medicines
      if (latest.recognized_medicines && latest.recognized_medicines.length > 0) {
        summary += '\nRecognized Medicines:';
        for (const med of latest.recognized_medicines) {
          summary += `\n- ${med.name}: ${med.description} (For: ${med.disease.join(', ')})`;
        }
      } else {
        summary += '\nNo medicines matched in database.';
      }
      
      // Add OCR text if available
      if (latest.ocr_text && latest.ocr_text !== 'No text detected') {
        summary += `\n\nOCR Text: ${latest.ocr_text.substring(0, 200)}...`;
      }
      
      return summary;
    } catch (e) {
      return '';
    }
  }

  public async getDataForPrompt(userPrompt?: string): Promise<GeminiPromptData> {
    await this.dataStorage.loadFromECGJson();
    const allData = this.dataStorage.getAllECGData();
    const analytics = this.dataStorage.getAnalyticsData();
    const latest = this.dataStorage.getLatestECGData();

    // Format patient data for Gemini
    const patientData = allData.map(item => `
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

    // Recent analyses summary
    const recentAnalyses = allData.slice(0, 3).map(item => `
Recent Analysis (${new Date(item.timestamp).toLocaleDateString()}):
- Heart Rate: ${item.heartRate.data} ${item.heartRate.unit}
- Rhythm: ${item.rhythm.data}
- Severity: ${item.severity.data}
- Urgency: ${item.urgency.data}
    `).join('\n');

    // Statistics for context
    const statistics = `
Overall Statistics:
- Total Records: ${analytics.totalRecords}
- Average Heart Rate: ${analytics.averageHeartRate} BPM
- Severity Distribution: ${Object.entries(analytics.severityDistribution).map(([level, count]) => `${level}: ${count}`).join(', ')}
- Urgency Distribution: ${Object.entries(analytics.urgencyDistribution).map(([level, count]) => `${level}: ${count}`).join(', ')}
    `;

    // Latest recommendations
    const recommendations = latest ? `
Latest Recommendations (${new Date(latest.timestamp).toLocaleDateString()}):
${latest.recommendations.data.map(rec => `- ${rec}`).join('\n')}
    ` : 'No recent recommendations available.';

    // If the prompt is about medicine or prescription, include prescription summary
    let prescriptionSummary = '';
    if (userPrompt && /prescription|medicine|medication|drug|tablet|pill|dose|pharmacy/i.test(userPrompt)) {
      prescriptionSummary = await this.getPrescriptionSummary();
    }

    return {
      patientData,
      recentAnalyses,
      statistics,
      recommendations,
      prescriptionSummary
    };
  }

  public async getContextForMedicalQuery(query: string): Promise<string> {
    const data = await this.getDataForPrompt(query);
    return `
Medical Context for Query: "${query}"

PATIENT DATA:
${data.patientData}

${data.prescriptionSummary ? `PRESCRIPTION DATA:\n${data.prescriptionSummary}\n` : ''}
RECENT ANALYSES:
${data.recentAnalyses}

STATISTICS:
${data.statistics}

LATEST RECOMMENDATIONS:
${data.recommendations}

Please provide medical advice based on this patient's ECG and prescription data and history. Consider the severity levels, urgency, medicines, and trends in the data when formulating your response.
    `;
  }

  public getTrendAnalysis(): string {
    const allData = this.dataStorage.getAllECGData();
    const analytics = this.dataStorage.getAnalyticsData();

    if (allData.length < 2) {
      return 'Insufficient data for trend analysis. Need at least 2 ECG records.';
    }

    const heartRateTrend = this.calculateTrend(allData.map(item => parseFloat(item.heartRate.data) || 0));
    const severityTrend = this.calculateSeverityTrend(allData.map(item => item.severity.level));

    return `
TREND ANALYSIS:
- Heart Rate Trend: ${heartRateTrend}
- Severity Trend: ${severityTrend}
- Average Heart Rate: ${analytics.averageHeartRate} BPM
- Most Common Severity: ${this.getMostCommon(allData.map(item => item.severity.level))}
- Most Common Urgency: ${this.getMostCommon(allData.map(item => item.urgency.level))}
    `;
  }

  private calculateTrend(values: number[]): string {
    if (values.length < 2) return 'Insufficient data';
    
    const first = values[0];
    const last = values[values.length - 1];
    const change = last - first;
    const percentChange = ((change / first) * 100).toFixed(1);
    
    if (change > 0) return `Increasing (+${percentChange}%)`;
    if (change < 0) return `Decreasing (${percentChange}%)`;
    return 'Stable (0% change)';
  }

  private calculateSeverityTrend(severities: string[]): string {
    if (severities.length < 2) return 'Insufficient data';
    
    const severityLevels = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
    const first = severityLevels[severities[0] as keyof typeof severityLevels] || 1;
    const last = severityLevels[severities[severities.length - 1] as keyof typeof severityLevels] || 1;
    
    if (last > first) return 'Worsening';
    if (last < first) return 'Improving';
    return 'Stable';
  }

  private getMostCommon(arr: string[]): string {
    const counts = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0];
  }
}

export default GeminiDataProvider; 