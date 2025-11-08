import { Link } from 'react-router-dom';
import { Alert } from '../services/api';
import { useRecentAlerts } from '../hooks/useApi';

interface AlertItemProps {
  icon: string;
  title: string;
  location: string;
  priority: string;
  time: string;
  priorityColor: 'red' | 'yellow';
}

function AlertItem({ icon, title, location, priority, time, priorityColor }: AlertItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className={`${priorityColor === 'red' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'} p-2 rounded-full`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex-grow">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{location}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${priorityColor === 'red' ? 'text-red-600' : 'text-amber-600'}`}>
          {priority}
        </p>
        <p className="text-xs text-gray-600">{time}</p>
      </div>
    </div>
  );
}

interface RecentAlertsProps {
  onAlertClick?: (alert: Alert) => void;
}

function RecentAlerts({ onAlertClick }: RecentAlertsProps) {
  const { data: alerts = [] } = useRecentAlerts();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
        <Link to="/alerts" className="text-sm text-purple-600 hover:text-purple-700 hover:underline font-medium">
          View All Alerts
        </Link>
      </div>
      <div className="space-y-4 animate-stagger">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            onClick={() => onAlertClick && onAlertClick(alert)}
            className={`${onAlertClick ? 'cursor-pointer hover:opacity-80 transition-all hover-lift' : ''}`}
          >
            <AlertItem {...alert} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentAlerts;


