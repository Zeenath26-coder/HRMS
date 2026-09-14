import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { ViewIcon, Edit02Icon, Delete02Icon } from "@hugeicons/core-free-icons";

import type { Department } from "../../types/department";
import TableActionMenu from "../common/TableActionMenu";
import { useNavigate } from "react-router-dom";
import {
  tableHeaderRowSx,
  tableRowSx,
  tablePrimaryTextSx,
  tableSecondaryTextSx,
  tableCellTextSx,
  tableAvatarSx,
  tableSmallTextSx,
} from "../common/tableStyles";

interface DepartmentTableProps {
  departments: Department[];
  onView: (department: Department) => void;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

const DepartmentTable = ({
  departments,
  onView,
  onEdit,
  onDelete,
}: DepartmentTableProps) => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow sx={tableHeaderRowSx}>
            <TableCell sx={{ pl: 2.5 }}>Department</TableCell>
            <TableCell>Manager</TableCell>
            <TableCell>Department ID</TableCell>
            <TableCell align="right" sx={{ pr: 2.5 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.deptId} hover sx={tableRowSx}>
              <TableCell sx={{ pl: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.3,
                  }}
                >
                  <Avatar sx={tableAvatarSx}>
                    {department.deptName.charAt(0).toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography sx={tablePrimaryTextSx}>
                      {department.deptName}
                    </Typography>

                    <Typography sx={tableSecondaryTextSx}>
                      Department
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell>
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11.5,
                    color: "#4B5060",
                  }}
                >
                  {department.managerName || "Not Assigned"}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography sx={tableSmallTextSx}>
                  DEPT-{department.deptId}
                </Typography>
              </TableCell>

              <TableCell align="right" sx={{ pr: 2 }}>
                <TableActionMenu
                  actions={[
                    {
                      label: "View Details",
                      icon: ViewIcon,
                      onClick: () => onView(department),
                    },

                    {
                      label: "Edit Department",
                      icon: Edit02Icon,
                      onClick: () => onEdit(department),
                    },

                    {
                      label: "Delete Department",
                      icon: Delete02Icon,
                      onClick: () => onDelete(department),
                      danger: true,
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DepartmentTable;
