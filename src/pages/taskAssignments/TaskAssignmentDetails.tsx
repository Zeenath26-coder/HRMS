import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import {
  ArrowLeft01Icon,
  Edit02Icon,
  Task01Icon,
  UserIcon,
  Folder01Icon,
  Calendar03Icon,
  CalendarAdd01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { getTaskAssignmentById } from "../../api/taskAssignmentApi";

import type { TaskAssignment } from "../../types/taskAssignment";

import DetailsCard from "../../components/common/DetailsCard";
import FormDialog from "../../components/common/FormDialog";
import TaskAssignmentForm from "../../components/taskAssignments/TaskAssignmentForm";

import { primaryButtonSx } from "../../components/common/formStyles";
import { formatDate } from "../../utils/formatters";

import { getProjects } from "../../api/projectApi";
import type { Project } from "../../types/project";

const TaskAssignmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<TaskAssignment | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const loadAssignment = useCallback(async () => {
    if (!id) {
      setError("Assignment ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getTaskAssignmentById(Number(id));

      setAssignment(data);
    } catch (err) {
      console.error("Failed to load task assignment:", err);

      setError("Failed to load task assignment details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  }, []);

  useEffect(() => {
    loadAssignment();
    loadProjects();
  }, [loadAssignment, loadProjects]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={28}
          sx={{
            color: "#5965E8",
          }}
        />
      </Box>
    );
  }

  if (error || !assignment) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Task assignment not found."}</Alert>

        <Button
          startIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={17} />}
          onClick={() => navigate("/task-assignments")}
          sx={{
            mt: 2,
            textTransform: "none",
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            color: "#5965E8",
          }}
        >
          Back to Task Assignments
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: {
          xs: 2,
          md: 3,
        },
        py: {
          xs: 2,
          md: 2.5,
        },
        backgroundColor: "#eef2ff36",
        minHeight: "100%",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Button
            onClick={() => navigate("/task-assignments")}
            startIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={16} />}
            sx={{
              p: 0,
              mb: 2,
              minWidth: 0,
              fontFamily: "Poppins, sans-serif",
              fontSize: 10.5,
              fontWeight: 500,
              color: "#858A98",
              textTransform: "none",

              "&:hover": {
                backgroundColor: "transparent",
                color: "#5965E8",
              },
            }}
          >
            Back to Task Assignments
          </Button>

          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: "#292D38",
              lineHeight: 1.3,
            }}
          >
            Task Assignment Details
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<HugeiconsIcon icon={Edit02Icon} size={16} />}
          onClick={() => setEditDialogOpen(true)}
          sx={primaryButtonSx}
        >
          Edit Assignment
        </Button>
      </Box>

      <Card
        elevation={0}
        sx={{
          border: "1px solid #ECEEF3",
          borderRadius: "14px",
          backgroundColor: "#FFFFFF",
          mb: 2,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 2.5,
            },

            "&:last-child": {
              pb: {
                xs: 2,
                md: 2.5,
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.8,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EEF0FF",
                color: "#5965E8",
                flexShrink: 0,
              }}
            >
              <HugeiconsIcon icon={Task01Icon} size={25} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#292D38",
                }}
              >
                {assignment.taskTitle}
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                  color: "#858A98",
                }}
              >
                ASSIGNMENT-
                {assignment.assignmentId}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Assignment Information"
            items={[
              {
                label: "Assignment ID",
                value: `ASSIGNMENT-${assignment.assignmentId}`,
                icon: Task01Icon,
              },
              {
                label: "Task",
                value: assignment.taskTitle,
                icon: Task01Icon,
              },
              {
                label: "Project",
                value: assignment.projectName,
                icon: Folder01Icon,
              },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Employee Information"
            items={[
              {
                label: "Employee",
                value: assignment.employeeName,
                icon: UserIcon,
              },
              {
                label: "Employee ID",
                value: `EMP-${assignment.employeeId}`,
                icon: UserIcon,
              },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Assignment Dates"
            items={[
              {
                label: "Assigned Date",
                value: formatDate(assignment.assignedDate),
                icon: CalendarAdd01Icon,
              },
              {
                label: "Due Date",
                value: formatDate(assignment.dueDate),
                icon: Calendar03Icon,
              },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Task Status"
            items={[
              {
                label: "Current Status",
                value: assignment.taskStatus,
                icon: Task01Icon,
              },
            ]}
          />
        </Grid>
      </Grid>

      <FormDialog
        open={editDialogOpen}
        title="Edit Task Assignment"
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
      >
        <TaskAssignmentForm
          projects={projects}
          assignment={assignment}
          onSuccess={async () => {
            setEditDialogOpen(false);

            await loadAssignment();
          }}
          onCancel={() => setEditDialogOpen(false)}
        />
      </FormDialog>
    </Box>
  );
};

export default TaskAssignmentDetails;
