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
  LockPasswordIcon,
  Delete02Icon,
  UserBlock01Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { useNavigate } from "react-router-dom";

import type { User } from "../../types/user";

import TableActionMenu from "../common/TableActionMenu";

import {
  tableCellTextSx,
  tableHeaderRowSx,
  tablePrimaryTextSx,
  tableRowSx,
  tableSecondaryTextSx,
} from "../common/tableStyles";

interface UserTableProps {
  users: User[];

  onEdit: (user: User) => void;

  onResetPassword: (user: User) => void;

  onChangeStatus: (user: User) => void;

  onDelete: (user: User) => void;
}

const UserTable = ({
  users,
  onEdit,
  onResetPassword,
  onChangeStatus,
  onDelete,
}: UserTableProps) => {
  const navigate = useNavigate();

  const handleView = (user: User) => {
    navigate(`/users/${user.userId}`);
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow sx={tableHeaderRowSx}>
            <TableCell sx={{ pl: 2.5 }}>
              User
            </TableCell>

            <TableCell>
              Role
            </TableCell>

            <TableCell>
              Employee
            </TableCell>

            <TableCell>
              Status
            </TableCell>

            <TableCell
              align="right"
              sx={{ pr: 2.5 }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.userId}
              hover
              sx={tableRowSx}
            >
              

              <TableCell sx={{ pl: 2.5 }}>
                <Box>
                  <Typography
                    sx={tablePrimaryTextSx}
                  >
                    {user.username}
                  </Typography>

                  <Typography
                    sx={tableSecondaryTextSx}
                  >
                    USER-{user.userId}
                  </Typography>
                </Box>
              </TableCell>


              <TableCell>
                <Typography
                  sx={{
                    ...tableCellTextSx,
                    fontWeight: 500,
                  }}
                >
                  {formatRole(user.role)}
                </Typography>
              </TableCell>

           

              <TableCell>
                <Typography
                  sx={tableCellTextSx}
                >
                  {user.employeeName ||
                    (user.employeeId
                      ? `EMP-${user.employeeId}`
                      : "-")}
                </Typography>
              </TableCell>

       

              <TableCell>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.7,
                    px: 1.1,
                    py: 0.45,
                    borderRadius: "20px",
                    backgroundColor: user.active
                      ? "#ECFDF3"
                      : "#FEF2F2",
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: user.active
                        ? "#16A34A"
                        : "#DC2626",
                    }}
                  />

                  <Typography
                    sx={{
                      fontFamily:
                        "Poppins, sans-serif",
                      fontSize: 10.5,
                      fontWeight: 500,
                      color: user.active
                        ? "#15803D"
                        : "#B91C1C",
                    }}
                  >
                    {user.active
                      ? "Active"
                      : "Inactive"}
                  </Typography>
                </Box>
              </TableCell>

          

              <TableCell
                align="right"
                sx={{ pr: 2 }}
              >
                <TableActionMenu
                  actions={[
                    {
                      label: "View Details",
                      icon: ViewIcon,
                      onClick: () =>
                        handleView(user),
                    },

                    {
                      label: "Edit User",
                      icon: Edit02Icon,
                      onClick: () =>
                        onEdit(user),
                    },

                    {
                      label: "Reset Password",
                      icon: LockPasswordIcon,
                      onClick: () =>
                        onResetPassword(user),
                    },

                    {
                      label: user.active
                        ? "Deactivate User"
                        : "Activate User",
                      icon: user.active
                        ? UserBlock01Icon
                        : UserCheck01Icon,
                      onClick: () =>
                        onChangeStatus(user),
                    },

                    {
                      label: "Delete User",
                      icon: Delete02Icon,
                      onClick: () =>
                        onDelete(user),
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


const formatRole = (
  role: User["role"],
) => {
  switch (role) {
    case "ADMIN":
      return "Admin";

    case "HR":
      return "HR";

    case "MANAGER":
      return "Manager";

    case "EMPLOYEE":
      return "Employee";

    default:
      return role;
  }
};

export default UserTable;