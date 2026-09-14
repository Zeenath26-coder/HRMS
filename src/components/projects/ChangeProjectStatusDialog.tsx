import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import type { Project, ProjectStatus } from "../../types/project";
import { updateProjectStatus } from "../../api/projectApi";
import FormDialogHeader from "../common/FormDialogHeader";
import {
  formFieldSx,
  primaryButtonSx,
  secondaryButtonSx,
} from "../common/formStyles";

interface ChangeProjectStatusDialogProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS: ProjectStatus[] = ["ACTIVE", "COMPLETED", "CANCELLED"];

const ChangeProjectStatusDialog = ({
  open,
  project,
  onClose,
  onSuccess,
}: ChangeProjectStatusDialogProps) => {
  const [status, setStatus] = useState<ProjectStatus>("ACTIVE");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setStatus(project.status);
      setError("");
    }
  }, [project]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!project) return;

    try {
      setSubmitting(true);
      setError("");

      await updateProjectStatus(project.projectId, status);

      toast.success("Project status updated successfully");
      onSuccess();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to update status. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isCurrentStatus = (option: ProjectStatus) =>
    project ? option === project.status : false;

  const isDisabledOption = (option: ProjectStatus) => {
    if (!project) return false;
    if (isCurrentStatus(option)) return false;
    if (option === "ACTIVE") return false;
    return project.status !== "ACTIVE";
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
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          },
        },
      }}
    >
      <FormDialogHeader
        title="Change Project Status"
        onClose={handleClose}
        disabled={submitting}
      />

      <DialogContent sx={{ p: 3 }}>
        {project && (
          <Box sx={{ mb: 2.5 }}>
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#292D38",
                pt: 1.5,
              }}
            >
              {project.projectName}
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                color: "#969AA6",
              }}
            >
              PROJ-{project.projectId}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: "12px",
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
            }}
          >
            {error}
          </Alert>
        )}

        <TextField
          select
          fullWidth
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          sx={formFieldSx}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem
              key={option}
              value={option}
              disabled={isDisabledOption(option)}
              sx={{ fontFamily: "Poppins, sans-serif", fontSize: 12 }}
            >
              {option.charAt(0) + option.slice(1).toLowerCase()}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: "1px solid #ECEEF3",
          gap: 1.2,
        }}
      >
        <Button
          sx={secondaryButtonSx}
          onClick={handleClose}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          startIcon={
            submitting ? (
              <CircularProgress
                size={15}
                thickness={3}
                sx={{ color: "#FFFFFF" }}
              />
            ) : (
              <HugeiconsIcon icon={Edit02Icon} size={16} />
            )
          }
          sx={primaryButtonSx}
        >
          {submitting ? "Saving..." : "Update Status"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeProjectStatusDialog;
