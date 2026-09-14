import api from "./axios";
import type { Job } from "../types/jobdesc";
import type { ApiResponse, PageResponse } from "../types/common";
import type { DepartmentRequest } from "./departmentApi";

export interface JobRequest {
  jobTitle: string;
  jobCode?: string;
  minSalary: number;
  maxSalary: number;
}

export interface SearchJobParams {
  jname?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const getJobs = async (): Promise<Job[]> => {
  const response = await api.get<ApiResponse<Job[]>>("/jobs");
  return response.data.data;
};

export const getJobsById = async (id: number): Promise<Job> => {
  const response = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
  return response.data.data;
};

export const createJob = async (data: JobRequest): Promise<Job> => {
  const response = await api.post<ApiResponse<Job>>("/jobs", data);
  return response.data.data;
};

export const updateJob = async (id: number, data: JobRequest): Promise<Job> => {
  const response = await api.put<ApiResponse<Job>>(`/jobs/${id}`, data);
  return response.data.data;
};

export const patchJob = async (
  id: number,
  data: Partial<JobRequest>,
): Promise<Job> => {
  const response = await api.patch<ApiResponse<Job>>(`/jobs/${id}`);
  return response.data.data;
};

export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`jobs/${id}`);
};

export const searchJobs = async (
  params: SearchJobParams,
): Promise<PageResponse<Job>> => {
  const response = await api.get<ApiResponse<PageResponse<Job>>>(
    "/jobs/search",
    { params },
  );
  return response.data.data;
};
