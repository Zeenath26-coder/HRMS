import * as yup from "yup";

export const taskAssignmentSchema = yup.object({
  taskId: yup
    .number()
    .typeError("Please select a task")
    .required("Task is required")
    .moreThan(0, "Please select a task"),

  employeeId: yup
    .number()
    .typeError("Please select an employee")
    .required("Employee is required")
    .moreThan(0, "Please select an employee"),

  assignedDate: yup
    .string()
    .required("Assigned date is required"),

  dueDate: yup
    .string()
    .required("Due date is required")
    .test(
      "due-date-after-assigned-date",
      "Due date cannot be before assigned date",
      function (value) {
        const { assignedDate } = this.parent;

        if (!value || !assignedDate) {
          return true;
        }

        return value >= assignedDate;
      },
    ),
});

export type TaskAssignmentFormData =
  yup.InferType<typeof taskAssignmentSchema>;