import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import { toast } from "sonner";

import type { TaskAssignment } from "../../types/taskAssignment";
import type { TaskStatus } from "../../types/task";
import { useNavigate } from "react-router-dom";
import { getMyTasks, updateTaskStatus } from "../../api/taskAssignmentApi";

import MyTaskTable from "../../components/myTasks/MyTaskTable";
import UpdateTaskStatusDialog from "../../components/taskAssignments/UpdateTaskStatusDialog";

import SearchField from "../../components/common/SearchField";
import DataTableCard from "../../components/common/DataTableCard";

import { useBounce } from "../../hooks/useDebounce";

const MyTasks = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useBounce(searchInput, 400);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const [selectedAssignment, setSelectedAssignment] =
    useState<TaskAssignment | null>(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadMyTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyTasks();

      setAssignments(data);
    } catch (error) {
      console.error("Failed to load my tasks:", error);

      setError("Unable to load your tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyTasks();
  }, []);

  const filteredAssignments = assignments.filter((assignment) => {
    const search = debouncedSearch.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return (
      assignment.taskTitle?.toLowerCase().includes(search) ||
      assignment.projectName?.toLowerCase().includes(search)
    );
  });

  const handleView = (assignment: TaskAssignment) => {
    navigate(`/my-tasks/${assignment.assignmentId}`);
  };

  const handleChangeStatus = (assignment: TaskAssignment) => {
    setSelectedAssignment(assignment);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    if (updatingStatus) {
      return;
    }

    setStatusDialogOpen(false);
    setSelectedAssignment(null);
  };

  const handleStatusSuccess = async () => {
    setStatusDialogOpen(false);
    setSelectedAssignment(null);

    await loadMyTasks();

    toast.success("Task status updated successfully");
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
          }}
          placeholder="Search my tasks..."
        />
      </Box>

    

      <DataTableCard
        loading={loading}
        error={error}
        empty={filteredAssignments.length === 0}
        emptyMessage="No tasks assigned to you."
      >
        <MyTaskTable
          assignments={filteredAssignments}
          onView={handleView}
          onChangeStatus={handleChangeStatus}
        />
      </DataTableCard>

    

      <UpdateTaskStatusDialog
        open={statusDialogOpen}
        assignment={selectedAssignment}
        loading={updatingStatus}
        onClose={handleCloseStatusDialog}
        onSuccess={handleStatusSuccess}
      />
    </Box>
  );
};

export default MyTasks;
