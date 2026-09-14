import api from "./axios";

import type { Task } from "../types/task";

import type { PageResponse, ApiResponse } from "../types/common";

export interface CreateTaskRequest {
  taskTitle: string;
  projectId: number;
  employeeId: number;
  assignedDate : string;
  dueDate : string;
}

export interface UpdateTaskRequest {
  taskTitle : string;
  projectId : number;
}

export interface TaskSearchParams {
  tname?: string;
  projectId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<ApiResponse<Task[]>>("/tasks");
  return response.data.data;
};

export const getTaskById = async (id: number): Promise<Task> => {
  const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await api.post<ApiResponse<Task>>("/tasks", data);
  return response.data.data;
};

export const updateTask = async (
  id: number,
  data: UpdateTaskRequest,
): Promise<Task> => {
  const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
  return response.data.data;
};

export const patchTask = async (
  id: number,
  data: Partial<UpdateTaskRequest>,
): Promise<Task> => {
  const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, data);

  return response.data.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const searchTasks = async (
  params: TaskSearchParams,
): Promise<PageResponse<Task>> => {
  const response = await api.get<ApiResponse<PageResponse<Task>>>(
    "/tasks/search",
    {
      params,
    },
  );

  return response.data.data;
};
