"use client";
import { useState } from "react";
import {
  useGetSubjectRolesQuery,
  useCreateSubjectRoleMutation,
  useUpdateSubjectRoleMutation,
  useDeleteSubjectRoleMutation,
} from "@/store/services/subject_roleApi";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  Paper,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useParams } from "next/navigation";

export default function SubjectRolePage() {
  const params = useParams();
  const subjectId = params.id;
  const { data: roles = [], refetch } = useGetSubjectRolesQuery(
    subjectId as string
  );

  const [createRole] = useCreateSubjectRoleMutation();
  const [updateRole] = useUpdateSubjectRoleMutation();
  const [deleteRole] = useDeleteSubjectRoleMutation();

  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState<any>(null);
  const [form, setForm] = useState({
    subjectId,
    symbol: "",
    minPercentage: 0,
    maxPercentage: 0,
  });

  const handleOpen = (role?: any) => {
    setEditRole(role || null);
    setForm(
      role || { subjectId, symbol: "", minPercentage: 0, maxPercentage: 0 }
    );
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editRole) {
        await updateRole({ id: editRole.id, body: form }).unwrap();
      } else {
        await createRole(form).unwrap();
      }
      setOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteRole(id).unwrap();
    refetch();
  };

  // ✅ DataGrid Columns
  const columns: GridColDef[] = [
    { field: "symbol", headerName: "Symbol", flex: 1 },
    { field: "minPercentage", headerName: "Minimum %", flex: 1 },
    { field: "maxPercentage", headerName: "Maximum %", flex: 1 },
    {
      field: "isFinalExamOnly",
      headerName: "Rule Type",
      flex: 1,
      renderCell: (params: GridRenderCellParams<Boolean>) =>
        params.value ? (
          <Chip label="Exam Only" color="error" size="small" />
        ) : (
          <Chip label="Total" color="primary" size="small" />
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleOpen(params.row)}>
            <IconEdit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <IconTrash />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Subject Rules
      </Typography>

      <Card>
        <CardContent>
          <Button variant="contained" onClick={() => handleOpen()}>
            + Add Rule
          </Button>
          <Paper sx={{ mt: 3, height: 400, width: "100%" }}>
            <DataGrid
              rows={roles}
              density="compact"
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 20]}
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
          </Paper>
        </CardContent>
      </Card>
      {/* Dialog for Create/Edit */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editRole ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Symbol"
            fullWidth
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Min Percentage"
            type="number"
            fullWidth
            value={form.minPercentage}
            onChange={(e) =>
              setForm({ ...form, minPercentage: Number(e.target.value) })
            }
          />
          <TextField
            margin="dense"
            label="Max Percentage"
            type="number"
            fullWidth
            value={form.maxPercentage}
            onChange={(e) =>
              setForm({ ...form, maxPercentage: Number(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
