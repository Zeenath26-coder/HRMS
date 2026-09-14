import * as yup from "yup";

export const taskStatusSchema = yup.object({
  taskStatus: yup.string().required("Task status is required"),
});

export type TaskStatusFormData = yup.InferType<typeof taskStatusSchema>;
