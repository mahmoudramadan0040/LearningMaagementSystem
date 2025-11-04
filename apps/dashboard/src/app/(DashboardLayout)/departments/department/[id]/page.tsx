"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {
  useListDepartmentsQuery,
  DepartmentDto,
} from "@/store/services/departmentsApi";
import DepartmentFormDialog from "../../components/DepartmentFormDialog";

export default function DepartmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useListDepartmentsQuery();

  if (isLoading) return <CircularProgress />;

  const department = data?.find((d: DepartmentDto) => d.id === id);
  if (!department)
    return (
      <Box p={2}>
        <Typography color="error">Department not found.</Typography>
        <Button onClick={() => router.push("/departments")}>Back</Button>
      </Box>
    );

  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>
        {department.name}
      </Typography>
      <Typography>Faculty: {department.Faculty}</Typography>

      <Box mt={3}>
        <Button variant="outlined" onClick={() => router.push("/departments")}>
          Back to List
        </Button>
      </Box>
    </Box>
  );
}