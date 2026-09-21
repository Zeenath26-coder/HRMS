import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { toast } from "sonner";

import {
  getTaskAssignments,
 
 
  deleteTaskAssignment,
} from "../../api/taskAssignmentApi";

import { getEmployees } from "../../api/employeeApi";

import type { TaskAssignment } from "../../types/taskAssignment";
import type { Employee } from "../../types/employee";
import type { TaskStatus } from "../../types/task";
import type { PageResponse } from "../../types/common";

import TaskAssignmentTable from "../../components/taskAssignments/TaskAssignmentTable";
import TaskAssignmentFilters from "../../components/taskAssignments/TaskAssignmentFilter";

import SearchField from "../../components/common/SearchField";
import TablePagination from "../../components/common/TablePagination";
import DataTableCard from "../../components/common/DataTableCard";

import { useBounce } from "../../hooks/useDebounce";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import FormDialog from "../../components/common/FormDialog";
import TaskAssignmentForm from "../../components/taskAssignments/TaskAssignmentForm";



import type { Project } from "../../types/project";
import { getProjects } from "../../api/projectApi";

const PAGE_SIZE = 10;

const TaskAssignments = () => {
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [projects, setProjects] = useState<Project[]>([]);


  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useBounce(searchInput, 400);

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");

  const [employeeFilter, setEmployeeFilter] = useState<number | "">("");

  const [dueFrom, setDueFrom] = useState("");

  const [dueTo, setDueTo] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

 

  const [selectedAssignment, setSelectedAssignment] =
    useState<TaskAssignment | null>(null);

  

  const handleEdit = (assignment: TaskAssignment) => {
    setSelectedAssignment(assignment);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    if (deleting) {
      return;
    }

    setEditDialogOpen(false);
    setSelectedAssignment(null);
  };

  const handleEditSuccess = async () => {
    setEditDialogOpen(false);
    setSelectedAssignment(null);

    await loadAssignments();

    toast.success("Task assignment updated successfully");
  };

  const handleDelete = (assignment: TaskAssignment) => {
    setSelectedAssignment(assignment);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAssignment) {
      return;
    }

    try {
      setDeleting(true);

      await deleteTaskAssignment(selectedAssignment.assignmentId);

      toast.success("Task assignment deleted successfully");

      setDeleteDialogOpen(false);
      setSelectedAssignment(null);

      if (assignments.length === 1 && page > 0) {
        setPage((previous) => previous - 1);
      } else {
        await loadAssignments();
      }
    } catch (error: any) {
      console.error("Failed to delete task assignment:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete task assignment. Please try again.",
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
    setSelectedAssignment(null);
  };

  const hasActiveFilters = Boolean(
    statusFilter || employeeFilter !== "" || dueFrom || dueTo,
  );

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const data: PageResponse<TaskAssignment> = await getTaskAssignments({
        taskStatus: statusFilter || undefined,

        employeeId: employeeFilter === "" ? undefined : employeeFilter,

        dueFrom: dueFrom || undefined,

        dueTo: dueTo || undefined,

        page,

        size: PAGE_SIZE,

        sort: "assignmentId,desc",
      });

      setAssignments(data.content);

      setTotalPages(data.totalPages);

      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to load task assignments:", error);

      setError("Unable to load task assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();

      setEmployees(data);
    } catch (error) {
      console.error("Failed to load employees:", error);
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

  useEffect(() => {
    loadEmployees();
    
    loadProjects();
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [page, statusFilter, employeeFilter, dueFrom, dueTo]);

  useEffect(() => {
    if (debouncedSearch) {
      setPage(0);
    }
  }, [debouncedSearch]);

  const handleResetFilters = () => {
    setSearchInput("");

    setStatusFilter("");

    setEmployeeFilter("");

    setDueFrom("");

    setDueTo("");

    setPage(0);
  };

  const handleStatusChange = (value: TaskStatus | "") => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleEmployeeChange = (value: number | "") => {
    setEmployeeFilter(value);
    setPage(0);
  };

  const handleDueFromChange = (value: string) => {
    setDueFrom(value);
    setPage(0);
  };

  const handleDueToChange = (value: string) => {
    setDueTo(value);
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
          placeholder="Search task assignments..."
        />
      </Box>

      <TaskAssignmentFilters
        statusFilter={statusFilter}
        employeeFilter={employeeFilter}
        dueFrom={dueFrom}
        dueTo={dueTo}
        employees={employees}
        hasActiveFilters={hasActiveFilters}
        onStatusChange={handleStatusChange}
        onEmployeeChange={handleEmployeeChange}
        onDueFromChange={handleDueFromChange}
        onDueToChange={handleDueToChange}
        onClear={handleResetFilters}
      />

      <DataTableCard
        loading={loading}
        error={error}
        empty={assignments.length === 0}
        emptyMessage="No task assignments found."
      >
        <TaskAssignmentTable
          assignments={assignments}
          onEdit={handleEdit}
        
          onDelete={handleDelete}
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
        open={editDialogOpen}
        title="Edit Task Assignment"
        onClose={handleCloseEditDialog}
        maxWidth="sm"
      >
        <TaskAssignmentForm
          assignment={selectedAssignment}
         projects={projects}
          onSuccess={handleEditSuccess}
          onCancel={handleCloseEditDialog}
        />
      </FormDialog>

    
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Task Assignment"
        message="Are you sure you want to delete this task assignment? This action cannot be undone."
        itemName={
          selectedAssignment
            ? `${selectedAssignment.taskTitle} → ${selectedAssignment.employeeName}`
            : undefined
        }
        confirmText="Delete Assignment"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default TaskAssignments;
