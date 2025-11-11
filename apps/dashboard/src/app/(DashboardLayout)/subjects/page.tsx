"use client";
import React, { useState } from "react";
import {
  useListSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  SubjectDto,
} from "../../../store/services/subjectApi";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  CardContent,
  Card,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Switch,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { IconPlus, IconEdit, IconTrash, IconEye } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import SubjectFormDialog from "./components/SubjectForm";


export default function SubjectsPage() {
  const router = useRouter();
  const { data: subjects, isLoading ,refetch } = useListSubjectsQuery();

  const [deleteSubject,{ isLoading: isDeleting }] = useDeleteSubjectMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDto | null>(null);
  const [form, setForm] = useState<Partial<SubjectDto>>({});

  const handleOpen = (subject?: SubjectDto) => {
    setEditingSubject(subject || null);
    setForm(subject || {});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSubject(null);
    setForm({});
  };

  

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
  };
  const handleCancelDelete = () => setDeleteId(null);

  const handleConfirmDelete = async () => {
    console.log(deleteId);
    if (!deleteId) return;
    try {
      await deleteSubject(deleteId).unwrap();
      setDeleteId(null);
      refetch();
    } catch (error) {
      console.error("Error deleting exam session:", error);
    }
  };
  
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "subject_code", headerName: "Code", flex: 1 },
    {
      field: "level",
      headerName: "Level",
      flex: 0.5,
      renderCell: (params: GridRenderCellParams<Number>) => (
        <Chip
          label={`Level ${params.value}`}
          color={params.value > 2 ? "primary" : "default"}
          variant="filled"
          size="small"
        />
      ),
    },
    {
      field: "IsAddedToTotal",
      headerName: "Added To Total",
      flex: 0.7,
      renderCell: (params: GridRenderCellParams<Boolean>) =>
        params.value ? (
          <Chip label="Yes" color="primary" size="small" variant="filled" />
        ) : (
          <Chip label="No" color="error" size="small" variant="filled" />
        ),
    },
    { field: "creditHours", headerName: "Credit Hours", flex: 0.5 },
    { field: "MaxScore", headerName: "Max Score", flex: 0.6 },
    { field: "MinScore", headerName: "Min Score", flex: 0.6 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 0.7,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => router.push(`/subjects/subject/${params.row.id}`)}
            >
              <IconEye fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => handleOpen(params.row)}
              size="small"
            >
              <IconEdit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() =>  openDeleteDialog(params.row.id)}
              size="small"
            >
              <IconTrash fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Subjects
            </Typography>

            <Button
              variant="contained"
              startIcon={<IconPlus fontSize={"small"} />}
              onClick={() => handleOpen()}
              sx={{ mb: 2 }}
            >
              Add Subject
            </Button>
          </Stack>
          <Card>
            <CardContent>
              <DataGrid
                density="compact"
                rows={subjects ?? []}
                columns={columns}
                getRowId={(row: SubjectDto) => row.id}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                disableRowSelectionOnClick
                sx={{
                  border: "1px solid grey.300",

                  borderColor: "divider", // theme divider color
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #e0e0e0", // border between rows
                    borderRight: "1px solid #e0e0e0", // vertical cell borders
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    border: "1px solid #e0e0e0", // header bottom border
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              />
            </CardContent>
          </Card>

          <SubjectFormDialog
            open={open}
            onClose={handleClose}
            editingSubject={editingSubject}
          ></SubjectFormDialog>
        </CardContent>
      </Card>


      <Dialog
        open={!!deleteId}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Exam Session</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this Subject ? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
