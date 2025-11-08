import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'completed' | 'generating';
  size: string;
  downloadUrl: string | null;
}

function Reports() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const reports: Report[] = [
    {
      id: 'RPT-001',
      title: 'Daily Stress Index Report',
      type: 'Daily',
      date: '2024-01-15',
      status: 'completed',
      size: '2.4 MB',
      downloadUrl: '#'
    },
    {
      id: 'RPT-002',
      title: 'Weekly Analytics Summary',
      type: 'Weekly',
      date: '2024-01-14',
      status: 'completed',
      size: '5.8 MB',
      downloadUrl: '#'
    },
  ];
  
  const historicalData = Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    stress: Math.random() * 0.4 + 0.3,
    incidents: Math.floor(Math.random() * 15) + 5
  }));
  
  const handleGenerateReport = () => {
    setShowGenerateModal(false);
  };
  
  return (
    <div className="min-h-screen text-gray-900 animate-fadeIn" style={{ backgroundColor: '#FFF2E0' }}>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6 animate-slideDown">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
            <p className="text-gray-600">Generate and manage historical reports</p>
          </div>
          <Button 
            variant="primary" 
            icon="add"
            onClick={() => setShowGenerateModal(true)}
          >
            Generate Report
          </Button>
        </div>
        
        <Card title="Recent Reports">
          <div className="space-y-4 animate-stagger">
            {reports.map((report) => (
              <div 
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover-lift transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <span className="material-symbols-outlined text-purple-600">description</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>ID: {report.id}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {report.status === 'completed' && (
                    <>
                      <Button variant="ghost" size="sm" icon="download">
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card title="30-Day Stress Index Trend">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 1]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a2230', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="stress" 
                  stroke="#8b5cf6" 
                  fillOpacity={1}
                  fill="url(#trendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          
          <Card title="30-Day Incident Count">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a2230', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>
      
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate New Report"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={[
              { value: 'daily', label: 'Daily Report' },
              { value: 'weekly', label: 'Weekly Report' },
              { value: 'monthly', label: 'Monthly Report' },
            ]}
            placeholder="Select report type"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => setShowGenerateModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="flex-1"
              onClick={handleGenerateReport}
              icon="file_download"
            >
              Generate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Reports;


