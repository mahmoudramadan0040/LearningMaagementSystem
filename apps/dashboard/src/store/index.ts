import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authApi } from "./services/authApi";
import { usersApi } from "./services/usersApi";
import { departmentsApi } from "./services/departmentsApi";
import { examSessionsApi } from "./services/examSessionsApi";
import { subjectsApi } from "./services/subjectApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [examSessionsApi.reducerPath]: examSessionsApi.reducer,
    [subjectsApi.reducerPath]:subjectsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      usersApi.middleware,
      departmentsApi.middleware,
      examSessionsApi.middleware,
      subjectsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
