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

import { ViewIcon, Edit02Icon, Delete02Icon , UserAdd01Icon} from "@hugeicons/core-free-icons";

import { useNavigate } from "react-router-dom";

import type { Task } from "../../types/task";

import TableActionMenu from "../common/TableActionMenu";

import {
  tableCellTextSx,
  tableHeaderRowSx,
  tablePrimaryTextSx,
  tableRowSx,
  tableSecondaryTextSx,
} from "../common/tableStyles";

interface TaskTableProps {
  tasks: Task[];
 onView: (task: Task) => void;
  onEdit: (task: Task) => void;
 onAssign: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskTable = ({ tasks, onEdit, onDelete , onAssign ,onView}: TaskTableProps) => {
  const navigate = useNavigate();

  return (
    <TableContainer
      sx={{
        width: "100%",
        overflowX: "auto",

        "&::-webkit-scrollbar": {
          height: 6,
        },

        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },

        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#D9DCE8",
          borderRadius: 10,
        },
      }}
    >
      <Table
        sx={{
          width: "100%",
          minWidth: 700,
          tableLayout: "fixed",
        }}
      >
        <TableHead>
          <TableRow sx={tableHeaderRowSx}>
            <TableCell
              sx={{
                pl: 2.5,
                width: "42%",
              }}
            >
              Task
            </TableCell>

            <TableCell
              sx={{
                width: "35%",
              }}
            >
              Project
            </TableCell>

            <TableCell
              align="right"
              sx={{
                width: "23%",
                pr: 2.5,
              }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.taskId}
              hover
              sx={{
                ...tableRowSx,

                "&:last-child td": {
                  borderBottom: 0,
                },
              }}
            >
              <TableCell
                sx={{
                  pl: 2.5,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.3,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      minWidth: 38,

                      borderRadius: "11px",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      background:
                        "linear-gradient(135deg, #EEF0FF 0%, #E6E8FF 100%)",

                      color: "#5965E8",

                      fontFamily: "Poppins, sans-serif",

                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {task.taskTitle?.charAt(0).toUpperCase() || "T"}
                  </Box>

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        ...tablePrimaryTextSx,

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {task.taskTitle}
                    </Typography>

                    <Typography
                      sx={{
                        ...tableSecondaryTextSx,

                        mt: 0.15,
                      }}
                    >
                      TASK-{task.taskId}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell
                sx={{
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{
                      ...tableCellTextSx,

                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {task.projectName || "Not Assigned"}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  pr: 2,
                }}
              >
                <TableActionMenu
                  actions={[
                    {
                      label: "View Details",
                      icon: ViewIcon,

                      onClick: () => {
                        navigate(`/tasks/${task.taskId}`);
                      },
                    },

                    {
                      label: "Edit Task",
                      icon: Edit02Icon,

                      onClick: () => {
                        onEdit(task);
                      },
                    },
                      {
      label: "Assign Task",
      icon: UserAdd01Icon,
      onClick: () => {
        onAssign(task);
      },
    },

                    {
                      label: "Delete Task",
                      icon: Delete02Icon,
                      danger: true,

                      onClick: () => {
                        onDelete(task);
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

export default TaskTable;
