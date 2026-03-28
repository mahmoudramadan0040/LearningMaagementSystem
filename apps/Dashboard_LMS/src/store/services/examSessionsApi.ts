import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { UUID } from "crypto";

export interface ExamSessionDto {
  id: UUID;
  name: string;
  academicYear: string;
  createdAt?: string;
  updatedAt?: string;
}

export const examSessionsApi = createApi({
  reducerPath: "examSessionsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ExamSessions"],
  endpoints: (builder) => ({
    listExamSessions: builder.query<ExamSessionDto[], void>({
      query: () => ({ url: "/exam-session" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((e) => ({
                type: "ExamSessions" as const,
                id: e.id,
              })),
              { type: "ExamSessions", id: "LIST" },
            ]
          : [{ type: "ExamSessions", id: "LIST" }],
    }),
    getExamSession: builder.query<ExamSessionDto, string>({
      query: (id) => ({ url: `/exam-session/${id}` }),
      providesTags: (_res, _err, id) => [{ type: "ExamSessions", id }],
    }),
    createExamSession: builder.mutation<
      ExamSessionDto,
      Pick<ExamSessionDto, "name" | "academicYear">
    >({
      query: (body) => ({ url: "/exam-session", method: "POST", body }),
      invalidatesTags: [{ type: "ExamSessions", id: "LIST" }],
    }),
    updateExamSession: builder.mutation<
      ExamSessionDto,
      { id: string; body: Partial<ExamSessionDto> }
    >({
      query: ({ id, body }) => ({
        url: `/exam-session/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "ExamSessions", id }],
    }),
    deleteExamSession: builder.mutation<void, string>({
      query: (id) => ({ url: `/exam-session/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "ExamSessions", id: "LIST" }],
    }),
  }),
});

export const {
  useListExamSessionsQuery,
  useGetExamSessionQuery,
  useCreateExamSessionMutation,
  useUpdateExamSessionMutation,
  useDeleteExamSessionMutation,
} = examSessionsApi;
