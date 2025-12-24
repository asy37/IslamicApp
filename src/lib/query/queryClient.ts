/**
 * TanStack Query Client Configuration
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time: 5 dakika
      staleTime: 5 * 60 * 1000,
      // Default cache time: 10 dakika
      gcTime: 10 * 60 * 1000,
      // Retry logic
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (mobile'de genelde false)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

