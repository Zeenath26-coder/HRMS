import api from "./axios";
export type Role = "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";

export interface CurrentUser {
  username: string;
  role: Role;
  active: boolean;
  mustChangePassword : boolean;

  employeeId: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;

  department: string | null;
  jobPosition: string | null;

  joinDate: string | null;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get("/auth/me");
  return response.data.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const loginUser = async (
  username: string,
  password: string,
): Promise<CurrentUser> => {
  await api.post("/auth/login", { username, password });
  const currentUser = await getCurrentUser();
  return currentUser;
};

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<void> => {
  await api.post("/auth/reset-password", data);
};

export const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<void> => {
  await api.post("/auth/forgot-password", data);
};

export const changePassword = async (data: ChangePasswordRequest ,): Promise<void> => {
  await api.post("/auth/change-password" , data);
}