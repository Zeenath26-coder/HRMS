import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";

import {
  ArrowDataTransferHorizontalIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { toast } from "sonner";

import type { TaskStatus } from "../../types/task";
import type { TaskAssignment } from "../../types/taskAssignment";

import { updateTaskStatus } from "../../api/taskAssignmentApi";

import FormSelect from "../common/FormSelect";

import { useForm } from "react-hook-form";

interface UpdateTaskStatusDialogProps {
  open: boolean;
  assignment: TaskAssignment | null;
  loading: boolean;
  onClose: () => void;
  onSuccess: (status: TaskStatus) => void | Promise<void>;
}

interface StatusFormData {
  taskStatus: TaskStatus;
}

const STATUS_OPTIONS: {
  value: TaskStatus;
  label: string;
}[] = [
  {
    value: "ASSIGNED",
    label: "Assigned",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
];

const UpdateTaskStatusDialog = ({
  open,
  assignment,
  onClose,
  onSuccess,
}: UpdateTaskStatusDialogProps) => {
  const [submitting, setSubmitting] = useState(false);

  const [serverError, setServerError] = useState("");

  const { control, handleSubmit, reset } = useForm<StatusFormData>({
    defaultValues: {
      taskStatus: "ASSIGNED",
    },
  });

  useEffect(() => {
    if (assignment) {
      reset({
        taskStatus: assignment.taskStatus,
      });
    }
  }, [assignment, reset]);

  const onSubmit = async (data: StatusFormData) => {
    if (!assignment) {
      return;
    }

    try {
      setSubmitting(true);
      setServerError("");

      await updateTaskStatus(assignment.assignmentId, {
        taskStatus: data.taskStatus,
      });

      onSuccess(data.taskStatus);
    } catch (error: any) {
      console.error("Failed to update task status:", error);

      const message =
        error?.response?.data?.message ||
        "Unable to update task status. Please try again.";

      setServerError(message);

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }

    setServerError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 20px 60px rgba(30, 41, 59, 0.16)",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          p: 3,
        }}
      >
        

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EEF0FF",
                color: "#5B5CEB",
              }}
            >
              <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={21} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#292D38",
                }}
              >
                Update Task Status
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10.5,
                  color: "#7B8190",
                }}
              >
                Change the current task status
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={handleClose}
            disabled={submitting}
            size="small"
            sx={{
              color: "#9297A5",
              borderRadius: "9px",

              "&:hover": {
                backgroundColor: "#F5F6FA",
                color: "#292D38",
              },
            }}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </IconButton>
        </Box>

       

        {assignment && (
          <Box
            sx={{
              mb: 2.5,
              p: 1.5,
              borderRadius: "12px",
              backgroundColor: "#F8F9FF",
              border: "1px solid #E8E9F4",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#292D38",
              }}
            >
              {assignment.taskTitle}
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontFamily: "Poppins, sans-serif",
                fontSize: 10.5,
                color: "#7B8190",
              }}
            >
              {assignment.employeeName}
              {" • "}
              {assignment.projectName}
            </Typography>
          </Box>
        )}

       

        {serverError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: "11px",
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
            }}
          >
            {serverError}
          </Alert>
        )}

       

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormSelect<StatusFormData>
            name="taskStatus"
            control={control}
            label="Task Status"
            required
            options={STATUS_OPTIONS}
          />

       

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
              onClick={handleClose}
              disabled={submitting}
              sx={{
                height: 38,
                px: 1.8,
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                fontSize: 11.5,
                fontWeight: 500,
                color: "#646978",
                border: "1px solid #E2E4EA",
                backgroundColor: "#FFFFFF",

                "&:hover": {
                  backgroundColor: "#F8F8FA",
                  borderColor: "#D6D8E0",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting || !assignment}
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
                    icon={ArrowDataTransferHorizontalIcon}
                    size={16}
                  />
                )
              }
              sx={{
                height: 38,
                px: 1.8,
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                fontSize: 11.5,
                fontWeight: 600,
                color: "#FFFFFF",
                backgroundColor: "#5B5CEB",
                boxShadow: "0 6px 16px rgba(91, 92, 235, 0.18)",

                "&:hover": {
                  backgroundColor: "#4F46E5",
                },

                "&.Mui-disabled": {
                  color: "#FFFFFF",
                  backgroundColor: "#A5A6EF",
                },
              }}
            >
              {submitting ? "Updating..." : "Update Status"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTaskStatusDialog;
