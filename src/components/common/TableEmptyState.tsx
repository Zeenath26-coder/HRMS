import { Box, Typography } from "@mui/material";

import {
  Search01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

interface TableEmptyStateProps {
  title?: string;
  description?: string;
}

const TableEmptyState = ({
  title = "No records found",
  description = "Try adjusting your search or filters.",
}: TableEmptyStateProps) => {
  return (
    <Box
      sx={{
        py: 7,
        px: 2,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: "14px",
          backgroundColor: "#F4F5FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1.5,
        }}
      >
        <HugeiconsIcon
          icon={Search01Icon}
          size={23}
          color="#6873E8"
        />
      </Box>

      <Typography
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: "#292D38",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontFamily: "Poppins, sans-serif",
          fontSize: 11,
          color: "#969AA6",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default TableEmptyState;