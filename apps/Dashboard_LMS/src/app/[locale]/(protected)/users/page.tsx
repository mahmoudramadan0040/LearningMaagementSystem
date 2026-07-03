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
  TextField,
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
import SharedDialogForm, {
  SharedField,
  SharedFieldGroup,
} from "@/components/shared/SharedDialogForm";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import {
  User,
  UserRole,
  CreateUserDto,
  UpdateUserDto,
  useListUsersQuery,
  useSearchUsersQuery,
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
  const [openCreate, setOpenCreate] = React.useState<boolean>(false);
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
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
  //  for search box
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const searchQuery = useSearchUsersQuery(
    {
      search: debouncedSearch,
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    },
    {
      skip: debouncedSearch.trim() === "",
    },
  );

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const initialValues = {
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
  };

  const userFields: SharedFieldGroup[] = [
    {
      title: "Personal Information",
      fields: [
        {
          name: "name",
          label: "Name",
          type: "text",
        },
        {
          name: "name_ar",
          label: "Arabic Name",
          type: "text",
        },
        {
          name: "username",
          label: "Username",
          type: "text",
        },
        {
          name: "password",
          label: "Password",
          type: "text",
        },
        {
          name: "email",
          label: "Email",
          type: "text",
        },
        {
          name: "phone",
          label: "Phone",
          type: "text",
        },
        {
          name: "national_id",
          label: "National ID",
          type: "text",
        },
        {
          name: "address",
          label: "Address",
          type: "text",
        },
      ],
    },
    {
      title: "User Permission",
      fields: [
        {
          name: "role",
          label: "Role",
          type: "select",
          options: [
            {
              label: "Student",
              value: UserRole.STUDENT,
            },
            {
              label: "Student Affairs Officer",
              value: UserRole.STUDENT_AFFAIRS_OFFICER,
            },
            {
              label: "Teacher",
              value: UserRole.TEACHING_ASSISTANT,
            },
            {
              label: "Doctor / Professor",
              value: UserRole.DOCTOR,
            },
            {
              label: "Manager",
              value: UserRole.MANAGER,
            },
            {
              label: "Super Admin",
              value: UserRole.ADMIN,
            },
          ],
        },
      ],
    },

    {
      title: "Academic Information",
      fields: [
        {
          name: "student_id",
          label: "Student ID",
          type: "text",
          roles: [UserRole.ADMIN, UserRole.STUDENT_AFFAIRS_OFFICER],
        },
        {
          name: "class_code",
          label: "Class Code",
          type: "text",
          roles: [UserRole.ADMIN, UserRole.STUDENT_AFFAIRS_OFFICER],
        },

        {
          name: "level_status",
          label: "Level Status",
          type: "text",
          roles: [UserRole.ADMIN, UserRole.STUDENT_AFFAIRS_OFFICER],
        },
        {
          name: "level_name",
          label: "Level Name",
          type: "text",
          roles: [UserRole.ADMIN, UserRole.STUDENT_AFFAIRS_OFFICER],
        },

        {
          name: "Graduated",
          label: "Graduated",
          type: "select",
          roles: [UserRole.ADMIN, UserRole.STUDENT_AFFAIRS_OFFICER],
          options: [
            {
              label: "Yes",
              value: true,
            },
            {
              label: "No",
              value: false,
            },
          ],
        },
      ],
    },
  ];
  // const visibleFields = userFields.filter(
  //   (field) => !field.roles || field.roles.includes(currentUser.role),
  // );
  // validation user
  const userSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    name_ar: Yup.string().required("Arabic name is required"),
    username: Yup.string().required(),
    password: Yup.string().min(8).required(),
    email: Yup.string().email().required(),
    student_id: Yup.string().required(),
    class_code: Yup.string().required(),
    phone: Yup.string().required(),
    address: Yup.string().required(),
    national_id: Yup.string().required(),
    level_status: Yup.string().required(),
    level_name: Yup.string().required(),
    role: Yup.string().required(),
    Graduated: Yup.boolean().required(),
  });

  const handleOpenDelete = (user: User) => {
    setSelected(user);
    setOpenDelete(true);
  };

  // const onSubmit = async () => {
  //   try {
  //     if (selected) {
  //       const body: UpdateUserDto = { ...form };

  //       if (!body.password) {
  //         delete body.password;
  //       }

  //       await updateUser({
  //         id: selected.id,
  //         body,
  //       }).unwrap();
  //     } else {
  //       await createUser(form).unwrap();
  //     }

  //     setOpenForm(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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
              onClick={() => handleEdit(params.row)}
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
  const rows =
    debouncedSearch.trim() === ""
      ? (data?.data ?? [])
      : (searchQuery.data?.data ?? []);

  const rowCount =
    debouncedSearch.trim() === ""
      ? (data?.total ?? 0)
      : (searchQuery.data?.total ?? 0);

  const loading =
    isLoading || isFetching || searchQuery.isLoading || searchQuery.isFetching;

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
                onClick={() => setOpenCreate(true)}
              >
                New User
              </Button>
              <TextField
                size="small"
                placeholder="Search by name, username, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
              />
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
                  rows={rows ?? []}
                  rowCount={rowCount}
                  loading={loading}
                  columns={columns}
                  getRowId={(row) => row.id}
                  density="compact"
                  disableRowSelectionOnClick
                  pagination
                  paginationMode="server"
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[5, 10, 20, 50]}
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

          {/* User Create FormDialog */}

          <SharedDialogForm
            open={openCreate}
            title="Create User"
            fields={userFields}
            schema={userSchema}
            initialValues={initialValues}
            onClose={() => setOpenCreate(false)}
            onSubmit={async (data) => {
              await createUser(data);
            }}
          />

          {/* User Edit FormDialog */}
          <SharedDialogForm
            open={openEdit}
            title="Edit User"
            fields={userFields}
            schema={userSchema}
            initialValues={selectedUser ?? initialValues}
            onClose={() => setOpenEdit(false)}
            onSubmit={async (data) => {
              // await updateUser(selectedUser.id, data);
            }}
          />
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
