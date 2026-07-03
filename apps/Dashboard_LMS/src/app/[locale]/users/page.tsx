"use client";

import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridFilterModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import { useRouter } from "next/navigation";

import {
  User,
  UserRole,
  CreateUserDto,
  UpdateUserDto,
  useListUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/store/services/usersApi";

// Ignore dialogs for now
// import UserFormDialog from "...";
// import DeleteConfirmDialog from "...";

export default function UsersPage() {
  const router = useRouter();

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [selected, setSelected] = React.useState<User | null>(null);

  const [openForm, setOpenForm] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const [rowSelectionModel, setRowSelectionModel] = React.useState<string[]>(
    [],
  );
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
  });
  const { data, isLoading, isFetching, isError, refetch } = useListUsersQuery({
    page: paginationModel.page + 1, // DataGrid is 0-based, API is usually 1-based
    limit: paginationModel.pageSize,
  });
  const [form, setForm] = React.useState<CreateUserDto>({
    name: "",
    name_ar: "",
    username: "",
    password: "",
    email: "",
    role: UserRole.STUDENT,
    student_id: "",
    class_code: "",
    phone: "",
    address: "",
    national_id: "",
    level_status: "",
    level: undefined,
    level_name: "",
    Graduated: false,
  });

  const handleOpenCreate = () => {
    setSelected(null);

    setForm({
      name: "",
      name_ar: "",
      username: "",
      password: "",
      email: "",
      role: UserRole.STUDENT,
      student_id: "",
      class_code: "",
      phone: "",
      address: "",
      national_id: "",
      level_status: "",
      level: undefined,
      level_name: "",
      Graduated: false,
    });

    setOpenForm(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelected(user);

    setForm({
      name: user.name,
      name_ar: user.name_ar,
      username: user.username,
      password: "",
      email: user.email ?? "",
      role: user.role,
      student_id: user.student_id,
      class_code: user.class_code,
      phone: user.phone,
      address: user.address,
      national_id: user.national_id,
      level_status: user.level_status,
      level: user.level,
      level_name: user.level_name,
      Graduated: user.Graduated,
    });

    setOpenForm(true);
  };

  const handleOpenDelete = (user: User) => {
    setSelected(user);
    setOpenDelete(true);
  };

  const onSubmit = async () => {
    try {
      if (selected) {
        const body: UpdateUserDto = { ...form };

        if (!body.password) {
          delete body.password;
        }

        await updateUser({
          id: selected.id,
          body,
        }).unwrap();
      } else {
        await createUser(form).unwrap();
      }

      setOpenForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async () => {
    if (!selected) return;

    try {
      await deleteUser(selected.id).unwrap();
      setOpenDelete(false);
    } catch (err) {
      console.error(err);
    }
  };

  const columns: GridColDef<User>[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "name_ar",
      headerName: "Arabic Name",
      flex: 1,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      width: 180,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      filterable: false,

      renderCell: (params: GridRenderCellParams<User>) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => router.push(`/users/${params.row.id}`)}
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
            <Typography variant="h4">Users</Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? "Refreshing..." : "Refresh"}
              </Button>

              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                onClick={handleOpenCreate}
              >
                New User
              </Button>
            </Stack>
          </Stack>

          <Card>
            <CardContent>
              {isLoading ? (
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  sx={{ height: 300 }}
                >
                  <CircularProgress />
                </Stack>
              ) : isError ? (
                <Typography color="error">Failed to load users.</Typography>
              ) : (
                <DataGrid
                  rows={data?.data ?? []}
                  columns={columns}
                  getRowId={(row) => row.id}
                  autoHeight
                  density="compact"
                  disableRowSelectionOnClick
                  pagination
                  paginationMode="server"
                  rowCount={data?.total ?? 0}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[5, 10, 20, 50]}
                  loading={isLoading}
                  rowSelectionModel={rowSelectionModel}
                  onRowSelectionModelChange={(newSelection) =>
                    setRowSelectionModel(newSelection as string[])
                  }
                  sortingMode="client"
                  filterModel={filterModel}
                  onFilterModelChange={setFilterModel}
                />
              )}
            </CardContent>
          </Card>

          {/* UserFormDialog */}

          {/* 
          <UserFormDialog
            open={openForm}
            form={form}
            setForm={setForm}
            loading={isCreating || isUpdating}
            onClose={() => setOpenForm(false)}
            onSubmit={onSubmit}
          />
          */}

          {/* DeleteConfirmDialog */}

          {/* 
          <DeleteConfirmDialog
            open={openDelete}
            loading={isDeleting}
            name={selected?.name}
            onClose={() => setOpenDelete(false)}
            onConfirm={onDelete}
          />
          */}
        </CardContent>
      </Card>
    </Box>
  );
}
