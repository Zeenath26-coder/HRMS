import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import { AppLayout } from "../components/layout/AppLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Employees from "../pages/employee/Employee";
import EmployeeDetails from "../pages/employee/EmployeeDetails";
import Departments from "../pages/departments/Departments";
import DepartmentDetails from "../pages/departments/DepartmentDetails";
import Jobs from "../pages/jobdesc/Jobs";
import JobDetails from "../pages/jobdesc/JobDetails";
import Users from "../pages/users/Users";
import UserDetails from "../pages/users/UserDetails";
import Projects from "../pages/projects/Projects";
import ProjectDetails from "../pages/projects/ProjectDetails";
import Tasks from "../pages/tasks/Tasks";
import TaskDetails from "../pages/tasks/TaskDetails";
import TaskAssignments from "../pages/taskAssignments/TaskAssignments";
import TaskAssignmentDetails from "../pages/taskAssignments/TaskAssignmentDetails";
import MyTasks from "../pages/myTasks/MyTasks";
import MyTaskDetails from "../pages/myTasks/MyTaskDetails";
import MyProfile from "../pages/profile/MyProfile";
import ChangePassword from "../pages/auth/ChangePassword";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/change-password" element={<ChangePassword />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<MyProfile />} />

          <Route element={<RoleRoute allowedRoles={["ADMIN", "HR"]} />}>
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeDetails />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/:id" element={<DepartmentDetails />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetails />} />
          </Route>

          <Route
            element={
              <RoleRoute allowedRoles={["ADMIN", "MANAGER", "EMPLOYEE"]} />
            }
          >
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["ADMIN", "MANAGER"]} />}>
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/task-assignments" element={<TaskAssignments />} />
            <Route
              path="/task-assignments/:id"
              element={<TaskAssignmentDetails />}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={["EMPLOYEE"]} />}>
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/my-tasks/:id" element={<MyTaskDetails />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
