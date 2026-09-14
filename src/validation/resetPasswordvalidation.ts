import * as yup from "yup";
export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
