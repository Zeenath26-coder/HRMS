import { useCallback, useEffect, useState } from "react";

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
  Briefcase01Icon,

  UserIcon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { useNavigate, useParams } from "react-router-dom";

import { getProjectById } from "../../api/projectApi";
import { getEmployees } from "../../api/employeeApi";

import type { Project } from "../../types/project";
import type { Employee } from "../../types/employee";

import DetailsCard from "../../components/common/DetailsCard";
import FormDialog from "../../components/common/FormDialog";

import ProjectForm from "../../components/projects/ProjectForm";
import ProjectTeam from "../../components/projects/ProjectTeam";
import AddProjectEmployeeDialog from "../../components/projects/AddProjectEmployeeDialog";

import { primaryButtonSx } from "../../components/common/formStyles";
import { useAuth } from "../../context/AuthContext";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";


const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = hasPermission(user?.role, PERMISSIONS.MANAGE_PROJECTS);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);

  const loadProject = useCallback(async () => {
    if (!id) {
      setError("Project ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await getProjectById(Number(id));
      setProject(data);
    } catch (err) {
      console.error("Failed to load project:", err);
      setError("Failed to load project details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadEmployees = useCallback(async () => {
    try {
      const data = await getEmployees();

      setEmployees(data);
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  }, []);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  useEffect(() => {
    if (canManage) {
      loadEmployees();
    }
  }, [loadEmployees, canManage]);

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

  if (error || !project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Project not found."}</Alert>

        <Button
          startIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={17} />}
          onClick={() => navigate("/projects")}
          sx={{
            mt: 2,
            textTransform: "none",
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            color: "#5965E8",
          }}
        >
          Back to Projects
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
            onClick={() => navigate("/projects")}
            startIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={16} />}
            sx={{
              p: 0,
              mb: 1,
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
            Back to Projects
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
            Project Details
          </Typography>
        </Box>

        {canManage && (
          <Button
            startIcon={<HugeiconsIcon icon={Edit02Icon} size={16} />}
            onClick={() => setEditDialogOpen(true)}
            sx={primaryButtonSx}
          >
            Edit Project
          </Button>
        )}
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
                width: 58,
                height: 58,
                borderRadius: "14px",
                backgroundColor: "#E9E7FF",
                color: "#5965E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <HugeiconsIcon icon={Briefcase01Icon} size={27} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#292D38",
                }}
              >
                {project.projectName}
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10.5,
                  color: "#969AA6",
                }}
              >
                PROJECT-
                {project.projectId}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <DetailsCard
            title="Project Information"
            items={[
              {
                label: "Project ID",
                value: `PROJECT-${project.projectId}`,
                icon: Briefcase01Icon,
              },
              {
                label: "Project Name",
                value: project.projectName,
                icon: Briefcase01Icon,
              },
            ]}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <DetailsCard
            title="Manager Information"
            items={[
              {
                label: "Manager",
                value: project.managerName || "Not Assigned",
                icon: UserIcon,
              },
              {
                label: "Manager ID",
                value: project.managerId
                  ? `USER-${project.managerId}`
                  : "Not Assigned",
                icon: UserIcon,
              },
            ]}
          />
        </Grid>
      </Grid>

      <ProjectTeam
        project={project}
        canManage={canManage}
        onAddEmployee={() => setAddEmployeeOpen(true)}
        onSuccess={loadProject}
      />

      {canManage && (
        <FormDialog
          open={editDialogOpen}
          title="Edit Project"
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
        >
          <ProjectForm
            project={project}
            employees={employees}
            onSuccess={async () => {
              setEditDialogOpen(false);
              await loadProject();
            }}
            onCancel={() => setEditDialogOpen(false)}
          />
        </FormDialog>
      )}

      {canManage && (
        <AddProjectEmployeeDialog
          open={addEmployeeOpen}
          projectId={project.projectId}
          employees={employees}
          assignedEmployeeIds={project.employeeIds ?? []}
          onClose={() => setAddEmployeeOpen(false)}
          onSuccess={async () => {
            await loadProject();
          }}
        />
      )}
    </Box>
  );
};

export default ProjectDetails;
