import { useEffect, useState, useRef } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
}

/**
 * Toast Notification Component
 * 
 * Displays a temporary notification message with:
 * - Auto-dismiss after specified duration (default 5 seconds)
 * - Progress bar showing remaining time
 * - Pause on hover functionality
 * - Multiple variants (success, error, warning, info)
 * 
 * @param id - Unique identifier for the toast
 * @param message - Message to display
 * @param variant - Visual variant (success, error, warning, info)
 * @param duration - Auto-dismiss duration in milliseconds
 * @param onClose - Callback when toast is dismissed
 */
function Toast({ id, message, variant = 'info', duration = 5000, onClose }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);

  /**
   * Manages the countdown timer and progress bar animation
   * 
   * When paused (on hover):
   * - Clears the interval
   * - Stores remaining time for resumption
   * 
   * When active:
   * - Updates progress every 50ms for smooth animation
   * - Calculates progress based on elapsed time
   * - Auto-closes when progress reaches 0
   */
  useEffect(() => {
    if (isPaused) {
      // Pause: Clear interval and save remaining time
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      remainingTimeRef.current = duration * (progress / 100);
      return;
    }

    // Active: Start countdown timer
    const startTime = Date.now();
    const updateInterval = 50; // Update every 50ms for smooth animation
    const totalDuration = remainingTimeRef.current || duration;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.max(0, 100 - (elapsed / totalDuration) * 100);
      setProgress(newProgress);

      if (newProgress <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        onClose(id);
      }
    }, updateInterval);

    // Cleanup: Clear interval on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, duration, id, onClose]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
  };

  /**
   * Returns style configuration based on toast variant
   * Uses memoization pattern to avoid recalculating styles on every render
   * 
   * @returns Object containing Tailwind CSS classes for the variant
   */
  const getVariantStyles = (): {
    bg: string;
    border: string;
    text: string;
    icon: string;
    iconColor: string;
  } => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          text: 'text-green-800',
          icon: 'check_circle',
          iconColor: 'text-green-600',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          text: 'text-red-800',
          icon: 'error',
          iconColor: 'text-red-600',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-500',
          text: 'text-yellow-800',
          icon: 'warning',
          iconColor: 'text-yellow-600',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          text: 'text-blue-800',
          icon: 'info',
          iconColor: 'text-blue-600',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`relative min-w-[300px] max-w-md bg-white rounded-lg shadow-lg border-2 ${styles.border} overflow-hidden animate-slideInRight`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className={`h-full ${styles.border.replace('border-', 'bg-')}`}
          style={{
            width: `${progress}%`,
            transition: isPaused ? 'none' : 'width 50ms linear',
          }}
        />
      </div>
      
      {/* Content */}
      <div className={`p-4 ${styles.bg} flex items-start gap-3`}>
        <span className={`material-symbols-outlined ${styles.iconColor} flex-shrink-0 mt-0.5`}>
          {styles.icon}
        </span>
        <div className="flex-1">
          <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
}

export default Toast;

