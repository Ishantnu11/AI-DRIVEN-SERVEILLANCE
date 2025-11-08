import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { api } from '../services/api';
import {
  mockSummaryStats,
  mockAlerts,
  mockStressIndex,
  mockMotionData,
  mockLiveFeeds,
  mockResolvedIncidents,
} from '../services/mockData';

/**
 * Custom hook wrapper that provides fallback to mock data when API calls fail
 * This ensures the application continues to work even when the backend is unavailable
 * 
 * @template T - The type of data being fetched
 * @param queryKey - React Query cache key
 * @param apiCall - Function that makes the API call
 * @param mockData - Fallback data to use if API fails
 * @param options - Additional React Query options
 * @returns React Query hook result with fallback data
 */
const useApiWithFallback = <T,>(
  queryKey: string[],
  apiCall: () => Promise<T>,
  mockData: T,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await apiCall();
      } catch (error) {
        // Silently fallback to mock data in production
        // In development, you might want to log this for debugging
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn(`API call failed for ${queryKey.join('/')}, using mock data:`, error);
        }
        return mockData;
      }
    },
    ...options,
  });
};

export const useSummaryStats = () => {
  return useApiWithFallback(['summary-stats'], api.getSummaryStats, mockSummaryStats);
};

/**
 * Hook to fetch recent alerts
 * 
 * Automatically refetches every 30 seconds to check for new alerts.
 * This enables real-time alert notifications across the application.
 */
export const useRecentAlerts = () => {
  return useApiWithFallback(
    ['alerts', 'recent'], 
    api.getRecentAlerts, 
    mockAlerts,
    {
      // Refetch every 30 seconds to check for new alerts
      refetchInterval: 30000,
      // Keep data fresh for 10 seconds
      staleTime: 10000,
    }
  );
};

export const useStressIndex = () => {
  return useApiWithFallback(['stress-index'], api.getStressIndex, mockStressIndex);
};

export const useMotionChart = () => {
  return useApiWithFallback(['motion-chart'], api.getMotionChart, mockMotionData);
};

export const useLiveFeeds = () => {
  return useApiWithFallback(['live-feeds'], api.getLiveFeeds, mockLiveFeeds);
};

export const useResolvedIncidents = () => {
  return useApiWithFallback(['incidents', 'resolved'], api.getResolvedIncidents, mockResolvedIncidents);
};

export const useAIAnalysis = (
  options?: Omit<UseMutationOptions<any, Error, { type: string; content: any }>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: (data: { type: string; content: any }) => api.analyzeWithAI(data),
    ...options,
  });
};


