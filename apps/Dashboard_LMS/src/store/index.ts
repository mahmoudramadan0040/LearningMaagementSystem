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
export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    locale:localeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [examSessionsApi.reducerPath]: examSessionsApi.reducer,
    [subjectsApi.reducerPath]:subjectsApi.reducer,
    [subjectRoleApi.reducerPath]:subjectRoleApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      usersApi.middleware,
      departmentsApi.middleware,
      examSessionsApi.middleware,
      subjectsApi.middleware,
      subjectRoleApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
