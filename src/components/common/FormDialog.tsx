import {
  Dialog,
  DialogContent,
} from "@mui/material";

import FormDialogHeader from "./FormDialogHeader";
import { COLORS } from "../../theme/designToken";

interface FormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const FormDialog = ({
  open,
  title,
  onClose,
  children,
  disabled = false,
  maxWidth = "md",
}: FormDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={disabled ? undefined : onClose}
      fullWidth
      maxWidth={maxWidth}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            backgroundColor: COLORS.white,
            boxShadow: "0 24px 70px rgba(42, 45, 100, 0.18)",
          },
        },
      }}
    >
      <FormDialogHeader
        title={title}
        onClose={onClose}
        disabled={disabled}
      />

      <DialogContent
        dividers
        sx={{
          p: 3,
          borderColor: "#ECEEF4",
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;