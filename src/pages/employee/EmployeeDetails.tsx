import { useEffect, useState, useCallback } from "react";
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
  UserIcon,
  Mail01Icon,
  Call02Icon,
  Building03Icon,
  Calendar03Icon,
  Briefcase01Icon,
  Money03Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { getEmployeeById } from "../../api/employeeApi";
import type { Employee } from "../../types/employee";

import DetailsCard from "../../components/common/DetailsCard";
import { UserAvatar } from "../../components/common/UserAvatar";
import EmployeeStatusChip from "../../components/employees/EmployeeStatusChip";
import { primaryButtonSx } from "../../components/common/formStyles";
import EmployeeProfileHeader from "../../components/employees/EmployeeProfileHeader";

import { formatDate, formatSalary } from "../../utils/formatters";

import { getDepartments } from "../../api/departmentApi";
import { getJobs } from "../../api/jobdescApi";

import type { Department } from "../../types/department";
import type { Job } from "../../types/jobdesc";

import FormDialog from "../../components/common/FormDialog";
import EmployeeForm from "../../components/employees/EmployeeForm";
const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);

  const [jobs, setJobs] = useState<Job[]>([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const loadEmployee = useCallback(async () => {
    if (!id) {
      setError("Employee ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getEmployeeById(Number(id));

      setEmployee(data);
    } catch (err) {
      console.error("Failed to load employee:", err);

      setError("Failed to load employee details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [departmentData, jobData] = await Promise.all([
          getDepartments(),
          getJobs(),
        ]);

        setDepartments(departmentData);
        setJobs(jobData);
      } catch (err) {
        console.error("Failed to load employee form data:", err);
      }
    };

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
        <CircularProgress size={28} sx={{ color: "#5965E8" }} />
      </Box>
    );
  }

  if (error || !employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Employee not found."}</Alert>

        <Button
          startIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={17} />}
          onClick={() => navigate("/employees")}
          sx={{
            mt: 2,
            textTransform: "none",
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            color: "#5965E8",
          }}
        >
          Back to Employees
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
            onClick={() => navigate("/employees")}
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
            Back to Employees
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
            Employee Details
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<HugeiconsIcon icon={Edit02Icon} size={16} />}
          onClick={() => setEditDialogOpen(true)}
          sx={primaryButtonSx}
        >
          Edit Employee
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
          <EmployeeProfileHeader employee={employee} />
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Personal Information"
            items={[
              {
                label: "First Name",
                value: employee.firstName,
                icon: UserIcon,
              },
              {
                label: "Last Name",
                value: employee.lastName,
                icon: UserIcon,
              },
              {
                label: "Email Address",
                value: employee.email,
                icon: Mail01Icon,
              },
              {
                label: "Phone Number",
                value: employee.phonenumber,
                icon: Call02Icon,
              },
              {
                label: "Date of Birth",
                value: formatDate(employee.dateofbirth),
                icon: Calendar03Icon,
              },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Employment Information"
            items={[
              {
                label: "Employee ID",
                value: `EMP-${employee.employeeId}`,
                icon: UserIcon,
              },
              {
                label: "Department",
                value: employee.departmentName,
                icon: Building03Icon,
              },
              {
                label: "Job Position",
                value: employee.jobTitle,
                icon: Briefcase01Icon,
              },
              {
                label: "Join Date",
                value: formatDate(employee.joinDate),
                icon: Calendar03Icon,
              },
              {
                label: "Salary",
                value: formatSalary(employee.salary),
                icon: Money03Icon,
              },
            ]}
          />
        </Grid>
      </Grid>
      <FormDialog
        open={editDialogOpen}
        title="Edit Employee"
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
      >
        <EmployeeForm
          employee={employee}
          departments={departments}
          jobs={jobs}
          onSuccess={async () => {
            setEditDialogOpen(false);

            await loadEmployee();
          }}
          onCancel={() => setEditDialogOpen(false)}
        />
      </FormDialog>
    </Box>
  );
};
export default EmployeeDetails;
