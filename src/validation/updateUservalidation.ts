import * as yup from "yup";
import type { UserRole } from "../types/user";

export const updateUserSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters"),

  role: yup
    .mixed<UserRole>()
    .oneOf(["ADMIN", "HR", "MANAGER", "EMPLOYEE"], "Please select a valid role")
    .required("Role is required"),
  active: yup.boolean().optional(),
});

export type UpdateUserFormData = yup.InferType<typeof updateUserSchema>;
