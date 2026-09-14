import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

import { useNavigate, useSearchParams } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import AuthCard from "../../components/auth/AuthCard";

import {
  authTextFieldSx,
  authPrimaryButtonSx,
} from "../../components/auth/authFieldStyles";

import { resetPassword } from "../../api/authApi";


const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;



const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),

    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });


  const onSubmit = async (data: ResetPasswordFormData) => {
    setError("");

    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword({
        token,
        newPassword: data.newPassword,
      });

      setSuccess(true);
    } catch (err: any) {
      console.error("Failed to reset password:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to reset your password. This reset link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  

  if (success) {
    return (
      <AuthCard title="">
        <Box
          sx={{
            textAlign: "center",
            mt: 1,
          }}
        >
        

          <Box
            sx={{
              width: 68,
              height: 68,
              mx: "auto",
              mb: 2.5,
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
              border: "1px solid rgba(34,197,94,0.12)",
              boxShadow: "0 10px 25px rgba(34,197,94,0.10)",
            }}
          >
            <CheckCircleOutlineRoundedIcon
              sx={{
                fontSize: 36,
                color: "#16A34A",
              }}
            />
          </Box>


          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: {
                xs: "27px",
                sm: "30px",
              },
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-1px",
              color: "#1E1B4B",
            }}
          >
            Password reset successfully
          </Typography>

        

          <Typography
            sx={{
              mt: 1.4,
              mb: 3.5,
              px: {
                xs: 0,
                sm: 2,
              },
              fontFamily: "Poppins, sans-serif",
              fontSize: "13.5px",
              lineHeight: 1.65,
              color: "#64748B",
            }}
          >
            Your password has been updated successfully.
            <br />
            You can now sign in with your new password.
          </Typography>

         
          <Button
            fullWidth
            onClick={() => navigate("/login")}
            sx={{
              ...authPrimaryButtonSx,
              height: 54,
            }}
          >
            Back to Sign in
          </Button>
        </Box>
      </AuthCard>
    );
  }


  return (
    <AuthCard
      title="Reset password"
      subtitle="Create a new password for your account."
      onBack={() => navigate("/login")}
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
                      sx={{
                        mr: 0.5,
                        color: "#94A3B8",
                      }}
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
          <Box sx={{ mb: 2 }}>
            <Alert
              severity="error"
              sx={{
                borderRadius: "12px",

                fontFamily: "Poppins, sans-serif",

                fontSize: "12.5px",

                lineHeight: 1.5,
              }}
            >
              {error}
            </Alert>

            <Button
              type="button"
              onClick={() => navigate("/forgot-password")}
              sx={{
                mt: 1.2,
                p: 0,

                minWidth: 0,

                textTransform: "none",

                fontFamily: "Poppins, sans-serif",

                fontSize: "12px",

                fontWeight: 600,

                color: "#4F46E5",

                "&:hover": {
                  background: "transparent",
                  color: "#3730A3",
                },
              }}
            >
              Request a new reset link
            </Button>
          </Box>
        )}

      

        <Button
          type="submit"
          fullWidth
          disabled={loading}
          endIcon={
            !loading ? (
              <ArrowForwardRoundedIcon
                sx={{
                  fontSize: "19px !important",
                }}
              />
            ) : undefined
          }
          sx={{
            ...authPrimaryButtonSx,
            height: 54,
          }}
        >
          {loading ? "Resetting..." : "Reset password"}
        </Button>
      </Box>
    </AuthCard>
  );
};

export default ResetPassword;
