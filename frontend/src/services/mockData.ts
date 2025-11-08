import { Alert, SummaryStats, StressIndex, MotionData, LiveFeed, ResolvedIncident } from './api';

export const mockSummaryStats: SummaryStats = {
  activeCameras: 128,
  alerts24h: 16,
  resolvedIncidents: 42,
  systemStatus: 'Operational',
};

export const mockAlerts: Alert[] = [
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
];

export const mockStressIndex: StressIndex = {
  current: 0.68,
  status: 'Moderate',
  change1h: 0.12,
  trend: Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    stress: Math.random() * 0.4 + 0.3 + Math.sin(i / 3) * 0.2,
  })),
  sensorContributions: {
    video: 0.45,
    audio: 0.38,
    iot: 0.52,
  },
};

export const mockMotionData: MotionData[] = Array.from({ length: 12 }, (_, i) => ({
  time: `${i * 2}:00`,
  motion: Math.random() * 100,
}));

export const mockLiveFeeds: LiveFeed[] = [
  { id: '1', name: 'CAM_01', status: 'active', location: 'Main Entrance' },
  { id: '2', name: 'CAM_02', status: 'active', location: 'Parking Lot' },
  { id: '3', name: 'CAM_03', status: 'active', location: 'Perimeter' },
  { id: '4', name: 'CAM_04', status: 'active', location: 'Building A' },
];

export const mockResolvedIncidents: ResolvedIncident[] = [
  {
    id: 'INC_001',
    title: 'Unauthorized Access Attempt',
    location: 'CAM_05 - Main Entrance',
    priority: 'High',
    resolvedAt: '2024-01-15 14:30',
    resolvedBy: 'Security Team',
    description: 'Unauthorized person detected at main entrance. Incident resolved after security verification.',
    status: 'resolved',
    originalAlertTime: '2024-01-15 14:15'
  },
  {
    id: 'INC_002',
    title: 'Camera Malfunction',
    location: 'CAM_08 - Parking Lot',
    priority: 'Medium',
    resolvedAt: '2024-01-15 13:45',
    resolvedBy: 'Technical Team',
    description: 'Camera obstruction detected. Camera cleaned and repositioned.',
    status: 'resolved',
    originalAlertTime: '2024-01-15 13:20'
  },
  {
    id: 'INC_003',
    title: 'Suspicious Activity',
    location: 'CAM_03 - Perimeter',
    priority: 'High',
    resolvedAt: '2024-01-15 12:00',
    resolvedBy: 'Security Team',
    description: 'Unusual movement patterns detected. Verified as authorized maintenance personnel.',
    status: 'resolved',
    originalAlertTime: '2024-01-15 11:45'
  },
  {
    id: 'INC_004',
    title: 'High Stress Index',
    location: 'CAM_07 - Lobby Area',
    priority: 'Medium',
    resolvedAt: '2024-01-15 10:30',
    resolvedBy: 'System Auto-Resolve',
    description: 'Environmental stress index exceeded threshold. Returned to normal levels.',
    status: 'resolved',
    originalAlertTime: '2024-01-15 10:15'
  },
  {
    id: 'INC_005',
    title: 'Audio Anomaly',
    location: 'CAM_09 - Conference Hall',
    priority: 'Low',
    resolvedAt: '2024-01-15 09:00',
    resolvedBy: 'System Auto-Resolve',
    description: 'Unusual audio frequency patterns detected. Confirmed as normal conference activity.',
    status: 'resolved',
    originalAlertTime: '2024-01-15 08:45'
  },
  {
    id: 'INC_006',
    title: 'Motion Detection Anomaly',
    location: 'CAM_12 - Storage Room',
    priority: 'High',
    resolvedAt: '2024-01-14 18:30',
    resolvedBy: 'Security Team',
    description: 'Unexpected motion detected during off-hours. Verified as scheduled maintenance.',
    status: 'resolved',
    originalAlertTime: '2024-01-14 18:15'
  },
];


