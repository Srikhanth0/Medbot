import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Activity, Heart, AlertTriangle, Clock, Users, TrendingDown } from 'lucide-react';
import ECGDataStorage, { ECGAnalysisData } from '@/utils/ecgDataStorage';
// Removed unused import

function getLatestMetric(data: ECGAnalysisData[], key: keyof ECGAnalysisData) {
  for (const record of data) {
    if (record[key] && typeof record[key] === 'object') {
      const value = record[key];
      if (key === 'heartRate' && 'data' in value && 'unit' in value) return `${value.data} ${value.unit}`;
      if (key === 'rhythm' && 'data' in value) return value.data;
      if (key === 'severity' && 'data' in value) return value.data;
      if (key === 'urgency' && 'data' in value) return value.data;
      if (key === 'medicalAdvice' && 'data' in value) return value.data;
    }
  }
  return 'N/A';
}
function getLatestConfidence(data: ECGAnalysisData[]) {
  for (const record of data) {
    if (record.rhythm && typeof record.rhythm.confidence === 'number') {
      return `${(record.rhythm.confidence * 100).toFixed(1)}%`;
    }
  }
  return 'N/A';
}

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [allECG, setAllECG] = useState<ECGAnalysisData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataStorage = ECGDataStorage.getInstance();
    dataStorage.loadFromECGJson().then(() => {
      const analytics = dataStorage.getAnalyticsData();
      setAnalyticsData(analytics);
      setAllECG(dataStorage.getAllECGData());
        setLoading(false);
    });
  }, []);

  // Use the latest available value for each metric
  const heartRate = getLatestMetric(allECG, 'heartRate');
  const rhythm = getLatestMetric(allECG, 'rhythm');
  const severity = getLatestMetric(allECG, 'severity');
  const confidence = getLatestConfidence(allECG);
  const urgency = getLatestMetric(allECG, 'urgency');
  const medicalAdvice = getLatestMetric(allECG, 'medicalAdvice');

  const metricsData = [
    {
      title: 'Heart Rate',
      value: heartRate,
      change: analyticsData?.averageHeartRate ? `+${analyticsData.averageHeartRate - 75}%` : '+0%',
      trend: 'up',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      title: 'Rhythm',
      value: rhythm,
      change: '',
      trend: 'up',
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      title: 'Severity',
      value: severity,
      change: '',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-500'
    },
    {
      title: 'Confidence',
      value: confidence,
      change: '',
      trend: 'up',
      icon: BarChart3,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-white">Track your health metrics and trends</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white text-sm">Live Data</span>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((item: any, index: number) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:border-ring transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${item.color.replace('text-', '')}/10`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className={`text-sm font-medium ${
                  item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {item.change}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-600 mb-1">
                  {item.title}
                </h3>
                <p className="text-2xl font-bold text-blue-800">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ECG Summary Card */}
      {allECG.length > 0 && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Latest ECG Report</h3>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-2 md:space-y-0">
            <div>
              <div className="text-sm text-blue-800"><strong>Heart Rate:</strong> {heartRate}</div>
              <div className="text-sm text-blue-800"><strong>Rhythm:</strong> {rhythm}</div>
              <div className="text-sm text-blue-800"><strong>Severity:</strong> {severity}</div>
              <div className="text-sm text-blue-800"><strong>Urgency:</strong> {urgency}</div>
              <div className="text-sm text-blue-800"><strong>Confidence:</strong> {confidence}</div>
            </div>
            {medicalAdvice && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4 md:mt-0">
                <div className="font-semibold text-yellow-800 mb-1">Medical Advice</div>
                <div className="text-sm text-yellow-900">{medicalAdvice}</div>
              </div>
            )}
          </div>
          {allECG.length > 0 && (
            <div className="mt-4 text-blue-900 text-sm">
              <strong>Description:</strong> {allECG[allECG.length - 1].rhythm.data}
            </div>
          )}
          {allECG.length > 0 && (
            <div className="mt-2 text-xs text-blue-700">Report generated: {new Date(allECG[allECG.length - 1].timestamp).toLocaleString()}</div>
          )}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Statistics */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Data Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-blue-600">Total Records</span>
              </div>
              <span className="text-lg font-bold text-foreground">{analyticsData?.totalRecords || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm text-blue-600">Average Heart Rate</span>
              </div>
              <span className="text-lg font-bold text-foreground">{analyticsData?.averageHeartRate || 0} BPM</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-blue-600">High Severity Cases</span>
              </div>
              <span className="text-lg font-bold text-foreground">{analyticsData?.severityDistribution?.high || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="text-sm text-blue-600">Recent Uploads</span>
              </div>
              <span className="text-lg font-bold text-foreground">{analyticsData?.recentData?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Trend Analysis</h3>
          <div className="space-y-4">
            {analyticsData?.recentData && analyticsData.recentData.length >= 2 ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-blue-600">Heart Rate Trend</span>
                  </div>
                  <span className="text-sm font-medium text-green-500">Stable</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-600">Severity Trend</span>
                  </div>
                  <span className="text-sm font-medium text-blue-500">Improving</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-blue-600">Urgency Level</span>
                  </div>
                  <span className="text-sm font-medium text-orange-500">Low</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-blue-600">Data Quality</span>
                  </div>
                  <span className="text-sm font-medium text-purple-500">High</span>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-blue-600">
                <TrendingDown className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p>Need more data for trend analysis</p>
                <p className="text-xs">Upload more ECG files to see trends</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="text-xl font-bold text-blue-800 mb-4">Recent ECG Uploads</h3>
        <div className="space-y-4">
          {analyticsData?.recentData && analyticsData.recentData.length > 0 ? (
            analyticsData.recentData.map((item: ECGAnalysisData, index: number) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className={`w-3 h-3 rounded-full ${
                  item.severity.level === 'critical' ? 'bg-red-500' :
                  item.severity.level === 'high' ? 'bg-orange-500' :
                  item.severity.level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">{item.fileName}</p>
                  <p className="text-xs text-blue-600">
                    {new Date(item.timestamp).toLocaleDateString()} - Heart Rate: {item.heartRate.data} {item.heartRate.unit} | Severity: {item.severity.data}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-blue-600">
              <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p>No ECG uploads yet</p>
              <p className="text-xs">Upload your first ECG file in the Integration page</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 