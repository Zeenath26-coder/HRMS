export type UserRole = "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";

export interface User {
  userId: number;
  username: string;
  role: UserRole;
  employeeId: number | null;
  employeeName: string | null;
  active: boolean;
}
