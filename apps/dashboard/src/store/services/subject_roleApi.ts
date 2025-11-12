import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const subjectRoleApi = createApi({
  reducerPath: 'subjectRoleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/', // your NestJS base URL
  }),
  tagTypes: ['SubjectRole'],
  endpoints: (builder) => ({
    // ➕ Create a new Subject Role
    createSubjectRole: builder.mutation({
      query: (body) => ({
        url: 'subject-role',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SubjectRole'],
    }),

    // 📄 Get all roles for a subject
    getSubjectRoles: builder.query({
      query: (subjectId: string) => `subject-role/subject/${subjectId}`,
      providesTags: ['SubjectRole'],
    }),

    // 🔍 Get a single role by ID
    getSubjectRole: builder.query({
      query: (id: string) => `subject-role/${id}`,
      providesTags: ['SubjectRole'],
    }),

    // ✏️ Update
    updateSubjectRole: builder.mutation({
      query: ({ id, body }) => ({
        url: `subject-role/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['SubjectRole'],
    }),

    // ❌ Delete
    deleteSubjectRole: builder.mutation({
      query: (id: string) => ({
        url: `subject-role/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubjectRole'],
    }),
  }),
});

export const {
  useCreateSubjectRoleMutation,
  useGetSubjectRolesQuery,
  useGetSubjectRoleQuery,
  useUpdateSubjectRoleMutation,
  useDeleteSubjectRoleMutation,
} = subjectRoleApi;
