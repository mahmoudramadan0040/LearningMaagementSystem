import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Define the Subject model (based on your DTO)
export interface SubjectDto {
  id: string;
  name: string;
  subject_code: string;
  level: number;
  MaxScore: number;
  MinScore: number;
  IsAddedToTotal?: boolean;
  final_min_score: number;
  final_max_score: number;
  course_work_score: number;
  summer_final_min_score: number;
  Summer_final_max_score: number;
  summer_course_work_score: number;
  grade_type: string;
  creditHours: number;
  pass_percentage: number;
  departmentId: string;
  createdAt:string;
  updatedAt:string;
}
export interface CreateSubjectDto extends Omit<SubjectDto, "id"> {}
export interface UpdateSubjectDto extends Partial<CreateSubjectDto> {}

// ✅ API base configuration
export const subjectsApi = createApi({
  reducerPath: "subjectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", // <-- adjust as needed
  }),
  tagTypes: ["Subjects"],

  endpoints: (builder) => ({
    // 🟢 Get all subjects
    listSubjects: builder.query<SubjectDto[], void>({
      query: () => "/subjects",
      providesTags: ["Subjects"],
    }),

    // 🟢 Get subject by ID
    getSubjectById: builder.query<SubjectDto, string>({
      query: (id) => `/subjects/subject/${id}`,
      providesTags: (result, error, id) => [{ type: "Subjects", id }],
    }),

    // 🟢 Create a new subject
    createSubject: builder.mutation<SubjectDto, CreateSubjectDto>({
      query: (body) => ({
        url: "/subjects/subject",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subjects"],
    }),

    // 🟢 Update a subject
    updateSubject: builder.mutation<
      SubjectDto,
      { id: string; body: UpdateSubjectDto }
    >({
      query: ({ id, body }) => ({
        url: `/subjects/subject/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Subjects", id },
        "Subjects",
      ],
    }),

    // 🟢 Delete a subject
    deleteSubject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/subjects/subject/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subjects"],
    }),
  }),
});

// ✅ Export hooks for React components
export const {
  useListSubjectsQuery,
  useGetSubjectByIdQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectsApi;
