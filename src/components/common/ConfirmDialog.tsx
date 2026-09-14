import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";

import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  message,
  itemName,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
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
      <DialogContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: -1,
          }}
        >
          <IconButton
            onClick={onCancel}
            disabled={loading}
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

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFF1F2",
            color: "#DC4C64",
            mb: 2,
          }}
        >
          <HugeiconsIcon icon={Delete02Icon} size={23} />
        </Box>

        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#292D38",
            mb: 0.8,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 11.5,
            lineHeight: 1.7,
            color: "#7B8190",
          }}
        >
          {message}
        </Typography>

        {itemName && (
          <Box
            sx={{
              mt: 1.8,
              px: 1.5,
              py: 1.2,
              borderRadius: "11px",
              backgroundColor: "#F8F8FC",
              border: "1px solid #ECEEF3",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 11.5,
                fontWeight: 600,
                color: "#424756",
              }}
            >
              {itemName}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 3,
          }}
        >
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
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
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            startIcon={<HugeiconsIcon icon={Delete02Icon} size={16} />}
            sx={{
              height: 38,
              px: 1.8,
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontSize: 11.5,
              fontWeight: 600,
              color: "#FFFFFF",
              backgroundColor: "#DC4C64",
              boxShadow: "0 6px 16px rgba(220, 76, 100, 0.18)",

              "&:hover": {
                backgroundColor: "#C93D55",
              },

              "&.Mui-disabled": {
                color: "#FFFFFF",
                backgroundColor: "#E99AA8",
              },
            }}
          >
            {loading ? "Deleting..." : confirmText}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
