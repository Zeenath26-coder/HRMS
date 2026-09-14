import type { Role } from "../api/authApi";

export const PERMISSIONS = {
  MANAGE_USERS: ["ADMIN"],
  MANAGE_EMPLOYEES: ["ADMIN", "HR"],
  MANAGE_DEPARTMENTS: ["ADMIN", "HR"],
  MANAGE_JOBS: ["ADMIN", "HR"],
  MANAGE_PROJECTS: ["ADMIN", "MANAGER"],
  MANAGE_TASKS: ["ADMIN", "MANAGER"],
  VIEW_PROJECTS: ["ADMIN", "MANAGER", "EMPLOYEE"],
  VIEW_MY_TASKS: ["EMPLOYEE"],
} as const;

export const hasPermission = (
  role: Role | undefined,
  allowedRoles: readonly Role[],
): boolean => {
  return !!role && allowedRoles.includes(role);
};
