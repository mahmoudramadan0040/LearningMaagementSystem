// components/DepartmentFormDialog.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
} from "@mui/material";

interface FormState {
  id?: string;
  name: string;
  Faculty: string;
}

interface DepartmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: FormState) => void;
  loading?: boolean;
  selected?: FormState | null;
}

export default function DepartmentFormDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
  selected,
}: DepartmentFormDialogProps) {
  const [form, setForm] = React.useState<FormState>(
    selected || { name: "", Faculty: "" }
  );
  const [errors, setErrors] = React.useState<{ name?: string; Faculty?: string }>(
    {}
  );

  React.useEffect(() => {
    if (selected) setForm(selected);
    else setForm({ name: "", Faculty: "" });
  }, [selected]);

  const validate = (values: FormState) => {
    const errs: typeof errors = {};
    if (!values.name?.trim()) errs.name = "Name is required";
    if (!values.Faculty?.trim()) errs.Faculty = "Faculty is required";
    return errs;
  };

  const handleSubmit = () => {
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {selected ? "Edit Department" : "Create Department"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label="Faculty"
            value={form.Faculty}
            onChange={(e) => setForm({ ...form, Faculty: e.target.value })}
            error={!!errors.Faculty}
            helperText={errors.Faculty}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
