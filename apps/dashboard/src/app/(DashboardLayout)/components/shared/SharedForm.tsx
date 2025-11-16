"use client";

import { Box, TextField, MenuItem, Alert, Button, Grid } from "@mui/material";
import { useState } from "react";

type Option = {
  label: string;
  value: string | number;
};

export type FieldType = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "email";
  required?: boolean;
  options?: Option[];
  row?: number;
};

type SharedFormProps = {
  fields: FieldType[];
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
};

export default function SharedForm({
  fields,
  onSubmit,
  submitLabel = "Save",
}: SharedFormProps) {
  const [formData, setFormData] = useState<any>({});
  const [formError, setFormError] = useState<string | null>(null); // FORM ERROR
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}); // FIELD ERRORS
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // remove field error on typing
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateFields = () => {
    const errors: Record<string, string> = {};

    fields.forEach((f) => {
      if (f.required && !formData[f.name]) {
        errors[f.name] = `${f.label} is required`;
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!validateFields()) return;

    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setFormError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const rowGroups = Object.values(
    fields.reduce((acc: Record<string | symbol, FieldType[]>, f) => {
      const row = f.row ?? Symbol();
      if (!acc[row]) acc[row] = [];
      acc[row].push(f);
      return acc;
    }, {})
  ) as FieldType[][];
  return (
    <Box display="flex" flexDirection="column" gap={2} p={2}>
      {/* FORM ERROR */}
      {formError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {formError}
        </Alert>
      )}

      {/* Render each row ONCE */}
      {rowGroups.map((rowFields, rowIndex) => (
        <Box
          key={rowIndex}
          display="grid"
          gridTemplateColumns={`repeat(${rowFields.length}, 1fr)`}
          gap={2}
        >
          {rowFields.map((field) => (
            <TextField
              key={field.name}
              fullWidth
              select={field.type === "select"}
              name={field.name}
              label={field.label}
              type={field.type !== "select" ? field.type : undefined}
              required={field.required}
              value={formData[field.name] || ""}
              onChange={handleChange}
              error={!!fieldErrors[field.name]} // << only field error here
              helperText={fieldErrors[field.name]} // << field-specific text
            >
              {field.type === "select" &&
                field.options?.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
            </TextField>
          ))}
        </Box>
      ))}
      <Grid container justifyContent="center" mt={1}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 1, width: "150px", textAlign: "center" }}
        >
          {loading ? "Saving..." : submitLabel}
        </Button>
      </Grid>
    </Box>
  );
}
