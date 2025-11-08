import { useState } from 'react';
import Card from '../components/common/Card';
import StressIndicator from '../components/common/StressIndicator';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { useLiveFeeds } from '../hooks/useApi';

interface Camera {
  id: string;
  location: string;
  stress: number;
  status: 'active' | 'inactive' | 'warning';
  feed: string;
}

function LiveFeeds() {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [filter, setFilter] = useState('all');
  const { data: liveFeeds = [] } = useLiveFeeds();
  
  // Mock camera data (will be replaced by API)
  const cameras: Camera[] = liveFeeds.length > 0 
    ? liveFeeds.map(feed => ({
        id: feed.id,
        location: feed.location,
        stress: Math.random() * 0.5 + 0.3,
        status: feed.status as 'active' | 'inactive' | 'warning',
        feed: 'live'
      }))
    : [
        { id: 'CAM_01', location: 'Main Entrance', stress: 0.45, status: 'active', feed: 'live' },
        { id: 'CAM_02', location: 'Parking Lot A', stress: 0.32, status: 'active', feed: 'live' },
        { id: 'CAM_03', location: 'Perimeter North', stress: 0.78, status: 'active', feed: 'live' },
        { id: 'CAM_04', location: 'Lobby Area', stress: 0.56, status: 'active', feed: 'live' },
      ];
  
  const filteredCameras = filter === 'all' 
    ? cameras 
    : filter === 'high-stress' 
    ? cameras.filter(c => c.stress > 0.6)
    : cameras.filter(c => c.status === filter);
  
  const handleCameraClick = (camera: Camera) => {
    setSelectedCamera(camera);
  };
  
  const getStressColor = (value: number): string => {
    if (value <= 0.3) return 'text-green-500';
    if (value <= 0.6) return 'text-yellow-500';
    if (value <= 0.8) return 'text-orange-500';
    return 'text-red-500';
  };
  
  return (
    <div className="min-h-screen text-gray-900 animate-fadeIn" style={{ backgroundColor: '#FFF2E0' }}>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6 animate-slideDown">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Camera Feeds</h1>
            <p className="text-gray-600">Monitor all active cameras and their stress indices</p>
          </div>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Cameras' },
              { value: 'active', label: 'Active Only' },
              { value: 'high-stress', label: 'High Stress' },
              { value: 'warning', label: 'Warnings' }
            ]}
            className="w-48"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-stagger">
          {filteredCameras.map((camera) => (
            <Card 
              key={camera.id}
              className="cursor-pointer hover:ring-2 hover:ring-primary hover-lift transition-all"
              onClick={() => handleCameraClick(camera)}
            >
              <div className="space-y-4">
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <span className="material-symbols-outlined text-gray-600 text-4xl">
                    videocam
                  </span>
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-500 text-gray-900 text-xs rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{camera.location}</h3>
                  <p className="text-sm text-gray-600 mb-3">{camera.id}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Stress Index</span>
                      <span className={`text-sm font-semibold ${getStressColor(camera.stress)}`}>
                        {(camera.stress * 100).toFixed(1)}%
                      </span>
                    </div>
                    <StressIndicator value={camera.stress} showLabel={false} size="sm" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      
      <Modal
        isOpen={selectedCamera !== null}
        onClose={() => setSelectedCamera(null)}
        title={selectedCamera?.location || 'Camera Feed'}
        size="xl"
      >
        {selectedCamera && (
          <div className="space-y-6">
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <span className="material-symbols-outlined text-gray-600 text-8xl">
                videocam
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Camera ID</p>
                <p className="text-lg font-semibold text-gray-900">{selectedCamera.id}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="text-lg font-semibold text-gray-900">{selectedCamera.location}</p>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-gray-900 font-semibold mb-3">Environmental Stress Analysis</h4>
              <StressIndicator value={selectedCamera.stress} size="md" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default LiveFeeds;


