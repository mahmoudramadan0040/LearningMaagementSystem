import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAccessToken, logout } from "../slices/authSlice";

export const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth?.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
  credentials: "include",
});

export const baseQueryWithReauth: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error &&
    (result.error as any).status &&
    ((result.error as any).status === 401 ||
      (result.error as any).status === 403)
  ) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST", body: {} },
      api,
      extraOptions
    );
    if ((refreshResult as any).data) {
      const newToken = (refreshResult as any).data.accessToken;
      api.dispatch(setAccessToken(newToken));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      if (typeof window !== "undefined") window.location.href = "/signin";
    }
  }

  return result;
};
