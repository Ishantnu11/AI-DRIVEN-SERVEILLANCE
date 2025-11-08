import { useEffect, useRef } from 'react';
import { useRecentAlerts } from './useApi';
import { useToast } from '../contexts/ToastContext';
import { Alert } from '../services/api';

/**
 * Custom hook to manage global alert toast notifications
 * 
 * This hook:
 * - Monitors alerts from the API
 * - Shows toast notifications for new alerts across all pages
 * - Tracks shown alerts in localStorage to prevent duplicates
 * - Only shows each alert once, even after page refresh
 * 
 * Usage: Call this hook in App.tsx to enable global alert notifications
 */
export function useAlertToasts() {
  const { data: alerts = [] } = useRecentAlerts();
  const { showToast, showError, showWarning } = useToast();
  const previousAlertsRef = useRef<Set<string>>(new Set());

  /**
   * Load previously shown alert IDs from localStorage
   * This ensures alerts are only shown once, even after page refresh
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('shownAlerts');
      if (stored) {
        const shownIds = JSON.parse(stored) as string[];
        previousAlertsRef.current = new Set(shownIds);
      }
    } catch (error) {
      // If localStorage fails, continue without persistence
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('Failed to load shown alerts from localStorage:', error);
      }
    }
  }, []);

  /**
   * Save shown alert IDs to localStorage
   * This persists across page refreshes and browser sessions
   */
  const saveShownAlerts = (alertIds: string[]) => {
    try {
      localStorage.setItem('shownAlerts', JSON.stringify(alertIds));
    } catch (error) {
      // If localStorage fails, continue without persistence
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('Failed to save shown alerts to localStorage:', error);
      }
    }
  };

  /**
   * Monitor alerts and show toasts for new ones
   * 
   * This effect runs whenever alerts change and:
   * 1. Checks each alert to see if it's been shown before
   * 2. Shows a toast notification for new alerts
   * 3. Saves the alert ID to prevent future displays
   * 4. Persists shown alerts to localStorage
   */
  useEffect(() => {
    if (alerts.length > 0) {
      const newAlerts: Alert[] = [];
      
      alerts.forEach((alert) => {
        // Only show toast for alerts we haven't seen before
        if (!previousAlertsRef.current.has(alert.id)) {
          previousAlertsRef.current.add(alert.id);
          newAlerts.push(alert);
          
          // Show toast based on priority level
          const message = `${alert.title} - ${alert.location}`;
          if (alert.priority === 'High') {
            showError(message);
          } else if (alert.priority === 'Medium') {
            showWarning(message);
          } else {
            showToast(message, 'info');
          }
        }
      });

      // Save updated list of shown alerts to localStorage
      if (newAlerts.length > 0) {
        const allShownIds = Array.from(previousAlertsRef.current);
        saveShownAlerts(allShownIds);
      }
    }
  }, [alerts, showToast, showError, showWarning]);

  /**
   * Optional: Clean up old alert IDs from localStorage
   * This prevents localStorage from growing indefinitely
   * 
   * Keep only the last 100 alert IDs to prevent storage bloat
   */
  useEffect(() => {
    const cleanupOldAlerts = () => {
      try {
        const stored = localStorage.getItem('shownAlerts');
        if (stored) {
          const shownIds = JSON.parse(stored) as string[];
          // Keep only the last 100 alert IDs
          if (shownIds.length > 100) {
            const recentIds = shownIds.slice(-100);
            localStorage.setItem('shownAlerts', JSON.stringify(recentIds));
            previousAlertsRef.current = new Set(recentIds);
          }
        }
      } catch (error) {
        // Silently handle cleanup errors
      }
    };

    // Clean up every 5 minutes
    const interval = setInterval(cleanupOldAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
}

