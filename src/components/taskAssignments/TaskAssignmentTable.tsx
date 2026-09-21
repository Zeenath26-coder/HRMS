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
  
} from "@hugeicons/core-free-icons";

import { useNavigate } from "react-router-dom";

import type { TaskAssignment } from "../../types/taskAssignment";

import TaskAssignmentStatusChip from "./TaskStatusChip";

import TableActionMenu from "../common/TableActionMenu";

import {
  tableCellTextSx,
  tableHeaderRowSx,
  tablePrimaryTextSx,
  tableRowSx,
  tableSecondaryTextSx,
  tableSmallTextSx,
} from "../common/tableStyles";

interface TaskAssignmentTableProps {
  assignments: TaskAssignment[];
  onEdit: (assignment: TaskAssignment) => void;
  onDelete: (assignment: TaskAssignment) => void;
}

const TaskAssignmentTable = ({
  assignments,
  onEdit,
  onDelete,
}: TaskAssignmentTableProps) => {
  const navigate = useNavigate();

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow sx={tableHeaderRowSx}>
            <TableCell sx={{ pl: 2.5 }}>Task</TableCell>

            <TableCell>Employee</TableCell>

            <TableCell>Project</TableCell>

            <TableCell>Assigned Date</TableCell>

            <TableCell>Due Date</TableCell>

            <TableCell>Status</TableCell>

            <TableCell align="right" sx={{ pr: 2.5 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.assignmentId} hover sx={tableRowSx}>
              <TableCell sx={{ pl: 2.5 }}>
                <Box>
                  <Typography sx={tablePrimaryTextSx}>
                    {assignment.taskTitle}
                  </Typography>

                  <Typography sx={tableSecondaryTextSx}>
                    TASK-{assignment.taskId}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>
                <Typography sx={tableCellTextSx}>
                  {assignment.employeeName}
                </Typography>

                <Typography sx={tableSecondaryTextSx}>
                  EMP-{assignment.employeeId}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography sx={tableCellTextSx}>
                  {assignment.projectName}
                </Typography>

                <Typography sx={tableSecondaryTextSx}>
                  PROJECT-{assignment.projectId}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography sx={tableSmallTextSx}>
                  {formatDate(assignment.assignedDate)}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography sx={tableSmallTextSx}>
                  {formatDate(assignment.dueDate)}
                </Typography>
              </TableCell>

              <TableCell>
                <TaskAssignmentStatusChip status={assignment.taskStatus} />
              </TableCell>

              <TableCell align="right" sx={{ pr: 2 }}>
                <TableActionMenu
                  actions={[
                    {
                      label: "View Details",
                      icon: ViewIcon,
                      onClick: () => {
                        navigate(
                          `/task-assignments/${assignment.assignmentId}`,
                        );
                      },
                    },

                    {
                      label: "Edit Assignment",
                      icon: Edit02Icon,
                      onClick: () => {
                        onEdit(assignment);
                      },
                    },

                    {
                      label: "Delete Assignment",
                      icon: Delete02Icon,
                      danger: true,
                      onClick: () => {
                        onDelete(assignment);
                      },
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

export default TaskAssignmentTable;
