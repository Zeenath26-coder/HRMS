import { Box, Typography } from "@mui/material";

import { Building03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Department } from "../../types/department";

interface DepartmentProfileHeaderProps {
  department: Department;
}

const DepartmentProfileHeader = ({
  department,
}: DepartmentProfileHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.8,
      }}
    >
      <Box
        sx={{
          width: 58,
          height: 58,
          borderRadius: "14px",
          backgroundColor: "#E9E7FF",
          color: "#5965E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <HugeiconsIcon
          icon={Building03Icon}
          size={27}
        />
      </Box>

      <Box>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#292D38",
          }}
        >
          {department.deptName}
        </Typography>

        <Typography
          sx={{
            mt: 0.3,
            fontFamily: "Poppins, sans-serif",
            fontSize: 10.5,
            color: "#969AA6",
          }}
        >
          DEPT-{department.deptId}
        </Typography>
      </Box>
    </Box>
  );
};

export default DepartmentProfileHeader;