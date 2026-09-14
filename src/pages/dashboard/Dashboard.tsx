import { useEffect, useState } from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  UserGroupIcon,
  Building03Icon,
  Briefcase01Icon,
  Task01Icon,
} from "@hugeicons/core-free-icons";

import StatCard from "../../components/dashboard/StatCard";

import EmployeeStatusChart from "../../components/dashboard/EmployeeStatusChart";
import DepartmentDistributionChart from "../../components/dashboard/DepartmentDistributionChart";
import RecentEmployees from "../../components/dashboard/RecentEmployees";
import RecentProjects from "../../components/dashboard/RecentProjeccts";

import {
  getDashboardStats,
  getEmployeeStatus,
  getDepartmentDistribution,
  getManagerDashboard,
  getEmployeeDashboard,
  type EmployeeStatus,
  type DashboardStats,
  type DepartmentDistribution,
  type ManagerDashboard,
  type EmployeeDashboard,
} from "../../api/dashboardApi";

import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [employeeStatus, setEmployeeStatus] = useState<EmployeeStatus | null>(
    null,
  );
  const [departmentDistribution, setDepartmentDistribution] = useState<
    DepartmentDistribution[]
  >([]);
  const [managerDashboard, setManagerDashboard] =
    useState<ManagerDashboard | null>(null);
  const [employeeDashboard, setEmployeeDashboard] =
    useState<EmployeeDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        if (user.role === "ADMIN" || user.role === "HR") {
          const [statsData, employeeStatusData, departmentDistributionData] =
            await Promise.all([
              getDashboardStats(),
              getEmployeeStatus(),
              getDepartmentDistribution(),
            ]);

          setStats(statsData);
          setEmployeeStatus(employeeStatusData);
          setDepartmentDistribution(departmentDistributionData);
          return;
        }

        if (user.role === "MANAGER") {
          const managerData = await getManagerDashboard();
          setManagerDashboard(managerData);
          return;
        }

        if (user.role === "EMPLOYEE") {
          const employeeData = await getEmployeeDashboard();
          setEmployeeDashboard(employeeData);
          return;
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);

        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <CircularProgress size={22} />

          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              color: "#7A7F9A",
            }}
          >
            Loading dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          py: 4,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 13,
            color: "#DC2626",
          }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  if (user?.role === "ADMIN") {
    return (
      <Box
        sx={{
          width: "100%",
          pb: 5,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              xl: "repeat(4, 1fr)",
            },

            gap: 2,
          }}
        >
          <StatCard
            title="Total Employees"
            value={stats?.totalEmployees ?? 0}
            subtitle="Organization wide"
            icon={
              <HugeiconsIcon icon={UserGroupIcon} size={24} strokeWidth={1.8} />
            }
            accentColor="#4F46E5"
            iconBackground="#EEF0FF"
          />

          <StatCard
            title="Departments"
            value={stats?.totalDepartments ?? 0}
            subtitle="Across organization"
            icon={
              <HugeiconsIcon
                icon={Building03Icon}
                size={24}
                strokeWidth={1.8}
              />
            }
            accentColor="#047857"
            iconBackground="#ECFDF5"
          />

          <StatCard
            title="Active Projects"
            value={stats?.totalProjects ?? 0}
            subtitle="Currently running"
            icon={
              <HugeiconsIcon
                icon={Briefcase01Icon}
                size={24}
                strokeWidth={1.8}
              />
            }
            accentColor="#D97706"
            iconBackground="#FFFBEB"
          />

          <StatCard
            title="Pending Tasks"
            value={stats?.pendingTasks ?? 0}
            subtitle="Require attention"
            icon={
              <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.8} />
            }
            accentColor="#BE185D"
            iconBackground="#FDF2F8"
          />
        </Box>

        <Box
          sx={{
            mt: 2,

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr 1fr",
            },

            gap: 2,
          }}
        >
          {employeeStatus && <EmployeeStatusChart data={employeeStatus} />}

          {departmentDistribution.length > 0 && (
            <DepartmentDistributionChart data={departmentDistribution} />
          )}

          <RecentEmployees />

          <RecentProjects />
        </Box>
      </Box>
    );
  }

  if (user?.role === "HR") {
    return (
      <Box
        sx={{
          width: "100%",
          pb: 5,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              xl: "repeat(4, 1fr)",
            },

            gap: 2,
          }}
        >
          <StatCard
            title="Total Employees"
            value={stats?.totalEmployees ?? 0}
            subtitle="Organization wide"
            icon={
              <HugeiconsIcon icon={UserGroupIcon} size={24} strokeWidth={1.8} />
            }
            accentColor="#4F46E5"
            iconBackground="#EEF0FF"
          />

          <StatCard
            title="Departments"
            value={stats?.totalDepartments ?? 0}
            subtitle="Across organization"
            icon={
              <HugeiconsIcon
                icon={Building03Icon}
                size={24}
                strokeWidth={1.8}
              />
            }
            accentColor="#047857"
            iconBackground="#ECFDF5"
          />

          <StatCard
            title="Active Employees"
            value={employeeStatus?.active ?? 0}
            subtitle="Currently active"
            icon={
              <HugeiconsIcon icon={UserGroupIcon} size={24} strokeWidth={1.8} />
            }
            accentColor="#059669"
            iconBackground="#ECFDF5"
          />

          <StatCard
            title="Pending Tasks"
            value={stats?.pendingTasks ?? 0}
            subtitle="Organization tasks"
            icon={
              <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.8} />
            }
            accentColor="#BE185D"
            iconBackground="#FDF2F8"
          />
        </Box>

        <Box
          sx={{
            mt: 2,

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr 1fr",
            },

            gap: 2,
          }}
        >
          {employeeStatus && <EmployeeStatusChart data={employeeStatus} />}

          {departmentDistribution.length > 0 && (
            <DepartmentDistributionChart data={departmentDistribution} />
          )}

          <RecentEmployees />
        </Box>
      </Box>
    );
  }

  if (user?.role === "MANAGER") {
    return (
      <Box
        sx={{
          width: "100%",
          pb: 5,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              xl: "repeat(4, 1fr)",
            },

            gap: 2,
          }}
        >
          <StatCard
            title="My Projects"
            value={managerDashboard?.totalProjects ?? 0}
            subtitle="Projects you manage"
            icon={
              <HugeiconsIcon
                icon={Briefcase01Icon}
                size={24}
                strokeWidth={1.8}
              />
            }
            accentColor="#D97706"
            iconBackground="#FFFBEB"
          />

          <StatCard
            title="Project Employees"
            value={managerDashboard?.totalEmployees ?? 0}
            subtitle="Employees in your projects"
            icon={
              <HugeiconsIcon icon={UserGroupIcon} size={24} strokeWidth={1.8} />
            }
            accentColor="#4F46E5"
            iconBackground="#EEF0FF"
          />

          <StatCard
            title="Pending Tasks"
            value={managerDashboard?.pendingTasks ?? 0}
            subtitle="Tasks requiring attention"
            icon={
              <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.8} />
            }
            accentColor="#BE185D"
            iconBackground="#FDF2F8"
          />

          <StatCard
            title="Completed Tasks"
            value={managerDashboard?.completedTasks ?? 0}
            subtitle="Completed tasks"
            icon={
              <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.8} />
            }
            accentColor="#047857"
            iconBackground="#ECFDF5"
          />
        </Box>
      </Box>
    );
  }

  if (user?.role === "EMPLOYEE") {
    return (
      <Box
        sx={{
          width: "100%",
          pb: 5,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              xl: "repeat(4, 1fr)",
            },

            gap: 2,
          }}
        >
          <StatCard
            title="My Tasks"
            value={employeeDashboard?.totalTasks ?? 0}
            subtitle="Assigned to you"
            icon={
              <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.8} />
            }
            accentColor="#BE185D"
            iconBackground="#FDF2F8"
          />

          <StatCard
            title="Pending Tasks"
            value={employeeDashboard?.pendingTasks ?? 0}
            subtitle="Tasks requiring attention"
            icon={
              <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.8} />
            }
            accentColor="#D97706"
            iconBackground="#FFFBEB"
          />

          <StatCard
            title="My Projects"
            value={employeeDashboard?.totalProjects ?? 0}
            subtitle="Projects you belong to"
            icon={
              <HugeiconsIcon
                icon={Briefcase01Icon}
                size={24}
                strokeWidth={1.8}
              />
            }
            accentColor="#4F46E5"
            iconBackground="#EEF0FF"
          />

          <StatCard
            title="Completed Tasks"
            value={employeeDashboard?.completedTasks ?? 0}
            subtitle="Tasks completed"
            icon={
              <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.8} />
            }
            accentColor="#047857"
            iconBackground="#ECFDF5"
          />
        </Box>
      </Box>
    );
  }

  return null;
};

export default Dashboard;
