import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryCards from '../components/SummaryCards';
import LiveFeed from '../components/LiveFeed';
import MotionChart from '../components/MotionChart';
import RecentAlerts from '../components/RecentAlerts';
import StressIndicator from '../components/common/StressIndicator';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStressIndex } from '../hooks/useApi';
import { Alert } from '../services/api';

function Dashboard() {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showStressDetails, setShowStressDetails] = useState(false);
  const navigate = useNavigate();
  
  const { data: stressData } = useStressIndex();
  
  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

  const handleStressIndexClick = () => {
    navigate('/analytics');
  };
  
  return (
    <div className="min-h-screen text-gray-900 animate-fadeIn" style={{ backgroundColor: '#FFF2E0' }}>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
        {/* Environmental Stress Index Banner */}
        <Card 
          className="mb-6 border-l-4 border-l-purple-600 cursor-pointer hover:ring-2 hover:ring-purple-500 hover:shadow-lg hover-lift animate-slideDown"
          onClick={handleStressIndexClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-purple-600 text-3xl">psychology</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Environmental Stress Index</h3>
                  <p className="text-sm text-gray-600">Real-time tension measurement across all sensors</p>
                </div>
              </div>
              <StressIndicator value={stressData?.current || 0.68} size="lg" />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowStressDetails(true);
              }}
              icon="info"
            >
              Details
            </Button>
          </div>
        </Card>
        
        <div className="animate-slideUp">
          <SummaryCards />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-stagger">
          <div className="lg:col-span-2 space-y-6">
            <LiveFeed />
            
            {/* Stress Index Trend Chart */}
            <Card title="Stress Index Trend (24h)" className="animate-scaleIn">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stressData?.trend || []}>
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
          </div>
          
          <div className="space-y-6">
            <div className="animate-scaleIn">
              <MotionChart />
            </div>
            <div className="animate-scaleIn" style={{ animationDelay: '0.1s' }}>
              <RecentAlerts onAlertClick={handleAlertClick} />
            </div>
          </div>
        </div>
      </main>
      
      {/* Alert Detail Modal */}
      <Modal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={selectedAlert?.title || "Alert Details"}
        size="md"
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className={`material-symbols-outlined text-3xl ${
                selectedAlert.priorityColor === 'red' ? 'text-red-600' : 'text-amber-600'
              }`}>
                {selectedAlert.icon}
              </span>
              <div>
                <p className="font-semibold text-gray-900">{selectedAlert.title}</p>
                <p className="text-sm text-gray-600">{selectedAlert.location}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Priority</p>
                <p className={`font-semibold ${
                  selectedAlert.priorityColor === 'red' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {selectedAlert.priority}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="font-semibold text-gray-900">{selectedAlert.time}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-gray-900">
                {selectedAlert.description || 'This alert was triggered by the AI surveillance system based on multi-sensor fusion analysis. The system detected unusual patterns in video, audio, and environmental sensors.'}
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="primary" className="flex-1" icon="visibility">
                View Feed
              </Button>
              <Button variant="secondary" className="flex-1" icon="check_circle">
                Resolve
              </Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Stress Index Details Modal */}
      <Modal
        isOpen={showStressDetails}
        onClose={() => setShowStressDetails(false)}
        title="Environmental Stress Index Details"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
              <p className="text-3xl font-bold text-purple-600 mb-1">{stressData?.current.toFixed(2) || '0.68'}</p>
              <p className="text-sm text-gray-600">Current Index</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
              <p className="text-3xl font-bold text-amber-600 mb-1">{stressData?.status || 'Moderate'}</p>
              <p className="text-sm text-gray-600">Status</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
              <p className="text-3xl font-bold text-emerald-600 mb-1">+{stressData?.change1h.toFixed(2) || '0.12'}</p>
              <p className="text-sm text-gray-600">Change (1h)</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Sensor Contributions</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Video Analysis</span>
                  <span className="text-sm text-gray-900 font-medium">{stressData?.sensorContributions.video.toFixed(2) || '0.45'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(stressData?.sensorContributions.video || 0.45) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Audio Analysis</span>
                  <span className="text-sm text-gray-900 font-medium">{stressData?.sensorContributions.audio.toFixed(2) || '0.38'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-violet-600 h-2 rounded-full" style={{ width: `${(stressData?.sensorContributions.audio || 0.38) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">IoT Sensors</span>
                  <span className="text-sm text-gray-900 font-medium">{stressData?.sensorContributions.iot.toFixed(2) || '0.52'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${(stressData?.sensorContributions.iot || 0.52) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-purple-600">info</span>
              <div>
                <p className="text-sm text-gray-900 font-medium mb-1">How it works</p>
                <p className="text-xs text-gray-600">
                  The Environmental Stress Index combines video motion patterns, audio frequency analysis, 
                  and IoT sensor data (vibration, light, EM fields) to create a unified 0-1 scale tension measurement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;


