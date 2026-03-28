import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  role: string;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    listUsers: builder.query<UserDto[], void>({
      query: () => ({ url: "/users" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((u) => ({ type: "Users" as const, id: u.id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    getUser: builder.query<UserDto, string>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: (_res, _err, id) => [{ type: "Users", id }],
    }),
    createUser: builder.mutation<UserDto, Partial<UserDto>>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation<
      UserDto,
      { id: string; body: Partial<UserDto> }
    >({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: "PUT", body }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Users", id }],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useListUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
