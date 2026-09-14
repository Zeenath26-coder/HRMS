import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { Add01Icon } from "@hugeicons/core-free-icons";

import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

import {
  getManagers,
  searchProjects,
  deleteProject,
} from "../../api/projectApi";

import type { Manager } from "../../types/manager";
import type { Project } from "../../types/project";
import type { PageResponse } from "../../types/common";

import ProjectForm from "../../components/projects/ProjectForm";
import ProjectTable from "../../components/projects/ProjectTable";
import ProjectFilters from "../../components/projects/ProjectFiters";

import ConfirmDialog from "../../components/common/ConfirmDialog";
import SearchField from "../../components/common/SearchField";
import PageActionButton from "../../components/common/PageActionButton";
import TablePagination from "../../components/common/TablePagination";
import DataTableCard from "../../components/common/DataTableCard";
import FormDialog from "../../components/common/FormDialog";

import { useBounce } from "../../hooks/useDebounce";
import type { Employee } from "../../types/employee";
import { getActiveEmployees } from "../../api/employeeApi";

import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS, hasPermission } from "../../utils/permissions";
import ChangeProjectStatusDialog from "../../components/projects/ChangeProjectStatusDialog";

const PAGE_SIZE = 10;

const Projects = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const canManageProjects = hasPermission(
    user?.role,
    PERMISSIONS.MANAGE_PROJECTS,
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useBounce(searchInput, 400);

  const [managerFilter, setManagerFilter] = useState<number | "">("");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [openProjectDialog, setOpenProjectDialog] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [deleting, setDeleting] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [projectForStatus, setProjectForStatus] = useState<Project | null>(
    null,
  );

  const hasActiveFilters = managerFilter !== "";

  const loadManagers = async () => {
    try {
      const data = await getManagers();

      setManagers(data);
    } catch (error) {
      console.error("Failed to load managers:", error);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await getActiveEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to load employees:", error);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data: PageResponse<Project> = await searchProjects({
        pname: debouncedSearch.trim() || undefined,

        managerId: managerFilter === "" ? undefined : managerFilter,

        page,
        size: PAGE_SIZE,

        sort: "projectId,desc",
      });

      setProjects(data.content);

      setTotalPages(data.totalPages);

      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to load projects:", error);

      setError("Unable to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManagers();
    loadEmployees();
  }, []);

  useEffect(() => {
    loadProjects();
  }, [page, debouncedSearch, managerFilter]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, managerFilter]);

  const handleAddProject = () => {
    setSelectedProject(null);

    setOpenProjectDialog(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setOpenProjectDialog(true);
  };

  const handleViewProject = (project: Project) => {
    navigate(`/projects/${project.projectId}`);
  };

  const handleCloseProjectDialog = () => {
    setOpenProjectDialog(false);
    setSelectedProject(null);
  };

  const handleProjectSuccess = async () => {
    const isEditing = selectedProject !== null;

    handleCloseProjectDialog();

    await loadProjects();

    toast.success(
      isEditing ? "Project updated successfully" : "Project added successfully",
    );
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);

    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) {
      return;
    }

    try {
      setDeleting(true);

      await deleteProject(projectToDelete.projectId);

      toast.success("Project deleted successfully");

      setDeleteDialogOpen(false);

      setProjectToDelete(null);

      if (projects.length === 1 && page > 0) {
        setPage((previousPage) => previousPage - 1);
      } else {
        await loadProjects();
      }
    } catch (error: any) {
      console.error("Failed to delete project:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete project. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);

    setProjectToDelete(null);
  };

  const handleResetFilters = () => {
    setSearchInput("");

    setManagerFilter("");

    setPage(0);
  };

  const handleManagerChange = (value: number | "") => {
    setManagerFilter(value);
    setPage(0);
  };

  const handleChangeProjectStatus = (project: Project) => {
    setProjectForStatus(project);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setProjectForStatus(null);
  };

  const handleStatusSuccess = async () => {
    handleCloseStatusDialog();
    await loadProjects();
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        width: "100%",
        pb: 5,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 1.8,
          width: "100%",
        }}
      >
        <SearchField
          value={searchInput}
          onChange={(value) => {
            setSearchInput(value);
            setPage(0);
          }}
          placeholder="Search projects..."
        />
        {canManageProjects && (
          <PageActionButton
            label="Add Project"
            icon={Add01Icon}
            onClick={handleAddProject}
          />
        )}
      </Box>

      <ProjectFilters
        managerFilter={managerFilter}
        managers={managers}
        hasActiveFilters={hasActiveFilters}
        onManagerChange={handleManagerChange}
        onClear={handleResetFilters}
      />

      <DataTableCard
        loading={loading}
        error={error}
        empty={projects.length === 0}
        emptyMessage="No projects found."
      >
        <ProjectTable
          projects={projects}
          onView={handleViewProject}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onChangeStatus={handleChangeProjectStatus}
          canEdit={canManageProjects}
          canDelete={canManageProjects}
        />

        <TablePagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
      </DataTableCard>

      <FormDialog
        open={openProjectDialog}
        title={selectedProject ? "Edit Project" : "Add Project"}
        onClose={handleCloseProjectDialog}
        maxWidth="sm"
      >
        <ProjectForm
          project={selectedProject}
          employees={employees}
          onSuccess={handleProjectSuccess}
          onCancel={handleCloseProjectDialog}
        />
      </FormDialog>

      <ChangeProjectStatusDialog
        open={statusDialogOpen}
        project={projectForStatus}
        onClose={handleCloseStatusDialog}
        onSuccess={handleStatusSuccess}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        itemName={projectToDelete ? projectToDelete.projectName : undefined}
        confirmText="Delete Project"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default Projects;
