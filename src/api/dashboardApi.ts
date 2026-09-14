import api from "./axios";

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  totalProjects: number;
  pendingTasks: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

export interface EmployeeStatus {
  active: number;
  resigned: number;
  terminated: number;
  retired: number;
}

export const getEmployeeStatus = async (): Promise<EmployeeStatus> => {
  const response = await api.get("/dashboard/employee-status");
  return response.data;
};

export interface DepartmentDistribution {
  department: string;
  employeeCount: number;
}

export const getDepartmentDistribution = async (): Promise<
  DepartmentDistribution[]
> => {
  const response = await api.get("/dashboard/department-distribution");
  return response.data;
};

export interface RecentEmployee {
  employeeId: number;
  firstName: string;
  lastName: string;
  department: string;
  status: "ACTIVE" | "RESIGNED" | "TERMINATED" | "RETIRED";
  joinDate: string;
}

export const getRecentEmployees = async (): Promise<RecentEmployee[]> => {
  const response = await api.get("/dashboard/recent-employees");
  return response.data;
};

export interface RecentProject {
  projectId: number;
  projectName: string;
  createdDate: string | null;
  employeeCount: number;
}

export const getRecentProjects = async (): Promise<RecentProject[]> => {
  const response = await api.get<RecentProject[]>("/dashboard/recent-projects");
  return response.data;
};

export interface ManagerDashboard {
  totalProjects: number;
  totalEmployees: number;
  pendingTasks: number;
  completedTasks: number;
}

export const getManagerDashboard = async (): Promise<ManagerDashboard> => {
  const response = await api.get("/dashboard/manager");
  return response.data;
};

export interface EmployeeDashboard {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  totalProjects: number;
}

export const getEmployeeDashboard = async (): Promise<EmployeeDashboard> => {
  const response = await api.get("/dashboard/employee");
  return response.data;
};
