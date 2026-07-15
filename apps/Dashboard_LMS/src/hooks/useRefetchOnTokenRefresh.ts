// src/hooks/useRefetchOnTokenRefresh.ts

import { useEffect } from 'react';

/**
 * Hook that refetches queries when token is refreshed
 * Use this in components that need to refetch after 401 recovery
 */
export function useRefetchOnTokenRefresh() {
  useEffect(() => {
    const handleTokenRefreshed = () => {
      // RTK Query will automatically use the new token on next request
      // You can trigger specific refetches here if needed
      console.log('Token refreshed, queries can now be refetched');
    };

    window.addEventListener('token-refreshed', handleTokenRefreshed);

    return () => {
      window.removeEventListener('token-refreshed', handleTokenRefreshed);
    };
  }, []);
}

/**
 * Alternative: Create a hook that wraps RTK Query hooks with auto-refetch
 */
export function useAutoRefetchQuery<TResult>(
  useQueryHook: () => {
    data?: TResult;
    isError: boolean;
    error?: any;
    refetch: () => any;
    isLoading: boolean;
  }
) {
  const queryResult = useQueryHook();
  const { isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error?.status === 401) {
      // Wait for token refresh, then refetch
      const handleTokenRefreshed = () => {
        refetch();
      };

      window.addEventListener('token-refreshed', handleTokenRefreshed);

      return () => {
        window.removeEventListener('token-refreshed', handleTokenRefreshed);
      };
    }
  }, [isError, error, refetch]);

  return queryResult;
}