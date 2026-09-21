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
  ArrowDataTransferHorizontalIcon,
} from "@hugeicons/core-free-icons";


import type { TaskAssignment } from "../../types/taskAssignment";

import TableActionMenu from "../common/TableActionMenu";

import {
  tableCellTextSx,
  tableHeaderRowSx,
  tablePrimaryTextSx,
  tableRowSx,
  tableSecondaryTextSx,
  tableSmallTextSx,
} from "../common/tableStyles";

import TaskStatusChip from "../taskAssignments/TaskStatusChip";

interface MyTaskTableProps {
  assignments: TaskAssignment[];
  onView: (assignment: TaskAssignment) => void;
  onChangeStatus: (assignment: TaskAssignment) => void;
}

const MyTaskTable = ({
  assignments,
  onView,
  onChangeStatus,
}: MyTaskTableProps) => {
  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 850 }}>
        <TableHead>
          <TableRow sx={tableHeaderRowSx}>
            <TableCell sx={{ pl: 2.5 }}>Task</TableCell>

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
                  {assignment.projectName}
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
                <TaskStatusChip status={assignment.taskStatus} />
              </TableCell>

             
              <TableCell align="right" sx={{ pr: 2 }}>
                <TableActionMenu
                  actions={[
                    {
                      label: "View Details",
                      icon: ViewIcon,
                      onClick: () => onView(assignment),
                    },
                    {
                      label: "Update Status",
                      icon: ArrowDataTransferHorizontalIcon,
                      onClick: () => onChangeStatus(assignment),
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

export default MyTaskTable;
