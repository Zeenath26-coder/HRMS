import { useEffect, useState } from "react";
import { Box} from "@mui/material";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { searchEmployees, deleteEmployee } from "../../api/employeeApi";
import type { PageResponse } from "../../types/common";
import type { Employee, EmployeeStatus } from "../../types/employee";
import EmployeeForm from "../../components/employees/EmployeeForm";
import EmployeeTable from "../../components/employees/EmployeeTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getDepartments } from "../../api/departmentApi";
import { getJobs } from "../../api/jobdescApi";
import type { Job } from "../../types/jobdesc";
import ChangeStatusDialog from "../../components/employees/ChangeStatusDialog";
import { useBounce } from "../../hooks/useDebounce";

import SearchField from "../../components/common/SearchField";
import PageActionButton from "../../components/common/PageActionButton";
import TablePagination from "../../components/common/TablePagination";
import DataTableCard from "../../components/common/DataTableCard";
import FormDialog from "../../components/common/FormDialog";

import type { Department } from "../../types/department";
import EmployeeFilters from "../../components/employees/EmployeeFilters";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS, hasPermission } from "../../utils/permissions";

const PAGE_SIZE = 10;


const Employees = () => {
  const { user } = useAuth();

  const canManageEmployees = hasPermission(
    user?.role,
    PERMISSIONS.MANAGE_EMPLOYEES,
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null,);
  const [deleting, setDeleting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusEmployee, setStatusEmployee] = useState<Employee | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useBounce(searchInput, 400);
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "">("");
  const [departmentFilter, setDepartmentFilter] = useState<number | "">("");
  const [jobFilter, setJobFilter] = useState<number | "">("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const hasActiveFilters = Boolean(statusFilter || departmentFilter !== "" || jobFilter !== "",);

  const handleResetFilters = () => {
    setSearchInput("");
    setStatusFilter("");
    setDepartmentFilter("");
    setJobFilter("");
    setPage(0);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setOpenEmployeeDialog(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenEmployeeDialog(true);
  };

  const handleEmployeeSuccess = async () => {
    const isEditing = !!selectedEmployee;
    handleCloseEmployeeDialog();
    await loadEmployees();
    toast.success(
      isEditing
        ? "Employee updated successfully"
        : "Employee added successfully",
    );
  };

  const handleCloseEmployeeDialog = () => {
    setOpenEmployeeDialog(false);
    setSelectedEmployee(null);
  };

  const handleChangeStatus = (employee: Employee) => {
    setStatusEmployee(employee);
    setStatusDialogOpen(true);
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    setStatusEmployee(null);
  };

  const handleStatusSuccess = async () => {
    handleStatusDialogClose();
    await loadEmployees();
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const data: PageResponse<Employee> = await searchEmployees({
        page,
        size: PAGE_SIZE,
        sort: "employeeId,desc",
        ename: debouncedSearch || undefined,
        statusType: statusFilter || undefined,
        departmentId: departmentFilter === "" ? undefined : departmentFilter,
        jobId: jobFilter === "" ? undefined : jobFilter,
      });

      setEmployees(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to load employees:", error);

      setError("Unable to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [page, debouncedSearch, statusFilter, departmentFilter, jobFilter]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, statusFilter, departmentFilter, jobFilter]);

  useEffect(() => {
    loadDepartments();
    loadJobs();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Failed to load departments:", error);
    }
  };

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    }
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    try {
      setDeleting(true);
      await deleteEmployee(selectedEmployee.employeeId);
      toast.success("Employee deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);

      await loadEmployees();
    } catch (error: any) {
      console.error("Failed to delete employee:", error);
      toast.error(
        error?.response?.data?.message ||
          "Unable to delete employee. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (deleting) return;

    setDeleteDialogOpen(false);
    setSelectedEmployee(null);
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
          placeholder="Search employees..."
        />
        {canManageEmployees && (
          <PageActionButton
            label="Add Employee"
            icon={Add01Icon}
            onClick={handleAddEmployee}
          />
        )}
      </Box>

      <EmployeeFilters
        statusFilter={statusFilter}
        departmentFilter={departmentFilter}
        jobFilter={jobFilter}
        departments={departments}
        jobs={jobs}
        hasActiveFilters={hasActiveFilters}
        onStatusChange={setStatusFilter}
        onDepartmentChange={setDepartmentFilter}
        onJobChange={setJobFilter}
        onClear={handleResetFilters}
      />
      <DataTableCard
        loading={loading}
        error={error}
        empty={employees.length === 0}
        emptyMessage="No employees found."
      >
        <EmployeeTable
          employees={employees}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          onChangeStatus={handleChangeStatus}
          canManage={canManageEmployees}
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
        open={openEmployeeDialog}
        title={selectedEmployee ? "Edit Employee" : "Add Employee"}
        onClose={handleCloseEmployeeDialog}
        maxWidth="md"
      >
        <EmployeeForm
          employee={selectedEmployee}
          departments={departments}
          jobs={jobs}
          onSuccess={handleEmployeeSuccess}
          onCancel={handleCloseEmployeeDialog}
        />
      </FormDialog>

      <ChangeStatusDialog
        open={statusDialogOpen}
        employee={statusEmployee}
        onClose={handleStatusDialogClose}
        onSuccess={handleStatusSuccess}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        itemName={
          selectedEmployee
            ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
            : undefined
        }
        confirmText="Delete Employee"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default Employees;
