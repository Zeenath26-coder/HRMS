import * as yup from "yup";

export const employeeSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),

  lastName: yup
    .string()
    .trim()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),

  dateofbirth: yup
    .string()
    .required("Date of birth is required")
    .test(
      "valid-date",
      "Enter a valid date of birth",
      (value) => !value || !isNaN(Date.parse(value)),
    )
    .test("not-future", "Date of birth cannot be in the future", (value) => {
      if (!value) return true;
      return new Date(value) <= new Date();
    }),

  joinDate: yup
    .string()
    .required("Join date is required")
    .test(
      "valid-date",
      "Enter a valid join date",
      (value) => !value || !isNaN(Date.parse(value)),
    ),

  exitDate: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test(
      "valid-date",
      "Enter a valid exit date",
      (value) => !value || !isNaN(Date.parse(value)),
    )
    .test(
      "after-join-date",
      "Exit date must be after join date",
      function (value) {
        if (!value || !this.parent.joinDate) return true;
        return new Date(value) >= new Date(this.parent.joinDate);
      },
    ),

  status: yup
    .mixed<"ACTIVE" | "RESIGNED" | "TERMINATED" | "RETIRED">()
    .oneOf(
      ["ACTIVE", "RESIGNED", "TERMINATED", "RETIRED"],
      "Enter a valid status",
    )
    .required("Status is required"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),

  phonenumber: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^[0-9+\s()]+$/, "Enter a valid phone number")
    .min(9, "Phone number is too short")
    .max(20, "Phone number is too long"),

  salary: yup
    .number()
    .typeError("Salary must be a valid number")
    .required("Salary is required")
    .positive("Salary must be greater than 0"),

  deptId: yup
    .number()
    .typeError("Department is required")
    .required("Department is required")
    .integer("Invalid department"),

  jobId: yup
    .number()
    .typeError("Job position is required")
    .required("Job position is required")
    .integer("Invalid job position"),
});

export type EmployeeFormData = yup.InferType<typeof employeeSchema>;
