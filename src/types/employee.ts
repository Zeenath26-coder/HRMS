export type EmployeeStatus = "ACTIVE" | "RESIGNED" | "TERMINATED" | "RETIRED";

export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  dateofbirth: string;
  joinDate: string;
  exitDate: string | null;
  status: EmployeeStatus;
  email: string;
  phonenumber: string;
  salary: number;

  deptId: number;
  departmentName: string;

  jobId: number;
  jobTitle: string;
}
