import { Button } from "@mui/material";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  COLORS,
  RADIUS,
  SHADOWS,
  TYPOGRAPHY,
} from "../../theme/designToken";

interface PageActionButtonProps {
  label: string;
  icon: any;
  onClick: () => void;
}

const PageActionButton = ({
  label,
  icon,
  onClick,
}: PageActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      startIcon={<HugeiconsIcon icon={icon} size={17} />}
      sx={{
        flexShrink: 0,
        height: 44,
        px: 2,
        borderRadius: RADIUS.button,
        background:
          "linear-gradient(135deg, #6366F1 0%, #5146E5 100%)",
        color: COLORS.white,
        fontFamily: TYPOGRAPHY.fontFamily,
        fontSize: 12.5,
        fontWeight: 600,
        textTransform: "none",
        boxShadow: SHADOWS.button,
        transition: "all 0.2s ease",
        "&:hover": {
          background:
            "linear-gradient(135deg, #5B5CEB 0%, #4338CA 100%)",
          transform: "translateY(-1px)",
          boxShadow: SHADOWS.buttonHover,
        },
      }}
    >
      {label}
    </Button>
  );
};

export default PageActionButton;