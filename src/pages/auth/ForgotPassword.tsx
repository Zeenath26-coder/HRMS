import { useState } from "react";

import { Alert, Box, Button, TextField } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import AuthCard from "../../components/auth/AuthCard";
import {
  authTextFieldSx,
  authPrimaryButtonSx,
} from "../../components/auth/authFieldStyles";
import { forgotPassword } from "../../api/authApi";

const forgotPasswordSchema = yup.object({
  username: yup.string().required("Username is required"),
});

type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { username: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError("");

    try {
      setLoading(true);
      await forgotPassword({ username: data.username.trim() });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to request password reset:", err);
      setError("Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Forgot password?"
      subtitle="Enter your username and we'll send you a link to reset your password."
    >
      {submitted ? (
        <Alert
          severity="success"
          sx={{ borderRadius: "12px", fontSize: "13px" }}
        >
          If an account exists for that username, a reset link has been sent.
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Username"
              required
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={loading}
              autoComplete="username"
              placeholder="Enter your username"
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
            sx={authPrimaryButtonSx}
          >
            {loading ? "Sending..." : "Send reset link"}
          </Button>

          <Button
            type="button"
            fullWidth
            onClick={() => navigate("/login")}
            sx={{
              mt: 1.5,
              textTransform: "none",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#64748B",
              "&:hover": { background: "transparent", color: "#4F46E5" },
            }}
          >
            Back to sign in
          </Button>
        </Box>
      )}
    </AuthCard>
  );
};

export default ForgotPassword;
