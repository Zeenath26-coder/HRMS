import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ArrowDataTransferHorizontalIcon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import type {
  TaskAssignment,
  
} from "../../types/taskAssignment";

import type { TaskStatus } from "../../types/task";

import { updateTaskStatus} from "../../api/taskAssignmentApi";

import {
  filterFieldSx,
  menuItemSx,
} from "../common/filterStyles";

interface MyTaskStatusDialogProps {
  open: boolean;
  assignment: TaskAssignment | null;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS: TaskStatus[] = [
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
];

const formatStatus = (status: TaskStatus) => {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
};

const MyTaskStatusDialog = ({
  open,
  assignment,
  onClose,
  onSuccess,
}: MyTaskStatusDialogProps) => {
  const [status, setStatus] =
    useState<TaskStatus>("ASSIGNED");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (assignment) {
      setStatus(assignment.taskStatus);
    }

    setError("");
  }, [assignment, open]);

  const handleClose = () => {
    if (saving) return;

    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!assignment) return;

    if (
      status === assignment.taskStatus
    ) {
      onClose();
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateTaskStatus(
        assignment.assignmentId,
        {
          taskStatus: status,
        },
      );

      toast.success(
        "Task status updated successfully",
      );

      onSuccess();
    } catch (error: any) {
      console.error(
        "Failed to update task status:",
        error,
      );

      setError(
        error?.response?.data?.message ||
          "Unable to update task status. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!assignment) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={
        saving ? undefined : handleClose
      }
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            boxShadow:
              "0 20px 60px rgba(30, 41, 59, 0.16)",
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
            justifyContent: "flex-end",
            mb: -1,
          }}
        >
          <IconButton
            onClick={handleClose}
            disabled={saving}
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
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={18}
            />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#EEF0FF",
            color: "#5B5CEB",
            mb: 2,
          }}
        >
          <HugeiconsIcon
            icon={ArrowDataTransferHorizontalIcon}
            size={23}
          />
        </Box>

       
        <Typography
          sx={{
            fontFamily:
              "Poppins, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#292D38",
            mb: 0.5,
          }}
        >
          Update Task Status
        </Typography>

        <Typography
          sx={{
            fontFamily:
              "Poppins, sans-serif",
            fontSize: 11.5,
            lineHeight: 1.7,
            color: "#7B8190",
            mb: 2.2,
          }}
        >
          Update the current status of
          your task.
        </Typography>

     
        <Box
          sx={{
            px: 1.5,
            py: 1.3,
            mb: 2.2,
            borderRadius: "11px",
            backgroundColor: "#F8F8FC",
            border:
              "1px solid #ECEEF3",
          }}
        >
          <Typography
            sx={{
              fontFamily:
                "Poppins, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#424756",
            }}
          >
            {assignment.taskTitle}
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontFamily:
                "Poppins, sans-serif",
              fontSize: 10.5,
              color: "#7B8190",
            }}
          >
            {assignment.projectName}
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: "11px",
              fontFamily:
                "Poppins, sans-serif",
              fontSize: 11,
            }}
          >
            {error}
          </Alert>
        )}

       
        <TextField
          select
          fullWidth
          label="Task Status"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as TaskStatus,
            )
          }
          disabled={saving}
          sx={{
            ...filterFieldSx,

            "& .MuiInputLabel-root": {
              fontFamily:
                "Poppins, sans-serif",
              fontSize: 12,
            },

            "& .MuiSelect-select": {
              fontFamily:
                "Poppins, sans-serif",
              fontSize: 12,
            },
          }}
        >
          {STATUS_OPTIONS.map(
            (option) => (
              <MenuItem
                key={option}
                value={option}
                sx={menuItemSx}
              >
                {formatStatus(option)}
              </MenuItem>
            ),
          )}
        </TextField>

     
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 3,
            pt: 2.5,
            borderTop:
              "1px solid #ECEEF3",
          }}
        >
          <Button
            type="button"
            onClick={handleClose}
            disabled={saving}
            sx={{
              height: 38,
              px: 1.8,
              borderRadius: "10px",
              textTransform: "none",
              fontFamily:
                "Poppins, sans-serif",
              fontSize: 11.5,
              fontWeight: 500,
              color: "#646978",
              border:
                "1px solid #E2E4EA",
              backgroundColor:
                "#FFFFFF",

              "&:hover": {
                backgroundColor:
                  "#F8F8FA",
                borderColor:
                  "#D6D8E0",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress
                  size={15}
                  thickness={3}
                  sx={{
                    color: "#FFFFFF",
                  }}
                />
              ) : (
                <HugeiconsIcon
                  icon={
                    CheckmarkCircle02Icon
                  }
                  size={16}
                />
              )
            }
            sx={{
              height: 38,
              px: 1.8,
              borderRadius: "10px",
              textTransform: "none",
              fontFamily:
                "Poppins, sans-serif",
              fontSize: 11.5,
              fontWeight: 600,
              color: "#FFFFFF",
              backgroundColor:
                "#5B5CEB",
              boxShadow:
                "0 6px 16px rgba(91, 92, 235, 0.18)",

              "&:hover": {
                backgroundColor:
                  "#4F46E5",
              },

              "&.Mui-disabled": {
                color: "#FFFFFF",
                backgroundColor:
                  "#A7A8EF",
              },
            }}
          >
            {saving
              ? "Updating..."
              : "Update Status"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MyTaskStatusDialog;