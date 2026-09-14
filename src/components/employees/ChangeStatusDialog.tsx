import { useState, useEffect } from "react";
import {
  Alert,
  Avatar,
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
import type { Employee } from "../../types/employee";
import { patchEmployee } from "../../api/employeeApi";
import FormDialogHeader from "../common/FormDialogHeader";
import {
  formFieldSx,
  primaryButtonSx,
  secondaryButtonSx,
} from "../common/formStyles";

interface ChangeStatusDialogProps {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS = ["ACTIVE", "RESIGNED", "TERMINATED", "RETIRED"] as const;
type StatusValue = (typeof STATUS_OPTIONS)[number];

const requiresExitDate = (status: StatusValue) =>
  status === "RESIGNED" || status === "TERMINATED" || status === "RETIRED";

const ChangeStatusDialog = ({
  open,
  employee,
  onClose,
  onSuccess,
}: ChangeStatusDialogProps) => {
  const [status, setStatus] = useState<StatusValue>("ACTIVE");
  const [exitDate, setExitDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (employee) {
      setStatus(employee.status as StatusValue);
      setExitDate(employee.exitDate ?? "");
      setError("");
    }
  }, [employee]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!employee) return;

    if (requiresExitDate(status) && !exitDate) {
      setError("Exit date is required for this status.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await patchEmployee(employee.employeeId, {
        status,
        exitDate: requiresExitDate(status) ? exitDate : undefined,
      });

      toast.success("Employee status updated successfully");
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
        title="Change Status"
        onClose={handleClose}
        disabled={submitting}
      />

      <DialogContent sx={{ p: 3 }}>
        {employee && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.3, mb: 2.5 }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                fontFamily: "Poppins, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: "#E9E7FF",
                color: "#5965E8",
              }}
            >
              {employee.firstName.charAt(0).toUpperCase()}
              {employee.lastName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#292D38",
                }}
              >
                {employee.firstName} {employee.lastName}
              </Typography>
              <Typography
                sx={{
                  mt: 0.2,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10,
                  color: "#969AA6",
                }}
              >
                {employee.email}
              </Typography>
            </Box>
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusValue)}
            sx={formFieldSx}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{ fontFamily: "Poppins, sans-serif", fontSize: 12 }}
              >
                {option.charAt(0) + option.slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </TextField>

          {requiresExitDate(status) && (
            <TextField
              fullWidth
              label="Exit Date"
              type="date"
              value={exitDate}
              onChange={(e) => setExitDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={formFieldSx}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: "1px solid #ECEEF3",
          gap: 1.2,
        }}
      >
        <Button sx={secondaryButtonSx}>Cancel</Button>
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

export default ChangeStatusDialog;
