import type { TaskStatus } from "./task";

export interface TaskAssignment {
  assignmentId: number;

  taskId: number;
  taskTitle: string;

  employeeId: number;
  employeeName: string;

  projectId: number;
  projectName: string;

  assignedDate: string;
  dueDate: string;

  taskStatus: TaskStatus;
  assignedBy?: string ;
  assignedById?: number;
}
