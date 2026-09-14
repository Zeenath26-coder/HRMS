import * as yup from "yup";

export const departmentSchema = yup.object({
  deptName: yup
    .string()
    .trim()
    .required("Department name is required")
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name must not exceed 100 characters"),

  managerId: yup
    .number()
    .typeError("Department manager is required")
    .required("Department manager is required")
    .moreThan(0, "Please select a manager")
    .integer("Invalid manager"),
});

export type DepartmentFormData = yup.InferType<typeof departmentSchema>;
