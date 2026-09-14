import api from "./axios";

import type { ApiResponse, PageResponse } from "../types/common";
import type { Project, ProjectStatus } from "../types/project";
import type { Manager } from "../types/manager";

export interface ProjectCreateRequest {
  projectName: string;
  employeeIds: number[];
}
export interface ProjectUpdateRequest {
  projectName?: string;
  employeeIds?: number[];
}

export interface ProjectSearchParams {
  pname?: string;
  managerId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProjectEmployee {
  employeeId: number;
  firstName: string;
  lastName: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<ApiResponse<Project[]>>("/projects");
  return response.data.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
  return response.data.data;
};

export const getProjectEmployees = async (
  projectId: number,
): Promise<ProjectEmployee[]> => {
  const response = await api.get(`/projects/${projectId}/employees`);
  return response.data.data;
};
export const createProject = async (data: ProjectCreateRequest) => {
  const response = await api.post<ApiResponse<Project>>("/projects", data);
  return response.data.data;
};

export const updateProject = async (
  id: number,
  data: ProjectUpdateRequest,
): Promise<Project> => {
  const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, data);
  return response.data.data;
};

export const updateProjectStatus = async (
  id: number,
  status: ProjectStatus,
): Promise<Project> => {
  const response = await api.patch<ApiResponse<Project>>(
    `/projects/${id}/status`,
    { status },
  );
  return response.data.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`projects/${id}`);
};

export const restoreProject = async (id: number): Promise<void> => {
  await api.patch(`/projects/${id}/restore`);
};

export const searchProjects = async (
  params: ProjectSearchParams,
): Promise<PageResponse<Project>> => {
  const response = await api.get<ApiResponse<PageResponse<Project>>>(
    "/projects/search",
    { params },
  );
  return response.data.data;
};

export const getManagers = async (): Promise<Manager[]> => {
  const response = await api.get("/projects/managers");

  return response.data.data;
};

export const assignEmployeeToProject = async (
  projectId: number,
  employeeId: number,
) => {
  const response = await api.post(
    `/projects/${projectId}/assign-employee/${employeeId}`,
  );

  return response.data.data;
};

export const removeEmployeeFromProject = async (
  projectId: number,
  employeeId: number,
): Promise<void> => {
  await api.delete(`/projects/${projectId}/remove-employee/${employeeId}`);
};
