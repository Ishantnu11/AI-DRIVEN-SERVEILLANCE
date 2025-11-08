import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { useResolvedIncidents } from '../hooks/useApi';
import { ResolvedIncident } from '../services/api';

function ResolvedIncidents() {
  const [selectedIncident, setSelectedIncident] = useState<ResolvedIncident | null>(null);
  const [filter, setFilter] = useState('all');
  const { data: incidents = [] } = useResolvedIncidents();
  
  const filteredIncidents = filter === 'all' 
    ? incidents 
    : filter === 'high'
    ? incidents.filter(i => i.priority === 'High')
    : filter === 'medium'
    ? incidents.filter(i => i.priority === 'Medium')
    : incidents.filter(i => i.priority === 'Low');
  
  const handleIncidentClick = (incident: ResolvedIncident) => {
    setSelectedIncident(incident);
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
  
  const getIcon = (title: string): string => {
    if (title.toLowerCase().includes('camera')) return 'videocam';
    if (title.toLowerCase().includes('unauthorized') || title.toLowerCase().includes('access')) return 'person_off';
    if (title.toLowerCase().includes('suspicious') || title.toLowerCase().includes('motion')) return 'directions_run';
    if (title.toLowerCase().includes('stress')) return 'psychology';
    if (title.toLowerCase().includes('audio')) return 'volume_up';
    return 'check_circle';
  };
  
  return (
    <div className="min-h-screen text-gray-900 animate-fadeIn" style={{ backgroundColor: '#FFF2E0' }}>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6 animate-slideDown">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resolved Incidents</h1>
            <p className="text-gray-600">View all resolved security incidents</p>
          </div>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Incidents' },
              { value: 'high', label: 'High Priority' },
              { value: 'medium', label: 'Medium Priority' },
              { value: 'low', label: 'Low Priority' }
            ]}
            className="w-48"
          />
        </div>
        
        <div className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-gray-600 text-6xl mb-4">
                  check_circle
                </span>
                <p className="text-gray-600 text-lg">No resolved incidents found</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4 animate-stagger">
              {filteredIncidents.map((incident) => (
              <Card 
                key={incident.id}
                className="cursor-pointer hover:ring-2 hover:ring-primary hover-lift transition-all"
                onClick={() => handleIncidentClick(incident)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 text-green-500 p-3 rounded-full">
                    <span className="material-symbols-outlined text-2xl">{getIcon(incident.title)}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                      <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
                        Resolved
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{incident.location}</p>
                    {incident.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{incident.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>Resolved: {incident.resolvedAt}</span>
                      <span>•</span>
                      <span>By: {incident.resolvedBy}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full ${getPriorityBg(incident.priority)} ${getPriorityColor(incident.priority)} mb-2`}>
                      <span className="text-sm font-medium">{incident.priority}</span>
                    </div>
                    <p className="text-xs text-gray-600">ID: {incident.id}</p>
                  </div>
                </div>
              </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Modal
        isOpen={selectedIncident !== null}
        onClose={() => setSelectedIncident(null)}
        title={selectedIncident?.title || "Incident Details"}
        size="md"
      >
        {selectedIncident && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="bg-green-500/20 text-green-500 p-3 rounded-full">
                <span className="material-symbols-outlined text-3xl">{getIcon(selectedIncident.title)}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedIncident.title}</p>
                <p className="text-sm text-gray-600">{selectedIncident.location}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Priority</p>
                <p className={`font-semibold ${getPriorityColor(selectedIncident.priority)}`}>
                  {selectedIncident.priority}
                </p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="font-semibold text-green-500">Resolved</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Alert Time</p>
                <p className="font-semibold text-gray-900">{selectedIncident.originalAlertTime}</p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Resolved At</p>
                <p className="font-semibold text-gray-900">{selectedIncident.resolvedAt}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Resolved By</p>
              <p className="font-semibold text-gray-900">{selectedIncident.resolvedBy}</p>
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-gray-900">
                {selectedIncident.description}
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="primary" className="flex-1" icon="visibility">
                View Details
              </Button>
              <Button variant="secondary" className="flex-1" icon="download">
                Export Report
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ResolvedIncidents;

