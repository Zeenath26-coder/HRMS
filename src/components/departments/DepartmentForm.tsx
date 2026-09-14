import { useEffect, useState } from "react";

import { Alert, Box, Button, CircularProgress } from "@mui/material";

import {
  Edit02Icon,
  Refresh01Icon,
  Building03Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  departmentSchema,
  type DepartmentFormData,
} from "../../validation/departmentValidation";

import type { Department } from "../../types/department";

import { createDepartment, updateDepartment } from "../../api/departmentApi";

import {
  formFieldSx,
  primaryButtonSx,
  secondaryButtonSx,
} from "../common/formStyles";
import FormSelect from "../common/FormSelect";
import FormTextField from "../common/FormTextField";

interface ManagerOption {
  employeeId: number;
  firstName: string;
  lastName: string;
  status: "ACTIVE" | "RESIGNED" | "TERMINATED" | "RETIRED";
}

interface DepartmentFormProps {
  department?: Department | null;
  managers: ManagerOption[];
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyValues: DepartmentFormData = {
  deptName: "",
  managerId: 0,
};

const DepartmentForm = ({
  department,
  managers,
  onSuccess,
  onCancel,
}: DepartmentFormProps) => {
  const isEditMode = !!department;

  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: yupResolver(departmentSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (department) {
      reset({
        deptName: department.deptName,
        managerId: department.managerId ?? 0,
      });
    } else {
      reset(emptyValues);
    }

    setServerError("");
  }, [department, reset]);

  const handleClear = () => {
    if (isEditMode && department) {
      reset({
        deptName: department.deptName,
        managerId: department.managerId ?? 0,
      });
    } else {
      reset(emptyValues);
    }

    setServerError("");
  };

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      setSubmitting(true);
      setServerError("");

      if (isEditMode && department) {
        await updateDepartment(department.deptId, {
          deptName: data.deptName,
          managerId: data.managerId,
        });
      } else {
        await createDepartment({
          deptName: data.deptName,
          managerId: data.managerId,
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Failed to save department:", error);

      setServerError(
        error?.response?.data?.message ||
          "Unable to save department. Please try again.",
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
          label="Department Name"
          required
          {...register("deptName")}
          error={!!errors.deptName}
          helperText={errors.deptName?.message}
        />

        <FormSelect<DepartmentFormData>
          name="managerId"
          control={control}
          label="Manager"
          searchable
          required
          options={managers
            .filter((manager) => manager.status === "ACTIVE")
            .map((manager) => ({
              value: manager.employeeId,
              label: `${manager.firstName} ${manager.lastName}`,
            }))}
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
          Clear
        </Button>

        <Button
          type="submit"
          disabled={submitting}
          startIcon={
            submitting ? (
              <CircularProgress
                size={15}
                thickness={3}
                sx={{ color: "#FFFFFF" }}
              />
            ) : (
              <HugeiconsIcon
                icon={isEditMode ? Edit02Icon : Building03Icon}
                size={16}
              />
            )
          }
          sx={primaryButtonSx}
        >
          {submitting
            ? "Saving..."
            : isEditMode
              ? "Save Changes"
              : "Add Department"}
        </Button>
      </Box>
    </Box>
  );
};

export default DepartmentForm;
