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
  Building03Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { getDepartmentById } from "../../api/departmentApi";
import type { Department } from "../../types/department";
import DepartmentProfileHeader from "../../components/departments/DepartmentProfileHeader";
import DetailsCard from "../../components/common/DetailsCard";
import { primaryButtonSx } from "../../components/common/formStyles";
import FormDialog from "../../components/common/FormDialog";
import DepartmentForm from "../../components/departments/DepartmentForm";
import type { Employee } from "../../types/employee";
import { getEmployees } from "../../api/employeeApi";

const DepartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [managers, setManagers] = useState<Employee[]>([]);

  const loadDepartment = useCallback(async () => {
    if (!id) {
      setError("Department ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [departmentData, employeesData] = await Promise.all([
        getDepartmentById(Number(id)),
        getEmployees(),
      ]);

      setDepartment(departmentData);

      setManagers(employeesData);
    } catch (err) {
      console.error("Failed to load department:", err);
      setError("Failed to load department details.");
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    loadDepartment();
  }, [loadDepartment]);

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

  if (error || !department) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Department not found."}</Alert>

        <Button
          startIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={17} />}
          onClick={() => navigate("/departments")}
          sx={{
            mt: 2,
            textTransform: "none",
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            color: "#5965E8",
          }}
        >
          Back to Departments
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
            onClick={() => navigate("/departments")}
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
            Back to Departments
          </Button>

          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: "#292D38",
            }}
          >
            Department Details
          </Typography>
        </Box>

        <Button
          startIcon={<HugeiconsIcon icon={Edit02Icon} size={16} />}
          onClick={() => setEditDialogOpen(true)}
          sx={primaryButtonSx}
        >
          Edit Department
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
          <DepartmentProfileHeader department={department} />
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Department Information"
            items={[
              {
                label: "Department ID",
                value: `DEPT-${department.deptId}`,
                icon: Building03Icon,
              },
              {
                label: "Department Name",
                value: department.deptName,
                icon: Building03Icon,
              },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Manager Information"
            items={[
              {
                label: "Manager",
                value: department.managerName || "Not Assigned",
                icon: UserIcon,
              },
              {
                label: "Manager ID",
                value: department.managerId
                  ? `EMP-${department.managerId}`
                  : "Not Assigned",
                icon: UserIcon,
              },
            ]}
          />
        </Grid>
      </Grid>
      <FormDialog
        open={editDialogOpen}
        title="Edit Department"
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
      >
        <DepartmentForm
          department={department}
          managers={managers}
          onSuccess={async () => {
            setEditDialogOpen(false);
            await loadDepartment();
          }}
          onCancel={() => setEditDialogOpen(false)}
        />
      </FormDialog>
    </Box>
  );
};

export default DepartmentDetails;
