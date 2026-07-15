// src/store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authApi } from "./services/authApi";
import { usersApi } from "./services/usersApi";
import { departmentsApi } from "./services/departmentsApi";
import { examSessionsApi } from "./services/examSessionsApi";
import { subjectsApi } from "./services/subjectApi";
import { subjectRoleApi } from "./services/subject_roleApi";
import themeReducer from "./slices/themeSlice";
import localeReducer from "./slices/localeSlice";
import { tokenRefreshMiddleware } from "./middleware/tokenRefreshMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    locale: localeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [examSessionsApi.reducerPath]: examSessionsApi.reducer,
    [subjectsApi.reducerPath]: subjectsApi.reducer,
    [subjectRoleApi.reducerPath]: subjectRoleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for non-serializable data in tokens
      serializableCheck: false,
    }).concat(
      // Token refresh middleware should come BEFORE API middlewares
      tokenRefreshMiddleware,
      // API middlewares
      authApi.middleware,
      usersApi.middleware,
      departmentsApi.middleware,
      examSessionsApi.middleware,
      subjectsApi.middleware,
      subjectRoleApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
