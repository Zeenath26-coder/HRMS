import api from "./axios";
import type { ApiResponse, PageResponse } from "../types/common";

import type { UserRole } from "../types/user";
import type { User } from "../types/user";

export interface CreateUserRequest {
  username: string;
  password: string;
  role: UserRole;
  employeeId: number;
}
export interface RegisterResponse {
  userId: number;
  userName: string;
  active: boolean;
}

export interface UpdateUserRequest {
  username: string;
  role: UserRole;
  active?: boolean;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface UserSearchParams {
  username?: string;
  active?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export const createUser = async (
  data: CreateUserRequest,
): Promise<RegisterResponse> => {
  const response = await api.post<ApiResponse<RegisterResponse>>(
    "/auth/register",
    data,
  );
  return response.data.data;
};

export const searchUsers = async (
  params?: UserSearchParams,
): Promise<PageResponse<User>> => {
  const response = await api.get<ApiResponse<PageResponse<User>>>(
    "/users/search",
    {
      params,
    },
  );
  return response.data.data;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<ApiResponse<User[]>>("/users");
  return response.data.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(`/users/${id}`);
  return response.data.data;
};

export const updateUser = async (
  id: number,
  data: UpdateUserRequest,
): Promise<User> => {
  const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
  return response.data.data;
};

export const resetUserPassword = async (id: number): Promise<string> => {
  const response = await api.patch<ApiResponse<string>>(
    `/users/${id}/reset-password`,
  );
  return response.data.data;
};

export const activateUser = async (id: number): Promise<void> => {
  await api.patch(`/users/${id}/activate`);
};

export const deactivateUser = async (id: number): Promise<void> => {
  await api.patch(`/users/${id}/deactivate`);
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};
