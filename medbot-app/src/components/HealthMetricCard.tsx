import React from 'react';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface HealthMetricCardProps {
  title: string;
  value: string;
  unit?: string;
  color: string;
  icon: React.ReactNode;
  chartData: any[];
  chartType?: 'line' | 'bar';
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  unit,
  color,
  icon,
  chartData,
  chartType = 'line'
}) => {
  return (
    <div 
      className="rounded-2xl p-6 text-white relative overflow-hidden"
      style={{ backgroundColor: color }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
      </div>

      {/* Value */}
      <div className="text-3xl font-bold mb-4">
        {value}
        {unit && <span className="text-lg ml-1">{unit}</span>}
      </div>

      {/* Chart */}
      <div className="bg-white/20 rounded-xl p-4 mb-4">
        <ResponsiveContainer width="100%" height={80}>
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="white" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <Bar dataKey="value" fill="white" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Current Reading */}
      <div className="bg-white/30 rounded-lg px-3 py-2 inline-block">
        <span className="text-2xl font-bold">{value.split('/')[0] || value}</span>
        {value.includes('/') && (
          <span className="text-lg">/{value.split('/')[1]}</span>
        )}
      </div>
    </div>
  );
};

export default HealthMetricCard; 