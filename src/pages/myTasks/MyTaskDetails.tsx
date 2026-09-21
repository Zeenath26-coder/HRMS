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
  ArrowDataTransferHorizontalIcon,
  Task01Icon,
  Folder01Icon,
  UserIcon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { getTaskAssignmentById } from "../../api/taskAssignmentApi";

import type { TaskAssignment } from "../../types/taskAssignment";
import type { TaskStatus } from "../../types/task";

import DetailsCard from "../../components/common/DetailsCard";
import TaskStatusChip from "../../components/taskAssignments/TaskStatusChip";
import UpdateTaskStatusDialog from "../../components/taskAssignments/UpdateTaskStatusDialog";

import { primaryButtonSx } from "../../components/common/formStyles";
import { formatDate } from "../../utils/formatters";

const MyTaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<TaskAssignment | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const loadAssignment = useCallback(async () => {
    if (!id) {
      setError("Task assignment ID is missing.");
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

  useEffect(() => {
    loadAssignment();
  }, [loadAssignment]);

  const handleOpenStatusDialog = () => {
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  const handleStatusSuccess = async (_status: TaskStatus) => {
    setStatusDialogOpen(false);

    await loadAssignment();
  };

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
        <CircularProgress size={28} sx={{ color: "#5965E8" }} />
      </Box>
    );
  }

  if (error || !assignment) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Task assignment not found."}</Alert>

        <Button
          startIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={17} />}
          onClick={() => navigate("/my-tasks")}
          sx={{
            mt: 2,
            textTransform: "none",
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            color: "#5965E8",
          }}
        >
          Back to My Tasks
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 2.5 },
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
            onClick={() => navigate("/my-tasks")}
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
            Back to My Tasks
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
            My Task Details
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={16} />
          }
          onClick={handleOpenStatusDialog}
          sx={primaryButtonSx}
        >
          Update Status
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
            p: { xs: 2, md: 2.5 },

            "&:last-child": {
              pb: { xs: 2, md: 2.5 },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
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
                  TASK-{assignment.taskId}
                </Typography>
              </Box>
            </Box>

            <TaskStatusChip status={assignment.taskStatus} />
          </Box>
        </CardContent>
      </Card>

      
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Task Information"
            items={[
              {
                label: "Task ID",
                value: `TASK-${assignment.taskId}`,
                icon: Task01Icon,
              },
              {
                label: "Task Title",
                value: assignment.taskTitle,
                icon: Task01Icon,
              },
              {
                label: "Project",
                value: assignment.projectName,
                icon: Folder01Icon,
              },
              {
                label: "Project ID",
                value: `PROJECT-${assignment.projectId}`,
                icon: Folder01Icon,
              },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Assignment Information"
            items={[
              {
                label: "Assignment ID",
                value: `ASSIGN-${assignment.assignmentId}`,
                icon: UserIcon,
              },
              {
                label: "Assigned To",
                value: assignment.employeeName,
                icon: UserIcon,
              },
              {
                label: "Assigned By",
                value: assignment.assignedBy || "Not recorded",
                icon: UserIcon,
              },
              {
                label: "Assigned Date",
                value: formatDate(assignment.assignedDate),
                icon: Calendar03Icon,
              },
              {
                label: "Due Date",
                value: formatDate(assignment.dueDate),
                icon: Calendar03Icon,
              },
            ]}
          />
        </Grid>
      </Grid>

     

      <UpdateTaskStatusDialog
        open={statusDialogOpen}
        assignment={assignment}
        
        onClose={handleCloseStatusDialog}
        onSuccess={handleStatusSuccess}
      />
    </Box>
  );
};

export default MyTaskDetails;
