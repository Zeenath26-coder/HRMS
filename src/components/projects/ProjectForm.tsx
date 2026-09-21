import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,

  Typography,
} from "@mui/material";

import {
  Edit02Icon,
  FolderAddIcon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  projectSchema,
  type ProjectFormData,
} from "../../validation/projectValidation";

import type { Project } from "../../types/project";
import type { Employee } from "../../types/employee";

import { createProject, updateProject } from "../../api/projectApi";

import { primaryButtonSx, secondaryButtonSx } from "../common/formStyles";

import FormTextField from "../common/FormTextField";
import FormSelect from "../common/FormSelect";

interface ProjectFormProps {
  project?: Project | null;
  employees: Employee[];
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyValues: ProjectFormData = {
  projectName: "",
  employeeIds: [],
};

const ProjectForm = ({
  project,
  employees,
  onSuccess,

}: ProjectFormProps) => {
  const isEditMode = !!project;

  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (project) {
      reset({
        projectName: project.projectName,
        employeeIds: project.employeeIds,
      });
    } else {
      reset(emptyValues);
    }

    setServerError("");
  }, [project, reset]);

  const handleClear = () => {
    if (isEditMode && project) {
      reset({
        projectName: project.projectName,
        employeeIds: [],
      });
    } else {
      reset(emptyValues);
    }

    setServerError("");
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setSubmitting(true);
      setServerError("");

      if (isEditMode && project) {
        await updateProject(project.projectId, {
          projectName: data.projectName,
          employeeIds: data.employeeIds?.length ? data.employeeIds : undefined,
        });
      } else {
        await createProject({
          projectName: data.projectName,
          employeeIds: data.employeeIds,
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Failed to save project:", error);

      setServerError(
        error?.response?.data?.message ||
          "Unable to save project. Please try again.",
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
          Project Information
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
            label="Project Name"
            required
            {...register("projectName")}
            error={!!errors.projectName}
            helperText={errors.projectName?.message}
          />

          <FormSelect
            name="employeeIds"
            control={control}
            label="Project Members"
            multiple
            searchable
            options={employees.map((employee) => ({
              value: employee.employeeId,
              label: `${employee.firstName} ${employee.lastName}`,
            }))}
          />
        </Box>
      </Box>

      {isEditMode && <Box sx={{ mb: 3 }}></Box>}
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
                icon={isEditMode ? Edit02Icon : FolderAddIcon}
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
              : "Add Project"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectForm;
