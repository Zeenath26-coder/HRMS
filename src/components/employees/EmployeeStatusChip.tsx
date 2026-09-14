import { Box, Typography } from "@mui/material";
import { type EmployeeStatus } from "../../types/employee";


interface EmployeeStatusChipProps {
  status: EmployeeStatus;
}

const statusConfig = {
  ACTIVE: {
    label: "Active",
    background: "#ECFDF5",
    color: "#047857",
  },
  RESIGNED: {
    label: "Resigned",
    background: "#FFF7ED",
    color: "#C2410C",
  },
  TERMINATED: {
    label: "Terminated",
    background: "#FEF2F2",
    color: "#B91C1C",
  },
  RETIRED: {
    label: "Retired",
    background: "#F1F5F9",
    color: "#475569",
  },
};

const EmployeestatusChip = ({ status }: EmployeeStatusChipProps) => {
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

export default EmployeestatusChip;
