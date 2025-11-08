import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import { 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { useStressIndex, useSummaryStats, useRecentAlerts } from '../hooks/useApi';

function Analytics() {
  const [timeRange, setTimeRange] = useState('24h');
  const { data: stressData } = useStressIndex();
  const { data: summaryStats } = useSummaryStats();
  const { data: alerts = [] } = useRecentAlerts();
  
  // Use backend data for stress trend, fallback to mock if not available
  const stressTrend = stressData?.trend && stressData.trend.length > 0
    ? stressData.trend
    : Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        stress: Math.random() * 0.4 + 0.3 + Math.sin(i / 3) * 0.2,
        video: Math.random() * 0.3 + 0.2,
        audio: Math.random() * 0.3 + 0.2,
        iot: Math.random() * 0.3 + 0.2
      }));
  
  // Calculate average stress index from trend data
  const averageStress = stressTrend.length > 0
    ? (stressTrend.reduce((sum, item) => sum + (item.stress || 0), 0) / stressTrend.length).toFixed(2)
    : (stressData?.current || 0.58).toFixed(2);
  
  // Use sensor contributions from backend if available
  const sensorContributions = stressData?.sensorContributions || {
    video: 0.45,
    audio: 0.30,
    iot: 0.25
  };
  
  const sensorDistribution = [
    { name: 'Video', value: Math.round(sensorContributions.video * 100), color: '#8b5cf6' },
    { name: 'Audio', value: Math.round(sensorContributions.audio * 100), color: '#a855f7' },
    { name: 'IoT Sensors', value: Math.round(sensorContributions.iot * 100), color: '#10b981' }
  ];
  
  return (
    <div className="min-h-screen text-gray-900 animate-fadeIn" style={{ backgroundColor: '#FFF2E0' }}>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6 animate-slideDown">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive analysis of environmental stress patterns</p>
          </div>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: '24h', label: 'Last 24 Hours' },
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' }
            ]}
            className="w-48"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 animate-stagger">
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600 mb-1">{averageStress}</p>
              <p className="text-sm text-gray-600">Average Stress Index</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600 mb-1">{summaryStats?.alerts24h || alerts.length || 142}</p>
              <p className="text-sm text-gray-600">Total Alerts</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600 mb-1">89%</p>
              <p className="text-sm text-gray-600">System Accuracy</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-violet-600 mb-1">{summaryStats?.activeCameras || 128}</p>
              <p className="text-sm text-gray-600">Active Sensors</p>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-stagger">
          <Card title="Stress Index Trend">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stressTrend}>
                <defs>
                  <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 1]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="stress" 
                  stroke="#8b5cf6" 
                  fillOpacity={1}
                  fill="url(#stressGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          
          <Card title="Sensor Contribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sensorDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sensorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" icon="download">
            Export PDF
          </Button>
          <Button variant="primary" icon="share">
            Share Report
          </Button>
        </div>
      </main>
    </div>
  );
}

export default Analytics;


