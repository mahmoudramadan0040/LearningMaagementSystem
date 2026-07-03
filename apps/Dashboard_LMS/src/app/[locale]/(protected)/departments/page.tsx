"use client";
// DepartmentsPage.tsx
import * as React from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
  Tooltip,
  CardContent,
  Card,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { GridColDef, GridRenderCellParams, DataGrid } from "@mui/x-data-grid";
import { useLocale } from "next-intl";


import {
  useListDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  DepartmentDto,
} from "@/store/services/departmentsApi";
import DepartmentFormDialog from "@/components/Department/DepartmentFormDialog";
import DeleteConfirmDialog from "@/components/Department/DeleteConfirmDialog";
import { useRouter } from "next/navigation";
type FormState = {
  id?: string;
  name: string;
  Faculty: string;
};

export default function DepartmentsPage() {
  const router = useRouter();

  // Queries & mutations
  const { data, isLoading, isFetching, isError, refetch } =
    useListDepartmentsQuery();
  const [createDepartment, { isLoading: isCreating }] =
    useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: isDeleting }] =
    useDeleteDepartmentMutation();

  // UI State
  const [openForm, setOpenForm] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selected, setSelected] = React.useState<DepartmentDto | null>(null);
  const [form, setForm] = React.useState<FormState>({ name: "", Faculty: "" });
  const [errors, setErrors] = React.useState<{
    name?: string;
    Faculty?: string;
  }>({});

  const handleOpenCreate = () => {
    setSelected(null);
    setForm({ name: "", Faculty: "" });
    setErrors({});
    setOpenForm(true);
  };

  const handleOpenEdit = (row: DepartmentDto) => {
    setSelected(row);
    setForm({ id: row.id, name: row.name, Faculty: row.Faculty });
    setErrors({});
    setOpenForm(true);
  };

  const handleOpenDelete = (row: DepartmentDto) => {
    setSelected(row);
    setOpenDelete(true);
  };

  const validate = (values: FormState) => {
    const errs: typeof errors = {};
    if (!values.name?.trim()) errs.name = "Name is required";
    if (!values.Faculty?.trim()) errs.Faculty = "Faculty is required";
    return errs;
  };

  const onSubmitData = async (form: FormState) => {
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    try {
      if (selected) {
        await updateDepartment({
          id: selected.id,
          body: { name: form.name, Faculty: form.Faculty },
        }).unwrap();
      } else {
        await createDepartment({
          name: form.name,
          Faculty: form.Faculty,
        }).unwrap();
      }
      setOpenForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onConfirmDelete = async () => {
    if (!selected) return;
    try {
      await deleteDepartment(selected.id).unwrap();
      setOpenDelete(false);
    } catch (e) {
      console.error(e);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Department Name", flex: 1, resizable: true },
    { field: "Faculty", headerName: "Faculty", flex: 1, resizable: true },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 140,
      sortable: false,
      filterable: false,
      resizable: true,
      renderCell: (params: GridRenderCellParams<DepartmentDto>) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() =>
                router.push(`departments/department/${params.row.id}`)
              }
            >
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenEdit(params.row)}
            >
              <EditSquareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleOpenDelete(params.row)}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box p={2}>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4">Departments</Typography>
            <Stack direction="row" spacing={1} >
              <Button
                variant="outlined"
                onClick={() => refetch()}
                disabled={isFetching}
                
              >
                {isFetching ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                startIcon={<AddOutlinedIcon />}
                variant="contained"
                onClick={handleOpenCreate}
                
              >
                New Department
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ height: "auto", width: "100%", maxWidth:"100%" }}>
            <Card>
              <CardContent>
                {isLoading ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: "100%" }}
                  >
                    <CircularProgress />
                  </Stack>
                ) : isError ? (
                  <Typography color="error">
                    Failed to load departments.
                  </Typography>
                ) : (
                  <DataGrid
                    density="compact"
                    rows={data ?? []}
                    columns={columns}
                    getRowId={(row: DepartmentDto) => row.id}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    disableRowSelectionOnClick
                    
                  />
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Create/Edit Dialog */}

          <DepartmentFormDialog
            open={openForm}
            onClose={() => setOpenForm(false)}
            selected={
              selected
                ? {
                    id: selected.id,
                    name: selected.name,
                    Faculty: selected.Faculty,
                  }
                : null
            }
            loading={isCreating || isUpdating}
            onSubmit={onSubmitData}
          />

          {/* Delete Confirm Dialog */}
          <DeleteConfirmDialog
            open={openDelete}
            onClose={() => setOpenDelete(false)}
            name={selected?.name}
            loading={isDeleting}
            onConfirm={onConfirmDelete}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
