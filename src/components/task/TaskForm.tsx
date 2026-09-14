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
  Refresh01Icon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { taskSchema, type TaskFormData } from "../../validation/taskValidation";

import type { Task } from "../../types/task";
import type { Project } from "../../types/project";
import type { Employee } from "../../types/employee";

import { createTask, updateTask } from "../../api/taskApi";
import { primaryButtonSx, secondaryButtonSx } from "../common/formStyles";

import FormTextField from "../common/FormTextField";
import FormSelect from "../common/FormSelect";

interface TaskFormProps {
  task?: Task | null;
  projects: Project[];
  employees: Employee[];
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyValues: TaskFormData = {
  taskTitle: "",
  projectId: 0,
  employeeId: 0,
  assignedDate: "",
  dueDate: "",
};

const TaskForm = ({
  task,
  projects,
  employees,
  onSuccess,
  onCancel,
}: TaskFormProps) => {
  const isEditMode = Boolean(task);

  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: emptyValues,
  });

  const selectedProjectId = watch("projectId");
  const selectedProject = projects.find(
    (project) => project.projectId === Number(selectedProjectId),
  );

  const projectEmployees = employees.filter((employee) =>
    selectedProject?.employeeIds?.includes(employee.employeeId),
  );

  useEffect(() => {
    if (task) {
      reset({
        taskTitle: task.taskTitle,
        projectId: task.projectId,
        employeeId: 0,
        assignedDate: "",
        dueDate: "",
      });
    } else {
      reset(emptyValues);
    }
    setServerError("");
  }, [task, reset]);

  const handleClear = () => {
    if (isEditMode && task) {
      reset({
        taskTitle: task.taskTitle,
        projectId: task.projectId,
        employeeId: 0,
        assignedDate: "",
        dueDate: "",
      });
    } else {
      reset(emptyValues);
    }
    setServerError("");
  };

  const onSubmit = async (data: TaskFormData) => {
    if (!isEditMode) {
      if (!data.employeeId || data.employeeId <= 0) {
         setError("employeeId", {
        type: "manual",
        message: "Please select an employee.",
      });
        return;
      }

      if (!data.assignedDate) {
         setError("assignedDate", {
        type: "manual",
        message: "Assigned date is required.",
      });
        return;
      }

      if (!data.dueDate) {
         setError("dueDate", {
        type: "manual",
        message: "Due date is required.",
      });
        return;
      }

      if (data.dueDate < data.assignedDate) {
         setError("dueDate", {
        type: "manual",
        message: "Due date cannot be before assigned date.",
      });
        return;
      }
      if (!selectedProject?.employeeIds?.includes(Number(data.employeeId))) {
         setError("employeeId", {
        type: "manual",
        message: "Selected employee does not belong to this project.",
      });
        return;
      }
    }

    try {
      setSubmitting(true);
      setServerError("");
      if (isEditMode && task) {
        await updateTask(task.taskId, {
          taskTitle: data.taskTitle,
          projectId: data.projectId,
        });
      } else {
        await createTask({
          taskTitle: data.taskTitle,
          projectId: Number(data.projectId),
          employeeId: Number(data.employeeId),
          assignedDate: data.assignedDate!,
          dueDate: data.dueDate!,
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error("Failed to save task:", error);
      setServerError(
        error?.response?.data?.message ||
          "Unable to save task. Please try again.",
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
            sm: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        <FormTextField
          label="Task Title"
          required
          placeholder="Enter task title"
          {...register("taskTitle")}
          error={!!errors.taskTitle}
          helperText={errors.taskTitle?.message}
        />

        <FormSelect<TaskFormData>
          name="projectId"
          control={control}
          label="Project"
          required
          searchable
          options={projects.map((project) => ({
            value: project.projectId,
            label: project.projectName,
          }))}
        />
      </Box>
      {!isEditMode && (
        <>
          <Box
            sx={{
              mt: 3,
              mb: 2,
            }}
          >
            <Box
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#3B3F4A",
                mb: 1.5,
              }}
            >
              Task Assignment
            </Box>

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
              <FormSelect<TaskFormData>
                name="employeeId"
                control={control}
                label="Assign To"
                required
                searchable
                options={projectEmployees.map((employee) => ({
                  value: employee.employeeId,
                  label: `${employee.firstName} ${employee.lastName}`,
                }))}
              />
              <FormTextField
                label="Assigned Date"
                type="date"
                required
                {...register("assignedDate")}
                error={Boolean(errors.assignedDate)}
                helperText={errors.assignedDate?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <FormTextField
                label="Due Date"
                type="date"
                required
                {...register("dueDate")}
                error={Boolean(errors.dueDate)}
                helperText={errors.dueDate?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>
            {selectedProjectId > 0 && projectEmployees.length === 0 && (
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  borderRadius: "10px",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                }}
              >
                No employees are assigned to this project.
              </Alert>
            )}
          </Box>
        </>
      )}

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
          disabled={
            submitting ||
            (!isEditMode &&
              selectedProjectId > 0 &&
              projectEmployees.length === 0)
          }
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
              <HugeiconsIcon
                icon={isEditMode ? Edit02Icon : Task01Icon}
                size={16}
              />
            )
          }
          sx={primaryButtonSx}
        >
          {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Task"}
        </Button>
      </Box>
    </Box>
  );
};

export default TaskForm;
