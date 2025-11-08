import { Link, useNavigate } from 'react-router-dom';
import { useLiveFeeds } from '../hooks/useApi';

interface Camera {
  id: string;
  location: string;
  stress: number;
  status: 'active' | 'inactive' | 'warning';
}

function LiveFeed() {
  const { data: liveFeeds = [] } = useLiveFeeds();
  const navigate = useNavigate();

  // Get first 4 cameras
  const cameras: Camera[] = liveFeeds.length > 0 
    ? liveFeeds.slice(0, 4).map(feed => ({
        id: feed.id,
        location: feed.location,
        stress: Math.random() * 0.5 + 0.3,
        status: feed.status as 'active' | 'inactive' | 'warning',
      }))
    : [
        { id: 'CAM_01', location: 'Main Entrance', stress: 0.45, status: 'active' },
        { id: 'CAM_02', location: 'Parking Lot A', stress: 0.32, status: 'active' },
        { id: 'CAM_03', location: 'Perimeter North', stress: 0.78, status: 'active' },
        { id: 'CAM_04', location: 'Lobby Area', stress: 0.56, status: 'active' },
      ];

  const getStressColor = (stress: number) => {
    if (stress <= 0.3) return 'text-green-600';
    if (stress <= 0.6) return 'text-yellow-600';
    if (stress <= 0.8) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return 'bg-green-500';
    if (status === 'warning') return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const handleCameraClick = () => {
    navigate('/live-feeds');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover-lift animate-scaleIn">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Live Camera Feeds</h2>
        <Link to="/live-feeds" className="text-sm text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors">
          View All Feeds
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {cameras.map((camera, index) => (
          <div
            key={camera.id}
            onClick={handleCameraClick}
            className="group cursor-pointer animate-scaleIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300">
              {/* Live indicator */}
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                LIVE
              </div>
              
              {/* Camera feed placeholder */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-purple-50 group-hover:to-purple-100 transition-all duration-300">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-purple-400 text-4xl transition-colors duration-300">
                  videocam
                </span>
              </div>
              
              {/* Camera info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{camera.id}</p>
                    <p className="text-white/80 text-xs">{camera.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusBadge(camera.status)} animate-pulse`}></div>
                    <span className={`text-xs font-medium ${getStressColor(camera.stress)} bg-white/90 px-2 py-0.5 rounded`}>
                      {(camera.stress * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveFeed;


