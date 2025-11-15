"use client";

// validators/user.joi.ts
import * as Yup from "yup";

export const userSchema = Yup.object().shape({
    name: Yup.string().min(3).required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    username: Yup.string().min(3).required("Username is required"),
    password: Yup.string().min(6, "Min 6 characters").required("Password required"),
  
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
  

  return (
    <></>
  );
}
