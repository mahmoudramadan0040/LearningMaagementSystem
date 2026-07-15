// src/store/middleware/tokenRefreshMiddleware.ts (Advanced Version)

import { Middleware, isRejectedWithValue, isFulfilled } from '@reduxjs/toolkit';
import { logout, setCredentials } from '../slices/authSlice';

// Types for the middleware
interface QueueItem {
  resolve: () => void;
  reject: (reason?: unknown) => void;
}

interface RefreshState {
  isRefreshing: boolean;
  failedQueue: QueueItem[];
}

// Global refresh state
const refreshState: RefreshState = {
  isRefreshing: false,
  failedQueue: [],
};

// Auth endpoints that shouldn't trigger refresh
const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
];

const isAuthEndpoint = (url: string): boolean =>
  AUTH_ENDPOINTS.some((endpoint) => url?.includes(endpoint));

// Process pending queue
const processQueue = (error: unknown) => {
  refreshState.failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  refreshState.failedQueue = [];
};

// Custom error class for token refresh
class TokenRefreshError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenRefreshError';
  }
}

export const tokenRefreshMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Handle rejected actions
    if (isRejectedWithValue(action)) {
      const payload = action.payload as {
        status?: number;
        data?: { message?: string; error?: string };
        error?: string;
      };
      const meta = action.meta as {
        baseQueryMeta?: {
          request?: { url?: string; method?: string };
          response?: { status?: number };
        };
        arg?: {
          endpointName?: string;
          originalArgs?: unknown;
        };
      };

      const status = payload?.status || meta?.baseQueryMeta?.response?.status;
      const url = meta?.baseQueryMeta?.request?.url || '';

      // Check if this is a 401 error that needs token refresh
      if (status === 401 && !isAuthEndpoint(url)) {
        const state = store.getState() as any;
        const refreshToken = state.auth?.tokens?.refreshToken;
        const user = state.auth?.user;

        // No refresh token available - logout
        if (!refreshToken) {
          store.dispatch(logout());
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return next(action);
        }

        // Already refreshing - queue this request
        if (refreshState.isRefreshing) {
          return new Promise<void>((resolve, reject) => {
            refreshState.failedQueue.push({ resolve, reject });
          })
            .then(() => {
              // Return the original rejected action
              // The component's RTK Query hook will need to refetch
              return next(action);
            })
            .catch((error) => {
              if (error instanceof TokenRefreshError) {
                // Refresh failed, don't pass the original action
                return;
              }
              throw error;
            });
        }

        // Start the refresh process
        refreshState.isRefreshing = true;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })
          .then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || 'Token refresh failed');
            }
            return response.json();
          })
          .then((data) => {
            // Update credentials in store
            store.dispatch(
              setCredentials({
                user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken || refreshToken,
              })
            );

            // Successfully refreshed - process queue
            processQueue(null);

            // Dispatch a custom event to notify components to refetch
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('token-refreshed'));
            }
          })
          .catch((error) => {
            console.error('Token refresh failed:', error);
            
            // Refresh failed - process queue with error and logout
            processQueue(new TokenRefreshError(error.message));
            store.dispatch(logout());

            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          })
          .finally(() => {
            refreshState.isRefreshing = false;
          });

        // Don't pass the rejected action through during refresh
        return;
      }
    }

    return next(action);
  };