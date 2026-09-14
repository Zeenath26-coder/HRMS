import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DialogTitle, IconButton } from "@mui/material";

interface FormDialogHeaderProps {
  title: string;
  onClose: () => void;
  disabled?: boolean;
}

const FormDialogHeader = ({
  title,
  onClose,
  disabled = false,
}: FormDialogHeaderProps) => {
  return (
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
        borderBottom: "1px solid #ECEEF3",
        fontFamily: "Poppins, sans-serif",
        fontSize: 16,
        color: "#292D38",
        fontWeight: 600,
      }}
    >
      {title}
      <IconButton
        onClick={onClose}
        disabled={disabled}
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
        <HugeiconsIcon icon={Cancel01Icon} size={19} />
      </IconButton>
    </DialogTitle>
  );
};

export default FormDialogHeader;
