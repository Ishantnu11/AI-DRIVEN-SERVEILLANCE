import { useNavigate } from 'react-router-dom';
import { useSummaryStats } from '../hooks/useApi';

interface SummaryCardProps {
  icon: string;
  title: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}

function SummaryCard({ icon, title, value, iconBg, iconColor, onClick }: SummaryCardProps) {
  return (
    <div 
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 transition-all hover-lift ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-purple-500 hover:shadow-md hover:border-purple-300' : ''}`}
      onClick={onClick}
    >
      <div className={`${iconBg} ${iconColor} p-3 rounded-full`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function SummaryCards() {
  const { data: stats } = useSummaryStats();
  const navigate = useNavigate();

  const handleActiveCamerasClick = () => {
    navigate('/live-feeds');
  };

  const handleAlertsClick = () => {
    navigate('/alerts');
  };

  const handleResolvedIncidentsClick = () => {
    navigate('/resolved-incidents');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
      <SummaryCard
        icon="videocam"
        title="Active Cameras"
        value={stats?.activeCameras || 0}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        onClick={handleActiveCamerasClick}
      />
      <SummaryCard
        icon="warning"
        title="Alerts (24h)"
        value={stats?.alerts24h || 0}
        iconBg="bg-red-100"
        iconColor="text-red-600"
        onClick={handleAlertsClick}
      />
      <SummaryCard
        icon="task_alt"
        title="Resolved Incidents"
        value={stats?.resolvedIncidents || 0}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        onClick={handleResolvedIncidentsClick}
      />
      <SummaryCard
        icon="schedule"
        title="System Status"
        value={stats?.systemStatus || 'Unknown'}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
      />
    </div>
  );
}

export default SummaryCards;


