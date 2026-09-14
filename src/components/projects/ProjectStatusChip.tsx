import { Box, Typography } from "@mui/material";
import { type ProjectStatus } from "../../types/project";

interface ProjectStatusChipProps {
  status: ProjectStatus;
}

const statusConfig = {
  ACTIVE: {
    label: "Active",
    background: "#ECFDF5",
    color: "#047857",
  },
  COMPLETED: {
    label: "Completed",
    background: "#EEF0FF",
    color: "#4F46E5",
  },
  CANCELLED: {
    label: "Cancelled",
    background: "#FEF2F2",
    color: "#B91C1C",
  },
};

const ProjectStatusChip = ({ status }: ProjectStatusChipProps) => {
  const config = statusConfig[status];

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.7,
        px: 1.2,
        py: 0.55,
        borderRadius: "999px",
        backgroundColor: config.background,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: config.color,
        }}
      />

      <Typography
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 10.5,
          fontWeight: 600,
          color: config.color,
        }}
      >
        {config.label}
      </Typography>
    </Box>
  );
};

export default ProjectStatusChip;