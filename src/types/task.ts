export type TaskStatus = "IN_PROGRESS" | "COMPLETED" | "ASSIGNED" | "CANCELLED";

export interface Task {
  taskId: number;
  taskTitle: string;

  projectId: number;
  projectName: string;
}

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
}
