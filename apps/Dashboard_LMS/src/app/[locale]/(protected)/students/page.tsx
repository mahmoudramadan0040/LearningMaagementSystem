"use client";

import { useRouter } from "next/navigation";
import { useListUsersQuery, useDeleteUserMutation } from "../../../../store/services/usersApi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, IconButton, Typography, Paper } from "@mui/material";
import { IconTrash, IconEdit } from "@tabler/icons-react";

export default function StudentsPage() {
  const router = useRouter();
  const { data: students = [], isLoading } = useListUsersQuery();
  const [deleteStudent] = useDeleteUserMutation();

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "grade", headerName: "Grade", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => router.push(`/students/${params.row.id}`)}>
            <IconEdit />
          </IconButton>
          <IconButton color="error" onClick={() => deleteStudent(params.row.id)}>
            <IconTrash />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={2}>Students</Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => router.push("/students/create")}
      >
        + Add Student
      </Button>

      <Paper sx={{ height: "80%" }}>
        <DataGrid
          rows={students}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.id}
        />
      </Paper>
      
    </Box>
  );
}