import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

import {
  
  Refresh01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import FormTextField from "../common/FormTextField";
import FormSelect from "../common/FormSelect";

import {
  createUserSchema,
  type CreateUserFormData,
} from "../../validation/userValidation";


import type { User, UserRole } from "../../types/user";

import type { Employee } from "../../types/employee";

import { createUser} from "../../api/userApi";

import { getEmployeesWithoutAccount } from "../../api/employeeApi";

import { primaryButtonSx, secondaryButtonSx } from "../common/formStyles";

interface UserFormProps {
  user?: User | null;
  onSuccess: () => void | Promise<void>;
  onCancel: () => void;
}

const ROLE_OPTIONS: {
  value: UserRole;
  label: string;
}[] = [
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "HR",
    label: "HR",
  },
  {
    value: "MANAGER",
    label: "Manager",
  },
  {
    value: "EMPLOYEE",
    label: "Employee",
  },
];

const UserForm = ({ onSuccess}: UserFormProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: yupResolver(createUserSchema),

    defaultValues: {
      username: "",
      password: "",
      role: "EMPLOYEE",
      employeeId: 0,
    },
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true);
        setServerError("");

        const data = await getEmployeesWithoutAccount();

        setEmployees(data);
      } catch (error) {
        console.error("Failed to load employees:", error);

        setServerError("Unable to load employees. Please try again.");
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, []);

  const handleClear = () => {
    reset({
      username: "",
      password: "",
      role: "EMPLOYEE",
      employeeId: 0,
    });

    setServerError("");
  };

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setSubmitting(true);
      setServerError("");

      await createUser({
        username: data.username,
        password: data.password,
        role: data.role,
        employeeId: data.employeeId,
      });

      await onSuccess();
    } catch (error: any) {
      console.error("Failed to create user:", error);

      setServerError(
        error?.response?.data?.message ||
          "Unable to save user. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        width: "100%",
        fontFamily: "Poppins, sans-serif",
      }}
    >
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

      <Box sx={{ mb: 3 }}>
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
              md: "repeat(2, 1fr)",
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

          <FormTextField
            label="Password"
            type="password"
            required
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <FormSelect<CreateUserFormData>
            name="role"
            control={control}
            label="Role"
            required
            options={ROLE_OPTIONS}
          />

          <FormSelect<CreateUserFormData>
            name="employeeId"
            control={control}
            label="Employee"
            required
            searchable
            options={employees.map((employee) => ({
              value: employee.employeeId,
              label: `${employee.firstName} ${employee.lastName}`,
            }))}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.2,
          pt: 2.5,
          borderTop: "1px solid #ECEEF3",
        }}
      >
        <Button
          type="button"
          disabled={submitting || loadingEmployees}
          onClick={handleClear}
          startIcon={<HugeiconsIcon icon={Refresh01Icon} size={16} />}
          sx={secondaryButtonSx}
        >
          Clear
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={submitting || loadingEmployees}
          startIcon={
            submitting ? (
              <CircularProgress
                size={15}
                thickness={3}
                sx={{
                  color: "#FFFFFF",
                }}
              />
            ) : (
              <HugeiconsIcon icon={UserAdd01Icon} size={16} />
            )
          }
          sx={primaryButtonSx}
        >
          {submitting ? "Creating..." : "Create User"}
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;
