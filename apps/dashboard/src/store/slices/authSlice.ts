import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      const decoded: any = jwtDecode(token);
      state.accessToken = token;
      state.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
      localStorage.setItem("accessToken", token);
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded: any = jwtDecode(token);
        state.accessToken = token;
        state.user = {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
        };
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setAccessToken, loadUserFromStorage, logout } = authSlice.actions;
export default authSlice.reducer;
