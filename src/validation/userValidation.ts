import * as yup from "yup";

import type { UserRole } from "../types/user";

export const createUserSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6  characters"),

  role: yup
    .mixed<UserRole>()
    .oneOf(["ADMIN", "HR", "MANAGER", "EMPLOYEE"], "Please select a valid role")
    .required("Role is required"),

  employeeId: yup
    .number()
    .typeError("Employee is required")
    .required("Employee is required")
    .moreThan(0, "Please select an employee"),
});

export type CreateUserFormData = yup.InferType<typeof createUserSchema>;
