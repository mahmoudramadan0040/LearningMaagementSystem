"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { useState } from "react";
import * as Yup from "yup";

export type SharedField = {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  options?: { label: string; value: any }[];
  disabled?: boolean;
};

interface SharedDialogFormProps {
  open: boolean;
  title: string;
  fields: SharedField[];
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

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>

      {/* Enhanced error section */}
      {formErrorMessage && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {formErrorMessage}
        </Alert>
      )}

      <DialogContent>
        {fields.map((field) =>
          field.type === "select" ? (
            <TextField
              key={field.name}
              select
              margin="dense"
              fullWidth
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
              key={field.name}
              margin="dense"
              fullWidth
              type={field.type}
              label={field.label}
              disabled={field.disabled}
              value={form[field.name]}
              error={!!formErrors[field.name]}
              helperText={formErrors[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
