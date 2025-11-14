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
  MenuItem,
  Stack,
} from "@mui/material";

import { IconEdit, IconTrash } from "@tabler/icons-react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useParams, useRouter } from "next/navigation";
import * as Yup from "yup";
export default function SubjectRolePage() {
  const params = useParams();
  const router = useRouter();
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
    ruleType: "total",
    minPercentage: 0,
    maxPercentage: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const roleSchema = Yup.object().shape({
    symbol: Yup.string().required("Symbol is required"),

    ruleType: Yup.string()
      .oneOf(["total", "exam", "excuse", "cheat"])
      .required(),

    minPercentage: Yup.number().when("ruleType", {
      is: (v: string) => v === "excuse" || v === "cheat",
      then: (schema) => schema.optional(),
      otherwise: (schema) =>
        schema
          .min(0, "Min must be ≥ 0")
          .max(100, "Min must be ≤ 100")
          .required("Minimum % is required"),
    }),

    maxPercentage: Yup.number().when("ruleType", {
      is: (v: string) => v === "excuse" || v === "cheat",
      then: (schema) => schema.optional(),
      otherwise: (schema) =>
        schema
          .min(0, "Max must be ≥ 0")
          .max(100, "Max must be ≤ 100")
          .moreThan(Yup.ref("minPercentage"), "Max must be > Min")
          .required("Maximum % is required"),
    }),
  });
  const handleOpen = (role?: any) => {
    setEditRole(role || null);
    setForm(
      role || { subjectId, symbol: "", minPercentage: 0, maxPercentage: 0 }
    );
    setOpen(true);
  };

  const handleSave = async () => {
    // clear old errors
    setFormErrors({});
    setFormErrorMessage("");
    try {
      // 1) Validate using Yup
      await roleSchema.validate(form, { abortEarly: false });
      if (editRole) {
        await updateRole({ id: editRole.id, body: form }).unwrap();
      } else {
        await createRole(form).unwrap();
      }
      setOpen(false);
      refetch();
    } catch (err: any) {
      // 2) Yup validation errors
      if (
        typeof err === "object" &&
        err !== null &&
        Array.isArray((err as any).inner)
      ) {
        const errObj: Record<string, string> = {};
        (err as any).inner.forEach((e: any) => {
          if (e.path) errObj[e.path] = e.message;
        });
        setFormErrors(errObj);
        return;
      }

      // 3) Backend API error (like duplicate range / 409)
      if (err?.data?.message) {
        setFormErrorMessage(err.data.message);
        return;
      }

      // fallback
      setFormErrorMessage("Something went wrong. Try again.");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteRole(id).unwrap();
    refetch();
  };

  function getColorForSymbol(symbol: string) {
    const colors = [
      "primary",
      "secondary",
      "success",
      "warning",
      "error",
      "info",
    ] as const;

    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash % colors.length);
    return colors[index];
  }
  // ✅ DataGrid Columns
  const columns: GridColDef[] = [
    {
      field: "symbol",
      headerName: "Symbol",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        const value = params.value;
        const color = getColorForSymbol(value);

        return (
          <Chip
            label={value}
            color={color}
            variant="outlined"
            size="small"
            sx={{
              width: "65px",
              justifyContent: "center",
              borderRadius: "4px",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          />
        );
      },
    },
    { field: "minPercentage", headerName: "Minimum %", flex: 1 },
    { field: "maxPercentage", headerName: "Maximum %", flex: 1 },
    {
      field: "ruleType",
      headerName: "Rule Type",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        const type = params.row.ruleType;

        switch (type) {
          case "exam":
            return <Chip label="Exam Only" color="error" size="small" />;

          case "total":
            return <Chip label="Total" color="primary" size="small" />;

          case "excuse":
            return <Chip label="Excuse" color="warning" size="small" />;

          case "cheat":
            return <Chip label="Cheat" color="secondary" size="small" />;

          default:
            return <Chip label="Unknown" size="small" />;
        }
      },
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
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Subject Rules
          </Typography>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ alignItems: "center" }}
            mt={2}
          >
            <Button variant="contained"  onClick={() => router.back()} sx={{margin:"4px"}}>
              Back To Subject Details
            </Button>
            <Button variant="contained" onClick={() => handleOpen()}  sx={{margin:"4px"}}>
            + Add Rule
          </Button>
          </Stack>
          
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
        {formErrorMessage && (
          <Typography color="error" sx={{ mb: 1 }}>
            {formErrorMessage}
          </Typography>
        )}
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Rule Type"
            value={form.ruleType || "total"}
            error={!!formErrors.ruleType}
            helperText={formErrors.ruleType}
            onChange={(e) => {
              const newType = e.target.value;

              // Disable + reset min/max when selecting excuse/cheat
              if (newType === "excuse" || newType === "cheat") {
                setForm({
                  ...form,
                  ruleType: newType,
                  minPercentage: 0,
                  maxPercentage: 0,
                });
              } else {
                setForm({ ...form, ruleType: newType });
              }
            }}
          >
            <MenuItem value="total">Total</MenuItem>
            <MenuItem value="exam">Exam Only</MenuItem>
            <MenuItem value="excuse">Excuse</MenuItem>
            <MenuItem value="cheat">Cheat</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Symbol"
            fullWidth
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
            error={!!formErrors.symbol}
            helperText={formErrors.symbol}
          />
          <TextField
            margin="dense"
            label="Min Percentage"
            type="number"
            disabled={form.ruleType === "excuse" || form.ruleType === "cheat"}
            error={!!formErrors.minPercentage}
            helperText={formErrors.minPercentage}
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
            disabled={form.ruleType === "excuse" || form.ruleType === "cheat"}
            fullWidth
            error={!!formErrors.maxPercentage}
            helperText={formErrors.maxPercentage}
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
