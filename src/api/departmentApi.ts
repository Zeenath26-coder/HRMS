import api from "./axios";

import type { Department } from "../types/department";
import type { ApiResponse, PageResponse } from "../types/common";

export interface DepartmentRequest {
  deptName: string;
  managerId: number;
}

export interface DepartmentSearchParams {
  dname?: string;
  hasManager?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get<ApiResponse<Department[]>>("/departments");
  return response.data.data;
};

export const getDepartmentById = async (id: number): Promise<Department> => {
  const response = await api.get<ApiResponse<Department>>(`/departments/${id}`);
  return response.data.data;
};

export const createDepartment = async (
  data: DepartmentRequest,
): Promise<Department> => {
  const response = await api.post<ApiResponse<Department>>(
    "/departments",
    data,
  );
  return response.data.data;
};

export const updateDepartment = async (
  id: number,
  data: DepartmentRequest,
): Promise<Department> => {
  const response = await api.put<ApiResponse<Department>>(
    `/departments/${id}`,
    data,
  );
  return response.data.data;
};

export const patchDepartment = async (
  id: number,
  data: Partial<DepartmentRequest>,
): Promise<Department> => {
  const response = await api.patch<ApiResponse<Department>>(
    `/departments/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await api.delete(`/departments/${id}`);
};

export const searchDepartments = async (
  params: DepartmentSearchParams,
): Promise<PageResponse<Department>> => {
  const response = await api.get<ApiResponse<PageResponse<Department>>>(
    "/departments/search",
    {
      params,
    },
  );
  return response.data.data;
};
