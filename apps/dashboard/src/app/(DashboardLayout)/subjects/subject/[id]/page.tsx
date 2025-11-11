"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Chip,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useGetSubjectByIdQuery } from "@/store/services/subjectApi";

export default function SubjectDetailsTable() {
  const { id } = useParams();
  const router = useRouter();
  const { data: subject, isLoading } = useGetSubjectByIdQuery(id as string);
  let font_size = 14;
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="flex-end" mb={2}>
            <Button variant="outlined" onClick={() => router.back()}>
              Back To Subjects
            </Button>
          </Stack>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            {/* Back Button */}

            <Typography variant="h5" sx={{ p: 2 }}>
              Subject Details : {subject?.name}
            </Typography>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                {/* Row 1 */}
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: font_size }}
                    colSpan={2}
                  >
                    ID
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }} colSpan={2}>
                    {subject?.id}
                  </TableCell>
                </TableRow>

                {/* Row 2 */}
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.name}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Code
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.subject_code}
                  </TableCell>
                </TableRow>

                {/* Row 3 */}
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Level
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.level}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Added To Total
                  </TableCell>

                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.IsAddedToTotal ? (
                      <Chip label="Yes" color="primary" />
                    ) : (
                      <Chip label="No" color="error" />
                    )}
                  </TableCell>
                </TableRow>

                {/* Row 4 */}
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Max Score
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.MaxScore}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Min Score
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.MinScore}
                  </TableCell>
                </TableRow>

                {/* Row 5 */}
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Final Max Score
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.final_max_score}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Final Min Score
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.final_min_score}
                  </TableCell>
                </TableRow>

                {/* Row 6 */}
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Course Work Score
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.course_work_score}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Grade Type
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.grade_type}
                  </TableCell>
                </TableRow>

                {/* Row 7 */}
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Pass Percentage
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.pass_percentage} %{" "}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Department
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.departmentId ? (
                      <Chip label={subject?.departmentId} color="primary" />
                    ) : (
                      <Chip label="Not belong any department" color="warning" />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Credit Hours
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.creditHours} Hours{" "}
                  </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{fontWeight:"bold" , fontSize:"18px" ,textDecoration:"underline"}}>Summer Information</TableCell>
                </TableRow>
                {/* Row 8 */}
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Summer Final Max
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.Summer_final_max_score}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Summer Final Min
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.summer_final_min_score}
                  </TableCell>
                </TableRow>

                {/* Row 9 */}
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Summer Course Work
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {subject?.summer_course_work_score}
                  </TableCell>
                </TableRow>

                {/* Row 10 */}
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Updated At
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {new Date(subject?.updatedAt as string).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: font_size }}>
                    Created At
                  </TableCell>
                  <TableCell sx={{ fontSize: font_size }}>
                    {new Date(subject?.createdAt as string).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
