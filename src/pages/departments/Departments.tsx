import { useEffect, useState } from "react";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

import {
  Add01Icon,
  Cancel01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { toast } from "sonner";

import { searchDepartments, deleteDepartment } from "../../api/departmentApi";

import type { Department } from "../../types/department";
import type { PageResponse } from "../../types/common";
import type { Employee } from "../../types/employee";
import DepartmentFilters from "../../components/departments/DepartmentFilters";

import { getEmployees } from "../../api/employeeApi";

import DepartmentTable from "../../components/departments/DepartmentTable";
import DepartmentForm from "../../components/departments/DepartmentForm";

import ConfirmDialog from "../../components/common/ConfirmDialog";
import FilterBar from "../../components/common/FilterBar";

import { COLORS } from "../../theme/designToken";

import { useBounce } from "../../hooks/useDebounce";
import FilterSelect from "../../components/common/FilterSelect";
import FormDialog from "../../components/common/FormDialog";
import PageActionButton from "../../components/common/PageActionButton";
import SearchField from "../../components/common/SearchField";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

const Departments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useBounce(searchInput, 400);

  const [managerFilter, setManagerFilter] = useState<
    "ALL" | "WITH_MANAGER" | "WITHOUT_MANAGER"
  >("ALL");

  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      let hasManager: boolean | undefined;
      if (managerFilter === "WITH_MANAGER") {
        hasManager = true;
      }
      if (managerFilter === "WITHOUT_MANAGER") {
        hasManager = false;
      }
      const data: PageResponse<Department> = await searchDepartments({
        page,
        size: PAGE_SIZE,
        sort: "deptId,desc",
        dname: debouncedSearch || undefined,
        hasManager,
      });

      setDepartments(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error("Failed to load departments:", err);

      setError("Unable to load departments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadManagers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEmployees();
      setManagers(data);
    } catch (err) {
      console.error("Failed to load managers:", err);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, [page, debouncedSearch, managerFilter]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, managerFilter]);

  useEffect(() => {
    loadManagers();
  }, []);

  const handleClearSearch = () => {
    setSearchInput("");
    setPage(0);
  };

  const handleClearFilters = () => {
    setManagerFilter("ALL");
    setSearchInput("");
    setPage(0);
  };

  const hasActiveFilters = managerFilter !== "ALL";
  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setDepartmentDialogOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setDepartmentDialogOpen(true);
  };

  const handleViewDepartment = (department: Department) => {
    navigate(`/departments/${department.deptId}`);
  };

  const handleCloseDepartmentDialog = () => {
    setDepartmentDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleDepartmentSuccess = async () => {
    const editing = Boolean(selectedDepartment);
    handleCloseDepartmentDialog();
    await loadDepartments();
    toast.success(
      editing
        ? "Department updated successfully"
        : "Department added successfully",
    );
  };

  const handleDeleteDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDepartment) return;

    try {
      setDeleting(true);
      await deleteDepartment(selectedDepartment.deptId);
      toast.success("Department deleted successfully");

      setDeleteDialogOpen(false);
      setSelectedDepartment(null);

      await loadDepartments();
    } catch (error: unknown) {
      console.error("Failed to delete department:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 409) {
          toast.error(
            message ||
              "Department cannot be deleted because employees are assigned to it.",
          );
          return;
        }
        toast.error(
          message || "Unable to delete department. Please try again.",
        );
      } else {
        toast.error("Unable to delete department. Please try again.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (deleting) return;

    setDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
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
        }}
      >
        <SearchField
          value={searchInput}
          onChange={(value) => {
            setSearchInput(value);
            setPage(0);
          }}
          placeholder="Search departments..."
        />

        <PageActionButton
          label="Add Department"
          icon={Add01Icon}
          onClick={handleAddDepartment}
        />
      </Box>

      <DepartmentFilters
        managerFilter={managerFilter}
        hasActiveFilters={hasActiveFilters}
        onManagerChange={(value) => {
          setManagerFilter(value);
          setPage(0);
        }}
        onClear={handleClearFilters}
      />
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #E7E8F0",
          backgroundColor: COLORS.white,
          overflow: "hidden",

          boxShadow: "0 4px 18px rgba(48,52,110,0.035)",
        }}
      >
        {loading && (
          <Box
            sx={{
              minHeight: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              size={27}
              thickness={3}
              sx={{
                color: COLORS.primary,
              }}
            />
          </Box>
        )}

        {!loading && error && (
          <Box sx={{ p: 3 }}>
            <Alert
              severity="error"
              sx={{
                borderRadius: "12px",
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {!loading && !error && departments.length === 0 && (
          <Box
            sx={{
              minHeight: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 12.5,
                color: COLORS.textSecondary,
              }}
            >
              No departments found.
            </Typography>
          </Box>
        )}

        {!loading && !error && departments.length > 0 && (
          <>
            <DepartmentTable
              departments={departments}
              onView={handleViewDepartment}
              onEdit={handleEditDepartment}
              onDelete={handleDeleteDepartment}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                px: 2.5,
                py: 1.8,
                borderTop: "1px solid #ECEEF4",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10.5,
                  color: COLORS.textSecondary,
                }}
              >
                Showing {page * PAGE_SIZE + 1}–
                {Math.min((page + 1) * PAGE_SIZE, totalElements)} of{" "}
                {totalElements}
              </Typography>

              <Pagination
                page={page + 1}
                count={totalPages}
                onChange={(_, value) => setPage(value - 1)}
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11.5,
                    minWidth: 30,
                    height: 30,
                    borderRadius: "9px",
                    color: "#747991",
                  },

                  "& .Mui-selected": {
                    background: `${COLORS.primary} !important`,
                    color: "#FFFFFF",
                  },

                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: COLORS.primaryLight,
                  },
                }}
              />
            </Box>
          </>
        )}
      </Paper>

      <FormDialog
        open={departmentDialogOpen}
        title={selectedDepartment ? "Edit Department" : "Add Department"}
        onClose={handleCloseDepartmentDialog}
        maxWidth="sm"
      >
        <DepartmentForm
          department={selectedDepartment}
          managers={managers}
          onSuccess={handleDepartmentSuccess}
          onCancel={handleCloseDepartmentDialog}
        />
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Department"
        message="Are you sure you want to delete this department? This action cannot be undone."
        itemName={selectedDepartment?.deptName}
        confirmText="Delete Department"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default Departments;
