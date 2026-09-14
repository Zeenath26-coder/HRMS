import { Box, Button, Typography } from "@mui/material";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { COLORS } from "../../theme/designToken";

interface FilterBarProps {
  children: React.ReactNode;
  showClear?: boolean;
  onClear?: () => void;
}

const FilterBar = ({
  children,
  showClear = false,
  onClear,
}: FilterBarProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        mb: 2.5,
      }}
    >
      <Typography
        sx={{
          mr: 0.5,
          fontFamily: "Poppins, sans-serif",
          fontSize: 11.5,
          fontWeight: 500,
          color: COLORS.textSecondary,
        }}
      >
        Filter by
      </Typography>

      {children}

      {showClear && (
        <Button
          onClick={onClear}
          startIcon={
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={14}
            />
          }
          sx={{
            height: 42,
            px: 1.5,
            borderRadius: "12px",
            fontFamily: "Poppins, sans-serif",
            fontSize: 11.5,
            fontWeight: 500,
            textTransform: "none",
            color: COLORS.textSecondary,

            "&:hover": {
              backgroundColor: COLORS.primaryLight,
              color: COLORS.primary,
            },
          }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
};

export default FilterBar;