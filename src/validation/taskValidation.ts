import * as yup from "yup";

export const taskSchema = yup.object({
  taskTitle: yup
    .string()
    .trim()
    .required("Task title is required")
    .max(100, "Task title cannot exceed 100 characters"),

  projectId: yup
    .number()
    .typeError("Please select a project")
    .required("Project is required")
    .moreThan(0, "Please select a project"),

  employeeId: yup.number().optional(),

  assignedDate: yup.string().optional(),

  dueDate: yup.string().optional(),
});

export type TaskFormData = yup.InferType<typeof taskSchema>;
