import { MenuItem } from "@mui/material";
import { HugeiconsIcon } from "@hugeicons/react";

interface ActionMenuItemProps {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
  label: string;
  onClick: () => void;
  danger?: boolean;
}

const ActionMenuItem = ({
  icon,
  label,
  onClick,
  danger = false,
}: ActionMenuItemProps) => {
  return (
    <MenuItem
      onClick={onClick}
      sx={{
        minHeight: 40,
        gap: 1.2,
        borderRadius: "9px",
        fontFamily: "Poppins, sans-serif",
        fontSize: 11.5,
        color: danger ? "#DC4C64" : "#424756",

        "&:hover": {
          backgroundColor: danger ? "#FFF1F2" : "#F5F5FF",
          color: danger ? "#DC2626" : "#5965E8",
        },
      }}
    >
      <HugeiconsIcon icon={icon} size={17} />
      {label}
    </MenuItem>
  );
};

export default ActionMenuItem;