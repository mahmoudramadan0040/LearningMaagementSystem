// src/store/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, AuthTokens } from '@/types/auth';
import { authApi } from '../services/authApi';

// Initial state
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true, // true initially to check stored auth
  error: null,
};

// Async thunk to initialize auth from storage
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch }) => {
    if (typeof window === 'undefined') {
      return null;
    }

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (!accessToken || !refreshToken || !storedUser) {
      return null;
    }

    try {
      // Verify token is still valid by fetching profile
      const result = await dispatch(authApi.endpoints.getProfile.initiate());
      
      if ('data' in result && result.data) {
        return {
          user: result.data,
          tokens: { accessToken, refreshToken },
        };
      }
      return null;
    } catch {
      // Token invalid, clear storage
      localStorage.clear();
      return null;
    }
  }
);

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set credentials after login/register
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      
      state.user = user;
      state.tokens = { accessToken, refreshToken };
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },

    // Update user data
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },

    // Clear auth state (logout)
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },

  // Handle async thunks and RTK Query mutations
  extraReducers: (builder) => {
    // Initialize auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.tokens = action.payload.tokens;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    // Handle login mutation
    builder
      .addMatcher(
        authApi.endpoints.login.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action) => {
          const { user, accessToken, refreshToken } = action.payload;
          state.user = user;
          state.tokens = { accessToken, refreshToken };
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;

          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Login failed';
        }
      );

    // Handle register mutation
    builder
      .addMatcher(
        authApi.endpoints.register.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action) => {
          const { user, accessToken, refreshToken } = action.payload;
          state.user = user;
          state.tokens = { accessToken, refreshToken };
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;

          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Registration failed';
        }
      );

    // Handle profile update
    builder.addMatcher(
      authApi.endpoints.updateProfile.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      }
    );

    // Handle logout mutation
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        authSlice.caseReducers.logout(state);
      }
    );
  },
});

// Export actions
export const {
  setCredentials,
  updateUser,
  logout,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Role-based selectors
export const selectHasRole = (roles: string | string[]) => (state: { auth: AuthState }) => {
  const { user } = state.auth;
  if (!user) return false;
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  return requiredRoles.includes(user.role);
};

export const selectIsAdmin = (state: { auth: AuthState }) => selectHasRole('admin')(state);
export const selectIsModerator = (state: { auth: AuthState }) => selectHasRole('moderator')(state);

export default authSlice.reducer;