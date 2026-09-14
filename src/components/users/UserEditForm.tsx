import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

import { Edit02Icon, Refresh01Icon } from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import FormTextField from "../common/FormTextField";
import FormSelect from "../common/FormSelect";

import { type UpdateUserFormData } from "../../validation/updateUservalidation";

import { updateUserSchema } from "../../validation/updateUservalidation";

import type { User, UserRole } from "../../types/user";

import { updateUser } from "../../api/userApi";

import { primaryButtonSx, secondaryButtonSx } from "../common/formStyles";

interface UserEditFormProps {
  user: User;
  onSuccess: () => void | Promise<void>;
  onCancel: () => void;
}

const ROLE_OPTIONS: {
  value: UserRole;
  label: string;
}[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "HR", label: "HR" },
  { value: "MANAGER", label: "Manager" },
  { value: "EMPLOYEE", label: "Employee" },
];

const UserEditForm = ({ user, onSuccess }: UserEditFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    resolver: yupResolver(updateUserSchema),

    defaultValues: {
      username: user.username,
      role: user.role,
    },
  });

  useEffect(() => {
    reset({
      username: user.username,
      role: user.role,
    });
  }, [user, reset]);

  const handleClear = () => {
    reset({
      username: user.username,
      role: user.role,
    });

    setServerError("");
  };

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      setSubmitting(true);
      setServerError("");

      await updateUser(user.userId, {
        username: data.username,
        role: data.role,
        active: user.active,
      });

      await onSuccess();
    } catch (error: any) {
      console.error("Failed to update user:", error);

      setServerError(
        error?.response?.data?.message ||
          "Unable to update user. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: "12px",
            fontFamily: "Poppins, sans-serif",
            fontSize: 11,
          }}
        >
          {serverError}
        </Alert>
      )}

      <Typography
        sx={{
          mb: 1.8,
          fontFamily: "Poppins, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: "#3B3F4A",
        }}
      >
        Account Information
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        <FormTextField
          label="Username"
          required
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <FormSelect<UpdateUserFormData>
          name="role"
          control={control}
          label="Role"
          required
          options={ROLE_OPTIONS}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.2,
          mt: 3,
          pt: 2.5,
          borderTop: "1px solid #ECEEF3",
        }}
      >
        <Button
          type="button"
          disabled={submitting}
          onClick={handleClear}
          startIcon={<HugeiconsIcon icon={Refresh01Icon} size={16} />}
          sx={secondaryButtonSx}
        >
          Reset
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          startIcon={
            submitting ? (
              <CircularProgress size={15} sx={{ color: "#FFFFFF" }} />
            ) : (
              <HugeiconsIcon icon={Edit02Icon} size={16} />
            )
          }
          sx={primaryButtonSx}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default UserEditForm;
