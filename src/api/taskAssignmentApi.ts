import api from "./axios";

import type { ApiResponse, PageResponse } from "../types/common";

import type { TaskAssignment } from "../types/taskAssignment";

import type { TaskStatus } from "../types/task";

export interface TaskAssignmentRequest {
  taskId: number;
  employeeId: number;
  assignedDate: string;
  dueDate: string;
}

export interface TaskAssignmentSearchParams {
  taskStatus?: TaskStatus;
  employeeId?: number;
  dueFrom?: string;
  dueTo?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface UpdateTaskStatusRequest {
  taskStatus: TaskStatus;
}

export const assignTask = async (
  data: TaskAssignmentRequest,
): Promise<TaskAssignment> => {
  const response = await api.post<ApiResponse<TaskAssignment>>(
    "/task-assignments/assign",
    data,
  );

  return response.data.data;
};

export const getTaskAssignments = async (
  params?: TaskAssignmentSearchParams,
): Promise<PageResponse<TaskAssignment>> => {
  const response = await api.get<ApiResponse<PageResponse<TaskAssignment>>>(
    "/task-assignments/search",
    {
      params,
    },
  );

  return response.data.data;
};

export const getTaskAssignmentById = async (
  id: number,
): Promise<TaskAssignment> => {
  const response = await api.get(`/task-assignments/${id}`);

  return response.data.data;
};

export const getMyTasks = async (): Promise<TaskAssignment[]> => {
  const response = await api.get<ApiResponse<TaskAssignment[]>>(
    "/task-assignments/my-tasks",
  );

  return response.data.data;
};

export const updateTaskStatus = async (
  assignmentId: number,
  data: UpdateTaskStatusRequest,
): Promise<TaskAssignment> => {
  const response = await api.patch<ApiResponse<TaskAssignment>>(
    `/task-assignments/${assignmentId}/status`,
    data,
  );

  return response.data.data;
};
export const searchTaskAssignments = async (
  params: TaskAssignmentSearchParams,
): Promise<PageResponse<TaskAssignment>> => {
  const response = await api.get<ApiResponse<PageResponse<TaskAssignment>>>(
    "/task-assignments/search",
    {
      params,
    },
  );

  return response.data.data;
};

export const updateTaskAssignment = async (
  assignmentId: number,
  data: TaskAssignmentRequest,
): Promise<TaskAssignment> => {
  const response = await api.put<ApiResponse<TaskAssignment>>(
    `/task-assignments/${assignmentId}`,
    data,
  );
  return response.data.data;
};

export const deleteTaskAssignment = async (
  assignmentId: number,
): Promise<void> => {
  await api.delete(`/task-assignments/${assignmentId}`);
};
