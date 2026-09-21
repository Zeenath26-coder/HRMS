import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import AuthCard from "../../components/auth/AuthCard";
import {
  authTextFieldSx,
  authPrimaryButtonSx,
} from "../../components/auth/authFieldStyles";

import { changePassword } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const changePasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;

const ChangePassword = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setError("");

    try {
      setLoading(true);

      await changePassword({ newPassword: data.newPassword });

      await refreshUser();
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error("Failed to change password:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to change your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Set a new password"
      subtitle="For security, you need to set a new password before continuing."
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ mb: 2.2 }}>
          <TextField
            fullWidth
            label="New Password"
            required
            {...register("newPassword")}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            disabled={loading}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            autoComplete="new-password"
            sx={authTextFieldSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      type="button"
                      disabled={loading}
                      onClick={() => setShowPassword((previous) => !previous)}
                      sx={{ mr: 0.5, color: "#94A3B8" }}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Confirm Password"
            required
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            disabled={loading}
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            sx={authTextFieldSx}
          />
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2.5, borderRadius: "12px", fontSize: "13px" }}
          >
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={loading}
          endIcon={
            !loading ? (
              <ArrowForwardRoundedIcon sx={{ fontSize: "19px !important" }} />
            ) : undefined
          }
          sx={{ ...authPrimaryButtonSx, height: 54 }}
        >
          {loading ? "Updating..." : "Set new password"}
        </Button>
      </Box>
    </AuthCard>
  );
};

export default ChangePassword;
