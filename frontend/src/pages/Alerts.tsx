import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { useRecentAlerts } from '../hooks/useApi';
import { Alert } from '../services/api';

function Alerts() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filter, setFilter] = useState('all');
  const { data: alerts = [] } = useRecentAlerts();
  
  // For demo purposes, we'll use the recent alerts and expand with mock data
  // In production, this would fetch all alerts from the API
  const allAlerts: Alert[] = alerts.length > 0 
    ? alerts
    : [
        {
          id: '1',
          icon: 'person',
          title: 'Unauthorized Person Detected',
          location: 'CAM_12 - Entrance Hall',
          priority: 'High',
          time: '2 min ago',
          priorityColor: 'red',
          description: 'This alert was triggered by the AI surveillance system based on multi-sensor fusion analysis.',
        },
        {
          id: '2',
          icon: 'no_photography',
          title: 'Camera Obstructed',
          location: 'CAM_08 - Parking Lot',
          priority: 'Medium',
          time: '15 min ago',
          priorityColor: 'yellow',
          description: 'Camera obstruction detected in parking lot area.',
        },
        {
          id: '3',
          icon: 'directions_run',
          title: 'Suspicious Activity Detected',
          location: 'CAM_03 - Perimeter',
          priority: 'High',
          time: '28 min ago',
          priorityColor: 'red',
          description: 'Unusual movement patterns detected at perimeter.',
        },
        {
          id: '4',
          icon: 'warning',
          title: 'High Stress Index Detected',
          location: 'CAM_05 - Lobby Area',
          priority: 'Medium',
          time: '1 hour ago',
          priorityColor: 'yellow',
          description: 'Environmental stress index exceeded threshold in lobby area.',
        },
        {
          id: '5',
          icon: 'volume_up',
          title: 'Unusual Audio Pattern',
          location: 'CAM_07 - Conference Hall',
          priority: 'Low',
          time: '2 hours ago',
          priorityColor: 'yellow',
          description: 'Unusual audio frequency patterns detected.',
        },
        {
          id: '6',
          icon: 'motion_photos_on',
          title: 'Motion Anomaly',
          location: 'CAM_09 - Storage Room',
          priority: 'High',
          time: '3 hours ago',
          priorityColor: 'red',
          description: 'Unexpected motion detected in storage room during off-hours.',
        },
      ];
  
  const filteredAlerts = filter === 'all' 
    ? allAlerts 
    : filter === 'high'
    ? allAlerts.filter(a => a.priority === 'High')
    : filter === 'medium'
    ? allAlerts.filter(a => a.priority === 'Medium')
    : allAlerts.filter(a => a.priority === 'Low');
  
  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
  };
  
  const getPriorityColor = (priority: string): string => {
    if (priority === 'High') return 'text-red-500';
    if (priority === 'Medium') return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const getPriorityBg = (priority: string): string => {
    if (priority === 'High') return 'bg-red-500/20';
    if (priority === 'Medium') return 'bg-yellow-500/20';
    return 'bg-green-500/20';
  };

  // Note: Alert toast notifications are now handled globally in App.tsx
  // using the useAlertToasts hook. This ensures toasts appear on all pages
  // and are only shown once per alert, even after page refresh.
  
  return (
    <div className="min-h-screen text-gray-900 animate-fadeIn" style={{ backgroundColor: '#FFF2E0' }}>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6 animate-slideDown">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Alerts</h1>
            <p className="text-gray-600">View and manage all system alerts</p>
          </div>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Alerts' },
              { value: 'high', label: 'High Priority' },
              { value: 'medium', label: 'Medium Priority' },
              { value: 'low', label: 'Low Priority' }
            ]}
            className="w-48"
          />
        </div>
        
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-gray-600 text-6xl mb-4">
                  check_circle
                </span>
                <p className="text-gray-600 text-lg">No alerts found</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4 animate-stagger">
              {filteredAlerts.map((alert) => (
                <Card 
                  key={alert.id}
                  className="cursor-pointer hover:ring-2 hover:ring-primary hover-lift transition-all"
                  onClick={() => handleAlertClick(alert)}
                >
                <div className="flex items-center gap-4">
                  <div className={`${alert.priorityColor === 'red' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'} p-3 rounded-full`}>
                    <span className="material-symbols-outlined text-2xl">{alert.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900 mb-1">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{alert.location}</p>
                    {alert.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{alert.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full ${getPriorityBg(alert.priority)} ${getPriorityColor(alert.priority)} mb-2`}>
                      <span className="text-sm font-medium">{alert.priority}</span>
                    </div>
                    <p className="text-xs text-gray-600">{alert.time}</p>
                  </div>
                </div>
              </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Modal
        isOpen={selectedAlert !== null}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.title || "Alert Details"}
        size="md"
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <span className={`material-symbols-outlined text-3xl ${
                selectedAlert.priorityColor === 'red' ? 'text-red-500' : 'text-yellow-500'
              }`}>
                {selectedAlert.icon}
              </span>
              <div>
                <p className="font-semibold text-gray-900">{selectedAlert.title}</p>
                <p className="text-sm text-gray-600">{selectedAlert.location}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Priority</p>
                <p className={`font-semibold ${getPriorityColor(selectedAlert.priority)}`}>
                  {selectedAlert.priority}
                </p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="font-semibold text-gray-900">{selectedAlert.time}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
    </div>
  );
}

export default Alerts;


