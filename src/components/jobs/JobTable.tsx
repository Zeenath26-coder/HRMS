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

import type { Job } from "../../types/jobdesc";
import TableActionMenu from "../common/TableActionMenu";

import {
  tableHeaderRowSx,
  tableRowSx,
  tablePrimaryTextSx,
  tableSecondaryTextSx,
  tableCellTextSx,
  tableAvatarSx,
} from "../common/tableStyles";

interface JobTableProps {
  jobs: Job[];
  onView: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

const JobTable = ({ jobs, onView, onEdit, onDelete }: JobTableProps) => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow sx={tableHeaderRowSx}>
            <TableCell sx={{ pl: 2.5 }}>Job Position</TableCell>
            <TableCell>Job Code</TableCell>
            <TableCell>Minimum Salary</TableCell>
            <TableCell>Maximum Salary</TableCell>
            <TableCell align="right" sx={{ pr: 2.5 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.jobId} hover sx={tableRowSx}>
              <TableCell sx={{ pl: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.3,
                  }}
                >
                  <Avatar sx={tableAvatarSx}>
                    {job.jobTitle.charAt(0).toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography sx={tablePrimaryTextSx}>
                      {job.jobTitle}
                    </Typography>

                    <Typography sx={tableSecondaryTextSx}>
                      Job Position
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell>
                <Typography sx={tableCellTextSx}>
                  {job.jobCode || "Not Assigned"}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography sx={tableCellTextSx}>
                  {job.minSalary.toLocaleString()}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography sx={tableCellTextSx}>
                  {job.maxSalary.toLocaleString()}
                </Typography>
              </TableCell>

              <TableCell align="right" sx={{ pr: 2 }}>
                <TableActionMenu
                  actions={[
                    {
                      label: "View Details",
                      icon: ViewIcon,
                      onClick: () => onView(job),
                    },

                    {
                      label: "Edit Department",
                      icon: Edit02Icon,
                      onClick: () => onEdit(job),
                    },

                    {
                      label: "Delete Department",
                      icon: Delete02Icon,
                      onClick: () => onDelete(job),
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

export default JobTable;
