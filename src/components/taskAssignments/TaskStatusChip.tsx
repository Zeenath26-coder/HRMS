import { Box, Typography } from "@mui/material";

import type { TaskStatus } from "../../types/task";

interface TaskStatusChipProps {
  status: TaskStatus;
}

const statusConfig: Record<
  TaskStatus,
  {
    label: string;
    background: string;
    color: string;
  }
> = {
  ASSIGNED: {
    label: "Assigned",
    background: "#EEF2FF",
    color: "#4F46E5",
  },

  IN_PROGRESS: {
    label: "In Progress",
    background: "#FFF7ED",
    color: "#C2410C",
  },

  COMPLETED: {
    label: "Completed",
    background: "#ECFDF5",
    color: "#047857",
  },

  CANCELLED: {
    label: "Cancelled",
    background: "#FEF2F2",
    color: "#B91C1C",
  },
};

const TaskStatusChip = ({
  status,
}: TaskStatusChipProps) => {
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
        whiteSpace: "nowrap",
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: config.color,
          flexShrink: 0,
        }}
      />

      <Typography
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 10.5,
          fontWeight: 600,
          color: config.color,
          lineHeight: 1.2,
        }}
      >
        {config.label}
      </Typography>
    </Box>
  );
};

export default TaskStatusChip;