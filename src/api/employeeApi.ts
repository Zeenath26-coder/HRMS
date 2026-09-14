import api from "./axios";
import type { Employee, EmployeeStatus } from "../types/employee";
import type { ApiResponse, PageResponse } from "../types/common";

export interface EmployeeRequest {
  firstName: string;
  lastName?: string;
  dateofbirth: string;
  joinDate: string;
  exitDate?: string;
  status: EmployeeStatus;
  email: string;
  phonenumber?: string;
  salary: number;
  deptId: number;
  jobId: number;
}

export interface EmployeeSearchParams {
  ename?: string;
  statusType?: EmployeeStatus;
  departmentId?: number;
  jobId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<ApiResponse<Employee[]>>("/employees");
  return response.data.data;
};

export const getActiveEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<ApiResponse<Employee[]>>("/employees/active");
  return response.data.data;
};
export const getEmployeeById = async (id: number): Promise<Employee> => {
  const response = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
  return response.data.data;
};

export const createEmployee = async (
  data: EmployeeRequest,
): Promise<Employee> => {
  const response = await api.post<ApiResponse<Employee>>("/employees", data);
  return response.data.data;
};

export const updateEmployee = async (
  id: number,
  data: EmployeeRequest,
): Promise<Employee> => {
  const response = await api.put<ApiResponse<Employee>>(
    `/employees/${id}`,
    data,
  );
  return response.data.data;
};

export const patchEmployee = async (
  id: number,
  data: Partial<EmployeeRequest>,
): Promise<Employee> => {
  const response = await api.patch<ApiResponse<Employee>>(
    `/employees/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await api.delete(`/employees/${id}`);
};

export const searchEmployees = async (
  params: EmployeeSearchParams,
): Promise<PageResponse<Employee>> => {
  const response = await api.get<ApiResponse<PageResponse<Employee>>>(
    "/employees/search",
    {
      params,
    },
  );
  return response.data.data;
};

export const getEmployeesWithoutAccount = async (): Promise<Employee[]> => {
  const response = await api.get<ApiResponse<Employee[]>>(
    "/employees/without-account",
  );
  return response.data.data;
};
