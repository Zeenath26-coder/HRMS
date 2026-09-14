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
  Cancel01Icon,
  LockPasswordIcon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import type { User } from "../../types/user";
import { resetUserPassword } from "../../api/userApi";
import { primaryButtonSx, secondaryButtonSx } from "../common/formStyles";

interface ResetPasswordDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

const ResetPasswordDialog = ({
  open,
  user,
  onClose,
  onSuccess,
}: ResetPasswordDialogProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setServerError("");
      setResetLink("");
      setCopied(false);
    }
  }, [open, user]);

  const handleClose = () => {
    if (submitting) return;
    setServerError("");
    setResetLink("");
    setCopied(false);
    onClose();
  };

  const handleGenerateLink = async () => {
    if (!user) return;

    try {
      setSubmitting(true);
      setServerError("");

      const link = await resetUserPassword(user.userId);
      setResetLink(link);

      await onSuccess();
    } catch (error: any) {
      console.error("Failed to generate reset link:", error);
      setServerError(
        error?.response?.data?.message ||
          "Unable to generate reset link. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!resetLink) return;
    await navigator.clipboard.writeText(resetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            borderRadius: "18px",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 20px 60px rgba(30, 41, 59, 0.16)",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
              <HugeiconsIcon icon={LockPasswordIcon} size={21} />
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
                Reset Password
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10.5,
                  color: "#7B8190",
                }}
              >
                Send a password reset link to this user
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
              "&:hover": { backgroundColor: "#F5F6FA", color: "#292D38" },
            }}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </IconButton>
        </Box>

        {user && (
          <Box
            sx={{
              mb: 2.5,
              px: 1.5,
              py: 1.3,
              borderRadius: "11px",
              backgroundColor: "#F8F9FF",
              border: "1px solid #E8E9F4",
            }}
          >
            <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: "#7B8190" }}>
              Resetting password for
            </Typography>
            <Typography sx={{ mt: 0.25, fontFamily: "Poppins, sans-serif", fontSize: 12.5, fontWeight: 600, color: "#292D38" }}>
              {user.username}
            </Typography>
            {user.employeeName && (
              <Typography sx={{ mt: 0.15, fontFamily: "Poppins, sans-serif", fontSize: 10.5, color: "#7B8190" }}>
                {user.employeeName}
              </Typography>
            )}
          </Box>
        )}

        {serverError && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: "11px", fontFamily: "Poppins, sans-serif", fontSize: 11 }}
          >
            {serverError}
          </Alert>
        )}

        {resetLink ? (
          <>
            <Alert
              severity="success"
              sx={{ mb: 2, borderRadius: "11px", fontFamily: "Poppins, sans-serif", fontSize: 11 }}
            >
              Reset link generated and emailed to the user (if an email is on file).
            </Alert>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 1.2,
                borderRadius: "10px",
                border: "1px solid #E1E4EC",
                backgroundColor: "#FAFAFC",
              }}
            >
              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                  color: "#3B3F4A",
                }}
              >
                {resetLink}
              </Typography>

              <IconButton size="small" onClick={handleCopy}>
                <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={16} />
              </IconButton>
            </Box>
          </>
        ) : null}

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
          <Button type="button" onClick={handleClose} disabled={submitting} sx={secondaryButtonSx}>
            {resetLink ? "Close" : "Cancel"}
          </Button>

          {!resetLink && (
            <Button
              type="button"
              variant="contained"
              onClick={handleGenerateLink}
              disabled={submitting || !user}
              startIcon={
                submitting ? (
                  <CircularProgress size={15} thickness={3} sx={{ color: "#FFFFFF" }} />
                ) : (
                  <HugeiconsIcon icon={LockPasswordIcon} size={16} />
                )
              }
              sx={primaryButtonSx}
            >
              {submitting ? "Generating..." : "Generate Reset Link"}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;