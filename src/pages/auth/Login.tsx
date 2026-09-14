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

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginSchema } from "../../validation/authValidation";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import AuthCard from "../../components/auth/AuthCard";
import {
  authTextFieldSx,
  authPrimaryButtonSx,
} from "../../components/auth/authFieldStyles";

type LoginFormData = yup.InferType<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");

    try {
      setLoading(true);
      await login(data.username.trim(), data.password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to your workspace."
      footer={
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.7,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22C55E",
            }}
          />
          <Typography sx={{ fontSize: "11px", color: "#94A3B8" }}>
            Secure access to your organization
          </Typography>
        </Box>
      }
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ mb: 2.2 }}>
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

        <Box sx={{ mb: 1.5 }}>
          <TextField
            fullWidth
            label="Password"
            required
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      sx={{
                        mr: 0.5,
                        color: "#94A3B8",
                        "&:hover": {
                          color: "#4F46E5",
                          background: "rgba(79,70,229,0.06)",
                        },
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
            sx={authTextFieldSx}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            type="button"
            onClick={() => navigate("/forgot-password")}
            sx={{
              minWidth: 0,
              p: 0,
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 650,
              color: "#4F46E5",
              "&:hover": { background: "transparent", color: "#3730A3" },
            }}
          >
            Forgot password?
          </Button>
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
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </Box>
    </AuthCard>
  );
};

export default Login;
