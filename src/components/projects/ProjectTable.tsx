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
import type { Project } from "../../types/project";
import TableActionMenu from "../common/TableActionMenu";
import ProjectStatusChip from "./ProjectStatusChip";

import {
  tableCellTextSx,
  tableHeaderRowSx,
  tablePrimaryTextSx,
  tableRowSx,
  tableSecondaryTextSx,
} from "../common/tableStyles";

interface ProjectTableProps {
  projects: Project[];
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onChangeStatus: (project: Project) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const ProjectTable = ({
  projects,
  onEdit,
  onDelete,
  onView,
  onChangeStatus,
  canEdit,
  canDelete,
}: ProjectTableProps) => {
  return (
    <TableContainer
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <Table sx={{ width: "100%", tableLayout: "fixed" }}>
        <TableHead>
          <TableRow sx={tableHeaderRowSx}>
            <TableCell sx={{ pl: 2.5 }}>Project</TableCell>
            <TableCell>Manager</TableCell>
            <TableCell>Employees</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right" sx={{ pr: 2.5 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {projects.map((project) => {
            const actions = [
              {
                label: "View Details",
                icon: ViewIcon,
                onClick: () => {
                  onView(project);
                },
              },

              ...(canEdit
                ? [
                    {
                      label: "Edit Project",
                      icon: Edit02Icon,
                      onClick: () => {
                        onEdit(project);
                      },
                    },
                    {
                      label: "Change Status",
                      icon: ArrowDataTransferHorizontalIcon,
                      onClick: () => {
                        onChangeStatus(project);
                      },
                    },
                  ]
                : []),

              ...(canDelete
                ? [
                    {
                      label: "Delete Project",
                      icon: Delete02Icon,
                      danger: true,
                      onClick: () => {
                        onDelete(project);
                      },
                    },
                  ]
                : []),
            ];
            return (
              <TableRow key={project.projectId} hover sx={tableRowSx}>
                <TableCell sx={{ pl: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#E9E7FF",
                        color: "#5965E8",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {project.projectName.charAt(0).toUpperCase()}
                    </Box>

                    <Box>
                      <Typography sx={tablePrimaryTextSx}>
                        {project.projectName}
                      </Typography>

                      <Typography sx={tableSecondaryTextSx}>
                        PROJ-{project.projectId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography sx={tableCellTextSx}>
                    {project.managerName || "Not Assigned"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={tableCellTextSx}>
                    {project.employeeNames?.length ?? 0}{" "}
                    {project.employeeNames?.length === 1
                      ? "Employee"
                      : "Employees"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <ProjectStatusChip status={project.status} />
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

export default ProjectTable;
