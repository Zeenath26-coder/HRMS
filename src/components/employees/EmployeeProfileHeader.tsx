import { Box, Typography } from "@mui/material";

import { Building03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Employee } from "../../types/employee";

import { UserAvatar } from "../common/UserAvatar";
import EmployeeStatusChip from "./EmployeeStatusChip";

interface EmployeeProfileHeaderProps {
  employee: Employee;
}

const EmployeeProfileHeader = ({ employee }: EmployeeProfileHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.8,
      }}
    >
      <UserAvatar
        firstName={employee.firstName}
        lastName={employee.lastName}
        size={58}
      />

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#292D38",
          }}
        >
          {employee.firstName} {employee.lastName}
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            fontFamily: "Poppins, sans-serif",
            fontSize: 10.5,
            color: "#969AA6",
          }}
        >
          EMP-{employee.employeeId}
        </Typography>

        <Box sx={{ mt: 0.8 }}>
          <EmployeeStatusChip status={employee.status} />
        </Box>
      </Box>

      <Box
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
          alignItems: "center",
          gap: 1,
          pr: 2,
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "9px",
            backgroundColor: "#F3F3FF",
            color: "#5965E8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HugeiconsIcon icon={Building03Icon} size={17} />
        </Box>

        <Box>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 9,
              color: "#999DA8",
            }}
          >
            Department
          </Typography>

          <Typography
            sx={{
              mt: 0.2,
              fontFamily: "Poppins, sans-serif",
              fontSize: 10.5,
              fontWeight: 600,
              color: "#454A57",
            }}
          >
            {employee.departmentName || "Not Assigned"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeProfileHeader;
