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
  Folder01Icon,

} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { getTaskById } from "../../api/taskApi";
import { getProjects } from "../../api/projectApi";

import type { Task } from "../../types/task";
import type { Project } from "../../types/project";

import DetailsCard from "../../components/common/DetailsCard";
import FormDialog from "../../components/common/FormDialog";
import TaskForm from "../../components/task/TaskForm";

import { primaryButtonSx } from "../../components/common/formStyles";

import { getEmployees } from "../../api/employeeApi";
import type { Employee } from "../../types/employee";


const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const loadTask = useCallback(async () => {
    if (!id) {
      setError("Task ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getTaskById(Number(id));

      setTask(data);
    } catch (err) {
      console.error("Failed to load task:", err);

      setError("Failed to load task details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadFormData = async () => {
    try {
      const [projectData , employeeData] = await Promise.all([getProjects() , getEmployees(),]);

      setProjects(projectData);
      setEmployees(employeeData);

    } catch (err) {
      console.error("Failed to load  task form data:", err);
    }
  };

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  useEffect(() => {
    loadFormData();
  }, []);

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

  if (error || !task) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Task not found."}</Alert>

        <Button
          startIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={17} />}
          onClick={() => navigate("/tasks")}
          sx={{
            mt: 2,
            textTransform: "none",
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            color: "#5965E8",
          }}
        >
          Back to Tasks
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
            onClick={() => navigate("/tasks")}
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
            Back to Tasks
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
            Task Details
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<HugeiconsIcon icon={Edit02Icon} size={16} />}
          onClick={() => setEditDialogOpen(true)}
          sx={primaryButtonSx}
        >
          Edit Task
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
                {task.taskTitle}
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                  color: "#858A98",
                }}
              >
                TASK-{task.taskId}
              </Typography>
            </Box>
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
                value: `TASK-${task.taskId}`,
                icon: Task01Icon,
              },
              {
                label: "Task Title",
                value: task.taskTitle,
                icon: Task01Icon,
              },
              {
                label: "Project",
                value: task.projectName,
                icon: Folder01Icon,
              },
            ]}
          />
        </Grid>
      </Grid>

      <FormDialog
        open={editDialogOpen}
        title="Edit Task"
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
      >
        <TaskForm
          task={task}
          projects={projects}
          employees={employees}
          onSuccess={async () => {
            setEditDialogOpen(false);
            await loadTask();
          }}
          onCancel={() => setEditDialogOpen(false)}
        />
      </FormDialog>
    </Box>
  );
};

export default TaskDetails;
