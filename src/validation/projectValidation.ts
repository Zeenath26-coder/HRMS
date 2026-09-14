import * as yup from "yup";

export const projectSchema = yup.object({
  projectName: yup
    .string()
    .trim()
    .required("Project name is required")
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must not exceed 100 characters"),

  employeeIds: yup.array().of(yup.number().required()).default([]),
});

export type ProjectFormData = yup.InferType<typeof projectSchema>;
