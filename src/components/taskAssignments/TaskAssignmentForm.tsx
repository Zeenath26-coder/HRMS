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
  Task01Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { Task } from "../../types/task";
import type { Employee } from "../../types/employee";
import type { Project } from "../../types/project";
import type { TaskAssignment } from "../../types/taskAssignment";

import { assignTask, updateTaskAssignment } from "../../api/taskAssignmentApi";

import { getActiveEmployees } from "../../api/employeeApi";

import FormSelect from "../common/FormSelect";
import FormTextField from "../common/FormTextField";

import {
  taskAssignmentSchema,
  type TaskAssignmentFormData,
} from "../../validation/taskAssignmentValidation";

import { primaryButtonSx, secondaryButtonSx } from "../common/formStyles";

interface TaskAssignmentFormProps {
  task?: Task | null;
  assignment?: TaskAssignment | null;
  projects: Project[];
  onSuccess: () => void | Promise<void>;
  onCancel: () => void;
}

const TaskAssignmentForm = ({
  task,
  assignment,
  projects,
  onSuccess,
  onCancel,
}: TaskAssignmentFormProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const isEditing = Boolean(assignment);

  const selectedProject = projects.find(
    (project) =>
      project.projectId === (task?.projectId ?? assignment?.projectId),
  );

  const projectEmployees = employees.filter((employee) =>
    selectedProject?.employeeIds.includes(employee.employeeId),
  );

  const {
    control,
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<TaskAssignmentFormData>({
    resolver: yupResolver(taskAssignmentSchema),

    defaultValues: {
      taskId: task?.taskId ?? assignment?.taskId ?? 0,
      employeeId: assignment?.employeeId ?? 0,
      assignedDate: assignment?.assignedDate ?? "",
      dueDate: assignment?.dueDate ?? "",
    },
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true);
        setServerError("");

        const data = await getActiveEmployees();

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

  useEffect(() => {
    reset({
      taskId: task?.taskId ?? assignment?.taskId ?? 0,
      employeeId: assignment?.employeeId ?? 0,
      assignedDate: assignment?.assignedDate ?? "",
      dueDate: assignment?.dueDate ?? "",
    });

    setServerError("");
  }, [task, assignment, reset]);

  const handleClear = () => {
    reset({
      taskId: task?.taskId ?? assignment?.taskId ?? 0,
      employeeId: assignment?.employeeId ?? 0,
      assignedDate: assignment?.assignedDate ?? "",
      dueDate: assignment?.dueDate ?? "",
    });

    setServerError("");
  };

  const onSubmit = async (data: TaskAssignmentFormData) => {
    try {
      setSubmitting(true);
      setServerError("");

      const requestData = {
        taskId: Number(data.taskId),
        employeeId: Number(data.employeeId),
        assignedDate: data.assignedDate,
        dueDate: data.dueDate,
      };

      if (isEditing && assignment) {
        await updateTaskAssignment(assignment.assignmentId, requestData);
      } else {
        await assignTask(requestData);
      }

      await onSuccess();
    } catch (error: any) {
      console.error("Failed to save task assignment:", error);

      setServerError(
        error?.response?.data?.message ||
          `Unable to ${
            isEditing ? "update" : "assign"
          } task. Please try again.`,
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
            mb: 2.5,
            borderRadius: "10px",
            fontFamily: "Poppins, sans-serif",
            fontSize: 11,
          }}
        >
          {serverError}
        </Alert>
      )}

      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{
            mb: 0.8,
            fontFamily: "Poppins, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            color: "#3B3F4A",
          }}
        >
          Task
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            px: 1.5,
            py: 1.3,
            border: "1px solid #E7E8F0",
            borderRadius: "10px",
            backgroundColor: "#F8F9FF",
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "9px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#EEF0FF",
              color: "#5965E8",
              flexShrink: 0,
            }}
          >
            <HugeiconsIcon icon={Task01Icon} size={18} />
          </Box>

          <Box>
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#292D38",
              }}
            >
              {task?.taskTitle || `Task-${assignment?.taskId}`}
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                color: "#858A98",
              }}
            >
              TASK-{task?.taskId ?? assignment?.taskId}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <FormSelect<TaskAssignmentFormData>
          name="employeeId"
          control={control}
          label="Employee"
          required
          searchable
          options={projectEmployees.map((employee) => ({
            value: employee.employeeId,
            label: `${employee.firstName} ${employee.lastName}`,
          }))}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: 2,
          mb: 3,
        }}
      >
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.2,
          pt: 2,
          borderTop: "1px solid #ECEEF3",
        }}
      >
        <Button
          type="button"
          onClick={handleClear}
          disabled={submitting || loadingEmployees}
          startIcon={<HugeiconsIcon icon={Refresh01Icon} size={16} />}
          sx={secondaryButtonSx}
        >
          Clear
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={submitting || loadingEmployees || (!task && !assignment)}
          startIcon={
            submitting ? (
              <CircularProgress
                size={15}
                sx={{
                  color: "#FFFFFF",
                }}
              />
            ) : (
              <HugeiconsIcon
                icon={isEditing ? Edit02Icon : UserAdd01Icon}
                size={16}
              />
            )
          }
          sx={primaryButtonSx}
        >
          {submitting
            ? isEditing
              ? "Saving..."
              : "Assigning..."
            : isEditing
              ? "Save Changes"
              : "Assign Task"}
        </Button>
      </Box>
    </Box>
  );
};

export default TaskAssignmentForm;
