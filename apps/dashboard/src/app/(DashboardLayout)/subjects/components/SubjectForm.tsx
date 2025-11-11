"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import * as yup from "yup";
import {
  SubjectDto,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} from "@/store/services/subjectApi";

export const subjectSchema = yup.object({
  name: yup.string().required("Name is required"),
  subject_code: yup.string().required("Subject code is required"),
  level: yup
    .number()
    .typeError("Level must be a number")
    .required("Level is required")
    .min(1, "Level must be at least 1"),
  creditHours: yup
    .number()
    .typeError("Credit hours must be a number")
    .required("Credit hours are required")
    .min(1, "Credit hours must be at least 1"),
  MaxScore: yup
    .number()
    .typeError("Max score must be a number")
    .required("Max score is required")
    .min(1, "Must be greater than 0"),
  MinScore: yup
    .number()
    .typeError("Min score must be a number")
    .required("Min score is required")
    .min(0, "Cannot be negative")
    .when("MaxScore", (maxScore, schema) =>
      maxScore
        ? schema.max(maxScore as any, "Min score cannot exceed Max score")
        : schema
    ),
  final_max_score: yup
    .number()
    .typeError("Final max score must be a number")
    .required("Final max score is required"),
  final_min_score: yup
    .number()
    .typeError("Final min score must be a number")
    .required("Final min score is required")
    .when("final_max_score", (final_max_score, schema) =>
      typeof final_max_score === "number"
        ? schema.max(final_max_score, "Final min cannot exceed Final max")
        : schema
    ),
  course_work_score: yup
    .number()
    .typeError("Course work score must be a number")
    .required("Course work score is required"),
  summer_final_min_score: yup
    .number()
    .typeError("Summer final min score must be a number")
    .required("Summer final min score is required"),
  Summer_final_max_score: yup
    .number()
    .typeError("Summer final max score must be a number")
    .required("Summer final max score is required")
    .when("summer_final_min_score", (min, schema) =>
      min ? schema.min(min as any, "Summer max must be ≥ summer min") : schema
    ),
  summer_course_work_score: yup
    .number()
    .typeError("Summer course work score must be a number")
    .required("Summer course work score is required"),
  grade_type: yup
    .string()
    .required("Grade type is required")
    .oneOf(["normal", "pass_fail"], "Invalid grade type"),
  pass_percentage: yup
    .number()
    .typeError("Pass percentage must be a number")
    .required("Pass percentage is required")
    .min(0)
    .max(100),
  IsAddedToTotal: yup.boolean().optional(),
});
type Props = {
  open: boolean;
  onClose: () => void;
  editingSubject: SubjectDto | null;
};
function SubjectFormDialog({ open, onClose, editingSubject }: Props) {
  const [form, setForm] = useState<Partial<SubjectDto>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [createSubject] = useCreateSubjectMutation();
  const [updateSubject] = useUpdateSubjectMutation();

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  useEffect(() => {
    setForm(editingSubject || {});
  }, [editingSubject]);

  const getChangedFields = (original: any, updated: any) => {
    const changed: Record<string, any> = {};

    Object.keys(updated).forEach((key) => {
      // Only include keys that exist in updated AND have different value
      if (updated[key] !== original[key]) {
        changed[key] = updated[key];
      }
    });

    return changed;
  };
  const handleSubmit = async () => {
    try {
      await subjectSchema.validate(form, { abortEarly: false });

      setErrors({}); // clear errors
      //2️⃣ Check if we are editing or creating
      if (editingSubject) {
        // Update existing subject
        const changedData = getChangedFields(editingSubject, form);
        const { id, departmentId, ...data } = form;
        if (Object.keys(changedData).length > 0) {
          await updateSubject({ id: editingSubject.id, body: changedData }).unwrap();
        }
        onClose();
      } else {
        // Create new subject
        await createSubject(form as any).unwrap();
        onClose();
      }
    } catch (validationError: any) {
      const newErrors: Record<string, string> = {};
      validationError.inner.forEach((err: any) => {
        if (err.path) newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingSubject ? "Edit Subject" : "Create Subject"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography fontSize={"large"}>
              Basic Subject Information
            </Typography>
            <TextField
              label="Name"
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Subject Code"
              value={form.subject_code || ""}
              onChange={(e) => handleChange("subject_code", e.target.value)}
              fullWidth
              error={!!errors.subject_code}
              helperText={errors.subject_code}
            />
            {/* ✅ Dropdown for Level */}
            <TextField
              select
              label="Level"
              value={form.level || 1}
              onChange={(e) => handleChange("level", +e.target.value)}
              fullWidth
              error={!!errors.level}
              helperText={errors.level}
            >
              {[1, 2, 3, 4, 5].map((lvl) => (
                <MenuItem key={lvl} value={lvl}>
                  Level {lvl}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Credit Hours"
              type="number"
              value={form.creditHours || ""}
              onChange={(e) => handleChange("creditHours", +e.target.value)}
              fullWidth
              error={!!errors.creditHours}
              helperText={errors.creditHours}
            />
            <TextField
              label="Maximum Score"
              type="number"
              value={form.MaxScore || ""}
              onChange={(e) => handleChange("MaxScore", +e.target.value)}
              fullWidth
              error={!!errors.MaxScore}
              helperText={errors.MaxScore}
            />

            <TextField
              label="Minimum Score"
              type="number"
              value={form.MinScore || ""}
              onChange={(e) => handleChange("MinScore", +e.target.value)}
              fullWidth
              error={!!errors.MinScore}
              helperText={errors.MinScore}
            />
            <TextField
              label="Final Maximum Score"
              type="number"
              value={form.final_max_score || ""}
              onChange={(e) => handleChange("final_max_score", +e.target.value)}
              fullWidth
              error={!!errors.final_max_score}
              helperText={errors.final_max_score}
            />
            <TextField
              label="Final Minimum Score"
              type="number"
              value={form.final_min_score || ""}
              onChange={(e) => handleChange("final_min_score", +e.target.value)}
              fullWidth
              error={!!errors.final_min_score}
              helperText={errors.final_min_score}
            />
            <TextField
              label="Course Work Score"
              type="number"
              value={form.course_work_score || ""}
              onChange={(e) =>
                handleChange("course_work_score", +e.target.value)
              }
              fullWidth
              error={!!errors.course_work_score}
              helperText={errors.course_work_score}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.IsAddedToTotal || false}
                  onChange={(e) =>
                    handleChange("IsAddedToTotal", e.target.checked)
                  }
                  color="primary"
                />
              }
              label="Is Added To Total?"
            />
            <TextField
              select
              label="Grade Type"
              value={form.grade_type || ""}
              onChange={(e) => handleChange("grade_type", e.target.value)}
              fullWidth
              error={!!errors.grade_type}
              helperText={errors.grade_type}
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="pass_fail">Pass/Fail</MenuItem>
            </TextField>
            <TextField
              label="Pass Percentage ? "
              type="number"
              value={form.pass_percentage || ""}
              onChange={(e) => handleChange("pass_percentage", +e.target.value)}
              error={!!errors.pass_percentage}
              helperText={errors.pass_percentage}
              fullWidth
            />
            <hr></hr>
            <Typography fontSize={"large"}>
              Subject Information about Summer Semester
            </Typography>
            <TextField
              label="Summer Course Work Score"
              type="number"
              value={form.summer_course_work_score || ""}
              onChange={(e) =>
                handleChange("summer_course_work_score", +e.target.value)
              }
              error={!!errors.summer_course_work_score}
              helperText={errors.summer_course_work_score}
              fullWidth
            />
            <TextField
              label="Summer Final Minimum Score "
              type="number"
              value={form.summer_final_min_score || ""}
              onChange={(e) =>
                handleChange("summer_final_min_score", +e.target.value)
              }
              fullWidth
              error={!!errors.summer_final_min_score}
              helperText={errors.summer_final_min_score}
            />
            <TextField
              label="Summer Final Maximum Score"
              type="number"
              value={Number(form.Summer_final_max_score) || ""}
              onChange={(e) =>
                handleChange("Summer_final_max_score", +e.target.value)
              }
              error={!!errors.Summer_final_max_score}
              helperText={errors.Summer_final_max_score}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingSubject ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SubjectFormDialog;
