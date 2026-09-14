export type ProjectStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface Project {
  projectId: number;
  projectName: string;
  managerId: number | null;
  managerName: string | null;
  employeeIds: number[];
  employeeNames: string[];
  status: ProjectStatus;
}
