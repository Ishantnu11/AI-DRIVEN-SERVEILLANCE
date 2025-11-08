import axios from 'axios';

/**
 * API Configuration
 * 
 * Base URL is read from environment variables with fallback to localhost.
 * This allows different API endpoints for development, staging, and production.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Axios instance configured for API requests
 * 
 * Features:
 * - Base URL automatically prepended to all requests
 * - JSON content type header
 * - Credentials included for session-based authentication
 * 
 * Usage:
 * ```typescript
 * apiClient.get('/endpoint') // Makes request to {API_BASE_URL}/api/endpoint
 * ```
 */
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session-based auth (cookies, tokens)
});

// Types
export interface Alert {
  id: string;
  icon: string;
  title: string;
  location: string;
  priority: 'High' | 'Medium' | 'Low';
  time: string;
  priorityColor: 'red' | 'yellow';
  description?: string;
}

export interface SummaryStats {
  activeCameras: number;
  alerts24h: number;
  resolvedIncidents: number;
  systemStatus: string;
}

export interface StressIndex {
  current: number;
  status: string;
  change1h: number;
  trend: Array<{ time: string; stress: number }>;
  sensorContributions: {
    video: number;
    audio: number;
    iot: number;
  };
}

export interface MotionData {
  time: string;
  motion: number;
}

export interface LiveFeed {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  location: string;
}

export interface ResolvedIncident {
  id: string;
  title: string;
  location: string;
  priority: 'High' | 'Medium' | 'Low';
  resolvedAt: string;
  resolvedBy: string;
  description: string;
  status: 'resolved';
  originalAlertTime: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface CurrentUserResponse {
  authenticated: boolean;
  user: User | null;
}

/**
 * API Service Functions
 * 
 * Centralized API client functions for all backend endpoints.
 * Each function handles a specific API endpoint and returns typed data.
 * 
 * Error handling:
 * - Network errors are caught by axios interceptors
 * - Response errors are thrown as exceptions
 * - Callers should wrap these in try-catch blocks
 * 
 * Usage:
 * ```typescript
 * try {
 *   const stats = await api.getSummaryStats();
 * } catch (error) {
 *   // Handle error
 * }
 * ```
 */
export const api = {
  getSummaryStats: async (): Promise<SummaryStats> => {
    const response = await apiClient.get('/summary-stats');
    return response.data;
  },

  getRecentAlerts: async (): Promise<Alert[]> => {
    const response = await apiClient.get('/alerts/recent');
    return response.data;
  },

  getStressIndex: async (): Promise<StressIndex> => {
    const response = await apiClient.get('/stress-index');
    return response.data;
  },

  getMotionChart: async (): Promise<MotionData[]> => {
    const response = await apiClient.get('/motion-chart');
    return response.data;
  },

  getLiveFeeds: async (): Promise<LiveFeed[]> => {
    const response = await apiClient.get('/live-feeds');
    return response.data;
  },

  getResolvedIncidents: async (): Promise<ResolvedIncident[]> => {
    const response = await apiClient.get('/incidents/resolved');
    return response.data;
  },

  analyzeWithAI: async (data: { type: string; content: any }): Promise<any> => {
    const response = await apiClient.post('/ai/analyze', data);
    return response.data;
  },

  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  verifyAuth0Token: async (token: string): Promise<{ success: boolean; authenticated: boolean; user: User; message: string }> => {
    const response = await apiClient.post('/auth/verify-token', { token });
    return response.data;
  },

  getSettings: async (): Promise<any> => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  saveSettings: async (settings: any): Promise<{ success: boolean; message: string; settings: any }> => {
    const response = await apiClient.post('/settings/save', settings);
    return response.data;
  },

  getSensors: async (): Promise<Sensor[]> => {
    const response = await apiClient.get('/sensors');
    return response.data;
  },

  createSensor: async (sensor: Partial<Sensor>): Promise<{ success: boolean; message: string; sensor: Sensor }> => {
    const response = await apiClient.post('/sensors/create', sensor);
    return response.data;
  },

  updateSensor: async (sensorId: string, sensor: Partial<Sensor>): Promise<{ success: boolean; message: string; sensor: Sensor }> => {
    const response = await apiClient.put(`/sensors/${sensorId}/update`, sensor);
    return response.data;
  },

  deleteSensor: async (sensorId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/sensors/${sensorId}/delete`);
    return response.data;
  },
};

export interface Sensor {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'iot';
  location: string;
  status: 'active' | 'inactive' | 'warning';
  lastUpdate: string;
  sensitivity: number;
}


