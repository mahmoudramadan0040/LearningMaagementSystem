"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  useCreateExamSessionMutation,
  useUpdateExamSessionMutation,
  ExamSessionDto,
} from "@/store/services/examSessionsApi";

interface ExamSessionFormDialogProps {
  open: boolean;
  onClose: () => void;
  examSession?: ExamSessionDto | null;
}

export default function ExamSessionFormDialog({
  open,
  onClose,
  examSession,
}: ExamSessionFormDialogProps) {
  const isEdit = !!examSession;

  const [createExamSession, { isLoading: isCreating, error: createError }] =
    useCreateExamSessionMutation();
  const [updateExamSession, { isLoading: isUpdating, error: updateError }] =
    useUpdateExamSessionMutation();

  const [formData, setFormData] = useState({
    name: "",
    academicYear: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (examSession) {
      setFormData({
        name: examSession.name,
        academicYear: examSession.academicYear,
      });
    } else {
      setFormData({
        name: "",
        academicYear: "",
      });
    }
    setErrors({});
  }, [examSession]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Session name is required";
    }
    if (!formData.academicYear.trim()) {
      newErrors.academicYear = "Academic year is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEdit && examSession) {
        await updateExamSession({
          id: examSession.id,
          body: formData,
        }).unwrap();
      } else {
        console.log(formData)
        await createExamSession(formData).unwrap();
      }
      onClose();
      setFormData({ name: "", academicYear: "" });
    } catch (error) {
      console.error("Error saving exam session:", error);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ name: "", academicYear: "" });
    setErrors({});
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? "Edit Exam Session" : "Create New Exam Session"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {"data" in error &&
              error.data &&
              typeof error.data === "object" &&
              "message" in error.data
                ? String(error.data.message)
                : "An error occurred while saving the exam session"}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Session Name"
              placeholder="e.g., January, May, September"
              value={formData.name}
              onChange={handleChange("name")}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              disabled={isLoading}
            />

            <TextField
              label="Academic Year"
              placeholder="e.g., 2024/2025"
              value={formData.academicYear}
              onChange={handleChange("academicYear")}
              error={!!errors.academicYear}
              helperText={errors.academicYear}
              fullWidth
              disabled={isLoading}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
