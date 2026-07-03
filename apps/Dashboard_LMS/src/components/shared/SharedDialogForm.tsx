"use client";

import { UserRole } from "@/store/services/usersApi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

export type SharedField = {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  options?: { label: string; value: any }[];
  disabled?: boolean;
  grid?: number;
  roles?: UserRole[];
};
export type SharedFieldGroup = {
  title: string;
  fields: SharedField[];
};
interface SharedDialogFormProps {
  open: boolean;
  title: string;
  fields: SharedFieldGroup[];
  schema: Yup.AnyObjectSchema;
  initialValues: Record<string, any>;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function SharedDialogForm({
  open,
  title,
  fields,
  schema,
  initialValues,
  onClose,
  onSubmit,
}: SharedDialogFormProps) {
  const [form, setForm] = useState(initialValues);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    if (open) {
      setForm(initialValues);
      setFormErrors({});
      setFormErrorMessage("");
    }
  }, [open, initialValues]);
  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initialValues);
  }, [form, initialValues]);
  const handleSave = async () => {
    setFormErrors({});
    setFormErrorMessage("");

    try {
      await schema.validate(form, { abortEarly: false });
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      if (Array.isArray(err?.inner)) {
        const obj: Record<string, string> = {};
        err.inner.forEach((e: any) => {
          if (e.path) obj[e.path] = e.message;
        });
        setFormErrors(obj);
        return;
      }

      if (err?.data?.message) {
        setFormErrorMessage(err.data.message);
        return;
      }

      setFormErrorMessage("Something went wrong.");
    }
  };
  const handleDialogClose = () => {
    if (isDirty) {
      setConfirmCloseOpen(true);
      return;
    }

    onClose();
  };
  

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>

      {/* Enhanced error section */}
      {formErrorMessage && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {formErrorMessage}
        </Alert>
      )}

      <DialogContent dividers>
        {fields.map((group) => (
          <Box key={group.title} sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                borderBottom: 1,
                borderColor: "divider",
                pb: 1,
              }}
            >
              {group.title}
            </Typography>

            <Grid container spacing={2}>
              {group.fields.map((field) => (
                <Grid
                  key={field.name}
                  size={{
                    xs: 12,
                    sm: field.grid ?? 6,
                  }}
                >
                  {field.type === "select" ? (
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label={field.label}
                      value={form[field.name]}
                      disabled={field.disabled}
                      error={!!formErrors[field.name]}
                      helperText={formErrors[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    >
                      {field.options?.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      size="small"
                      type={field.type}
                      label={field.label}
                      value={form[field.name]}
                      error={!!formErrors[field.name]}
                      helperText={formErrors[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>

      <Dialog
        open={confirmCloseOpen}
        onClose={() => setConfirmCloseOpen(false)}
      >
        <DialogTitle>Discard changes?</DialogTitle>

        <DialogContent>
          You have unsaved changes. Are you sure you want to close this form?
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmCloseOpen(false)}>
            Continue Editing
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setConfirmCloseOpen(false);
              onClose();
            }}
          >
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
