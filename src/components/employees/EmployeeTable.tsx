import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  ViewIcon,
  Edit02Icon,
  Delete02Icon,
  ArrowDataTransferHorizontalIcon,
} from "@hugeicons/core-free-icons";

import { useNavigate } from "react-router-dom";

import type { Employee } from "../../types/employee";

import EmployeeStatusChip from "./EmployeeStatusChip";

import { UserAvatar } from "../common/UserAvatar";
import TableActionMenu from "../common/TableActionMenu";
import {
  tableCellTextSx,
  tableHeaderRowSx,
  tablePrimaryTextSx,
  tableRowSx,
  tableSecondaryTextSx,
  tableSmallTextSx,
} from "../common/tableStyles";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onChangeStatus: (employee: Employee) => void;
  canManage: boolean;
}

const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
  onChangeStatus,
  canManage,
}: EmployeeTableProps) => {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table sx={{ minWidth: 850 }}>
        <TableHead>
          <TableRow sx={tableHeaderRowSx}>
            <TableCell sx={{ pl: 2.5 }}>Employee</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Job Position</TableCell>
            <TableCell>Join Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right" sx={{ pr: 2.5 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {employees.map((employee) => {
            const actions = [
              {
                label: "View Details",
                icon: ViewIcon,
                onClick: () => {
                  navigate(`/employees/${employee.employeeId}`);
                },
              },

              ...(canManage
                ? [
                    {
                      label: "Edit Employee",
                      icon: Edit02Icon,
                      onClick: () => {
                        onEdit(employee);
                      },
                    },
                    {
                      label: "Change Status",
                      icon: ArrowDataTransferHorizontalIcon,
                      onClick: () => {
                        onChangeStatus(employee);
                      },
                    },
                    {
                      label: "Delete Employee",
                      icon: Delete02Icon,
                      danger: true,
                      onClick: () => {
                        onDelete(employee);
                      },
                    },
                  ]
                : []),
            ];

            return (
              <TableRow key={employee.employeeId} hover sx={tableRowSx}>
                <TableCell sx={{ pl: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.3,
                    }}
                  >
                    <UserAvatar
                      firstName={employee.firstName}
                      lastName={employee.lastName}
                    />

                    <Box>
                      <Typography sx={tablePrimaryTextSx}>
                        {employee.firstName} {employee.lastName}
                      </Typography>

                      <Typography sx={tableSecondaryTextSx}>
                        {employee.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography sx={tableCellTextSx}>
                    {employee.departmentName}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={tableCellTextSx}>
                    {employee.jobTitle}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={tableSmallTextSx}>
                    {new Date(employee.joinDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </TableCell>

                <TableCell>
                  <EmployeeStatusChip status={employee.status} />
                </TableCell>

                <TableCell align="right" sx={{ pr: 2 }}>
                  <TableActionMenu actions={actions} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeTable;
