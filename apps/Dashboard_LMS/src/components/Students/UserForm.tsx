"use client";

// validators/user.joi.ts
import * as Yup from "yup";
import SharedForm from "@/components/shared/SharedForm";
import { useCreateUserMutation } from "@/store/services/usersApi";
import { useState } from "react";
import { FieldType } from "@/components/shared/SharedForm";
export const userSchema = Yup.object().shape({
  name: Yup.string().min(3).required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  username: Yup.string().min(3).required("Username is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password required"),

  phone: Yup.string().nullable(),
  address: Yup.string().nullable(),
  national_id: Yup.string().nullable(),
  student_id: Yup.string().nullable(),
  class_code: Yup.string().nullable(),

  role: Yup.string().required("Select a role"),

  level_status: Yup.string().nullable(),
  level: Yup.number().nullable(),

  Graduated: Yup.boolean().nullable(),

  departmentId: Yup.string().nullable(),
});

export default function UserForm() {
  const [createUser] = useCreateUserMutation();
  const [success, setSuccess] = useState<string | null>(null);
  const fields :FieldType[]= [
    { name: "name", label: "Full Name", type: "text", required: true,row:1 },
    { name: "email", label: "Email", type: "email", required: true,row:1 },

    { name: "username", label: "Username", type: "text", required: true ,row:2 },
    { name: "phone", label: "Phone", type: "text" ,row:2 },
    {
      name: "national_id",
      label: "Nationa Id or Passport Number",
      type: "text",
      row:3 
    },
    { name: "password", label: "Password", type: "text" ,row:3 },

    { name: "student_id", label: "Student Id", type: "text",row:4 },
    { name: "class_code", label: "Class Id", type: "text",row:4 },
    {
      name: "level",
      label: "Level",
      type: "select",
      required: true,
      options: [
        { label: "Level One", value: 1 },
        { label: "Level Two", value: 2 },
        { label: "Level Three", value: 3},
        { label: "Level Four", value: 4},
      ],
      row:5,
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Manager", value: "manager" },
      ],
      row:5,
    },
  ];

  const handleSubmit = async (data: any) => {
    try {
      await createUser(data).unwrap();
      setSuccess("User created successfully!");
    } catch (err: any) {
      throw new Error(err?.data?.message || "Failed to create user.");
    }
  };
  return (
    <>
      <SharedForm fields={fields} onSubmit={handleSubmit} submitLabel="Create User"></SharedForm>
    </>
  );
}
