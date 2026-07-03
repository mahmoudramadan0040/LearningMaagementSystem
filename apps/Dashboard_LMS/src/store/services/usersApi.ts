// usersApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export enum UserRole {
  STUDENT = "Student",
  TEACHING_ASSISTANT = "Teaching_Assistant",
  DOCTOR = "Doctor",
  ADMIN = "Admin",
  MANAGER = "Manager",
  STUDENT_AFFAIRS_OFFICER = "Student_Affairs_Officer",
}
export interface User {
  id: string;
  name: string;
  name_ar: string;
  student_id?: string;
  username: string;
  email?: string;
  class_code?: string;
  phone?: string;
  address?: string;
  national_id?: string;
  role: UserRole;
  level_status?: string;
  level?: number;
  level_name?: string;
  Graduated?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  name: string;
  name_ar: string;
  password: string;
  username: string;
  role: UserRole;

  student_id?: string;
  email?: string;
  class_code?: string;
  phone?: string;
  address?: string;
  national_id?: string;
  level_status?: string;
  level?: number;
  level_name?: string;
  Graduated?: boolean;
}

export type UpdateUserDto = Partial<CreateUserDto>;
export interface PaginatedUsersResponse {
  data: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface PaginationQuery {
  page?: number;
  limit?: number;
}
export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    listUsers: builder.query<PaginatedUsersResponse, PaginationQuery>({
      
      query: ({ page = 1, limit = 10 }) => ({
        url: `/users?page=${page}&limit=${limit}`,
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((user) => ({
                type: "Users" as const,
                id: user.id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    getUser: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    createUser: builder.mutation<User, CreateUserDto>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: builder.mutation<
      User,
      {
        id: string;
        body: UpdateUserDto;
      }
    >({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
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
