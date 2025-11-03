import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export interface DepartmentDto {
  id: string;
  name: string;
  Faculty: string;
}

export const departmentsApi = createApi({
  reducerPath: "departmentsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Departments"],
  endpoints: (builder) => ({
    listDepartments: builder.query<DepartmentDto[], void>({
      query: () => ({ url: "/departments" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((d) => ({
                type: "Departments" as const,
                id: d.id,
              })),
              { type: "Departments", id: "LIST" },
            ]
          : [{ type: "Departments", id: "LIST" }],
    }),
    getDepartment: builder.query<DepartmentDto, string>({
      query: (id) => ({ url: `/department/${id}` }),
      providesTags: (_res, _err, id) => [{ type: "Departments", id }],
    }),
    createDepartment: builder.mutation<DepartmentDto, Partial<DepartmentDto>>({
      query: (body) => ({ url: "/departments/department", method: "POST", body }),
      invalidatesTags: [{ type: "Departments", id: "LIST" }],
    }),
    updateDepartment: builder.mutation<
      DepartmentDto,
      { id: string; body: Partial<DepartmentDto> }
    >({
      query: ({ id, body }) => ({
        url: `/department/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Departments", id }],
    }),
    deleteDepartment: builder.mutation<void, string>({
      query: (id) => ({ url: `/departments/department/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Departments", id: "LIST" }],
    }),
  }),
});

export const {
  useListDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
