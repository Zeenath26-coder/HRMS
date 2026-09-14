import { useEffect, useState } from "react";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { searchTasks, deleteTask } from "../../api/taskApi";
import { getProjects } from "../../api/projectApi";
import type { Task } from "../../types/task";
import type { Project } from "../../types/project";
import type { PageResponse } from "../../types/common";

import TaskForm from "../../components/task/TaskForm";
import TaskTable from "../../components/task/TaskTable";
import TaskFilters from "../../components/task/TaskFilters";

import TaskAssignmentForm from "../../components/taskAssignments/TaskAssignmentForm";

import SearchField from "../../components/common/SearchField";
import PageActionButton from "../../components/common/PageActionButton";
import TablePagination from "../../components/common/TablePagination";
import DataTableCard from "../../components/common/DataTableCard";
import FormDialog from "../../components/common/FormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import type { Employee } from "../../types/employee";

import { useBounce } from "../../hooks/useDebounce";
import { getActiveEmployees } from "../../api/employeeApi";

const PAGE_SIZE = 10;

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useBounce(searchInput, 400);
  const [projectFilter, setProjectFilter] = useState<number | "">("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewTaskDialog, setViewTaskDialog] = useState(false);
  const [taskToView, setTaskToView] = useState<Task | null>(null);

  const [assignTaskDialogOpen, setAssignTaskDialogOpen] = useState(false);
  const [taskToAssign, setTaskToAssign] = useState<Task | null>(null);

  const hasActiveFilters = projectFilter !== "";

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data: PageResponse<Task> = await searchTasks({
        tname: debouncedSearch || undefined,
        projectId: projectFilter === "" ? undefined : projectFilter,
        page,
        size: PAGE_SIZE,
        sort: "taskId,desc",
      });

      setTasks(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setError("Unable to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
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

  useEffect(() => {
    loadProjects();
    loadEmployees();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [page, debouncedSearch, projectFilter]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, projectFilter]);

  const handleAddTask = () => {
    setSelectedTask(null);
    setOpenTaskDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setOpenTaskDialog(true);
  };

  const handleCloseTaskDialog = () => {
    setOpenTaskDialog(false);
    setSelectedTask(null);
  };

  const handleTaskSuccess = async () => {
    const isEditing = !!selectedTask;
    handleCloseTaskDialog();
    await loadTasks();
    toast.success(
      isEditing ? "Task updated successfully" : "Task added successfully",
    );
  };

  const handleViewTask = (task: Task) => {
    setTaskToView(task);
    setViewTaskDialog(true);
  };

  const handleCloseViewTask = () => {
    setViewTaskDialog(false);
    setTaskToView(null);
  };

  const handleAssignTask = (task: Task) => {
    setTaskToAssign(task);
    setAssignTaskDialogOpen(true);
  };

  const handleCloseAssignTask = () => {
    setAssignTaskDialogOpen(false);
    setTaskToAssign(null);
  };

  const handleAssignTaskSuccess = async () => {
    handleCloseAssignTask();
    toast.success("Task assigned successfully");
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) {
      return;
    }
    try {
      setDeleting(true);
      await deleteTask(taskToDelete.taskId);
      toast.success("Task deleted successfully");

      setDeleteDialogOpen(false);
      setTaskToDelete(null);

      if (tasks.length === 1 && page > 0) {
        setPage((previous) => previous - 1);
      } else {
        await loadTasks();
      }
    } catch (error: any) {
      console.error("Failed to delete task:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete task. Please try again.",
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
    setTaskToDelete(null);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setProjectFilter("");
    setPage(0);
  };

  const handleProjectChange = (value: number | "") => {
    setProjectFilter(value);
    setPage(0);
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
          placeholder="Search tasks..."
        />

        <PageActionButton
          label="Add Task"
          icon={Add01Icon}
          onClick={handleAddTask}
        />
      </Box>

      <TaskFilters
        projectFilter={projectFilter}
        projects={projects}
        hasActiveFilters={hasActiveFilters}
        onProjectChange={handleProjectChange}
        onClear={handleResetFilters}
      />

      <DataTableCard
        loading={loading}
        error={error}
        empty={tasks.length === 0}
        emptyMessage="No tasks found."
      >
        <TaskTable
          tasks={tasks}
          onView={handleViewTask}
          onAssign={handleAssignTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
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
        open={openTaskDialog}
        title={selectedTask ? "Edit Task" : "Add Task"}
        onClose={handleCloseTaskDialog}
        maxWidth="sm"
      >
        <TaskForm
          task={selectedTask}
          projects={projects}
          employees={employees}
          onSuccess={handleTaskSuccess}
          onCancel={handleCloseTaskDialog}
        />
      </FormDialog>

      <Dialog
        open={viewTaskDialog}
        onClose={handleCloseViewTask}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            fontFamily: "Poppins, sans-serif",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            fontFamily: "Poppins, sans-serif",

            fontSize: 18,
            fontWeight: 600,
            color: "#20234A",
          }}
        >
          Task Details
          <IconButton onClick={handleCloseViewTask}>
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {taskToView && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#7A7F9A",
                    mb: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Task
                </Typography>

                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#20234A",
                  }}
                >
                  {taskToView.taskTitle}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#7A7F9A",
                    mb: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Task ID
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#20234A",
                  }}
                >
                  TASK-
                  {taskToView.taskId}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#7A7F9A",
                    mb: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Project
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#20234A",
                  }}
                >
                  {taskToView.projectName || "No project"}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <FormDialog
        open={assignTaskDialogOpen}
        title="Assign Task"
        onClose={handleCloseAssignTask}
        maxWidth="sm"
      >
        <TaskAssignmentForm
          task={taskToAssign}
          projects={projects}
          onSuccess={handleAssignTaskSuccess}
          onCancel={handleCloseAssignTask}
        />
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        itemName={taskToDelete ? taskToDelete.taskTitle : undefined}
        confirmText="Delete Task"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default Tasks;
