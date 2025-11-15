"use client";

import { Box, TextField, MenuItem, Alert, Button } from "@mui/material";
import { useState } from "react";

type FieldType = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "email";
  required?: boolean;
  options?: { label: string; value: string | number }[];
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} p={2}>

      {/* Enhanced error section */}
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}

      {fields.map((field) => (
        <Box key={field.name}>
          {field.type === "select" ? (
            <TextField
              select
              fullWidth
              name={field.name}
              label={field.label}
              required={field.required}
              value={formData[field.name] || ""}
              onChange={handleChange}
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
              name={field.name}
              label={field.label}
              type={field.type}
              required={field.required}
              value={formData[field.name] || ""}
              onChange={handleChange}
            />
          )}
        </Box>
      ))}

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Saving..." : submitLabel}
      </Button>
    </Box>
  );
}
