import * as yup from "yup";

export const jobdescSchema = yup
  .object({
    jobTitle: yup.string().trim().required(),
    jobCode: yup.string().trim().optional(),

    minSalary: yup
      .number()
      .typeError("Minimum salary must be a number")
      .required("Mininmum salary is required")
      .min(0, "Minimum salary cannot be negative"),

    maxSalary: yup
      .number()
      .typeError("Maximum salary must be a number")
      .required("Maximun salary is required")
      .min(0, "Maximum salary cannot be negative")
      .test(
        "max-greater-than-min",
        "Maximum salary must be greater than or equal to minimum salary",
        function (value) {
          const { minSalary } = this.parent;
          if (value === undefined || minSalary === undefined) {
            return true;
          }
          return value >= minSalary;
        },
      ),
  })
  .required();

export type JobFormData = yup.InferType<typeof jobdescSchema>;
