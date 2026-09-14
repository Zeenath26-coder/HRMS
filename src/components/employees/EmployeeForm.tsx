import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

import {
  Edit02Icon,
  UserAdd01Icon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  employeeSchema,
  type EmployeeFormData,
} from "../../validation/employeeValidation";

import type { Employee } from "../../types/employee";

import { createEmployee, updateEmployee } from "../../api/employeeApi";

import { primaryButtonSx, secondaryButtonSx } from "../common/formStyles";
import FormTextField from "../common/FormTextField";
import FormSelect from "../common/FormSelect";
import { formatSalary } from "../../utils/formatters";

interface DepartmentOption {
  deptId: number;
  deptName: string;
}

interface JobOption {
  jobId: number;
  jobTitle: string;
  minSalary: number;
  maxSalary: number;
}

interface EmployeeFormProps {
  employee?: Employee | null;
  departments: DepartmentOption[];
  jobs: JobOption[];
  onSuccess: () => void;
  onCancel: () => void;
}

const EmployeeForm = ({
  employee,
  departments,
  jobs,
  onSuccess,
}: EmployeeFormProps) => {
  const isEditMode = !!employee;

  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateofbirth: "",
      joinDate: "",
      exitDate: "",
      status: "ACTIVE",
      email: "",
      phonenumber: "",
      salary: undefined,
      deptId: undefined,
      jobId: undefined,
    },
  });

  const selectedJobId = watch("jobId");
  const selectedJob = jobs.find((job) => job.jobId === Number(selectedJobId));

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        dateofbirth: employee.dateofbirth,
        joinDate: employee.joinDate,
        exitDate: employee.exitDate ?? "",
        status: employee.status,
        email: employee.email,
        phonenumber: employee.phonenumber,
        salary: Number(employee.salary),
        deptId: employee.deptId,
        jobId: employee.jobId,
      });
    }
  }, [employee, reset]);

  const handleClear = () => {
    if (isEditMode && employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        dateofbirth: employee.dateofbirth,
        joinDate: employee.joinDate,
        exitDate: employee.exitDate ?? "",
        status: employee.status,
        email: employee.email,
        phonenumber: employee.phonenumber,
        salary: Number(employee.salary),
        deptId: employee.deptId,
        jobId: employee.jobId,
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        dateofbirth: "",
        joinDate: "",
        exitDate: "",
        status: "ACTIVE",
        email: "",
        phonenumber: "",
        salary: undefined,
        deptId: undefined,
        jobId: undefined,
      });
    }
    setServerError("");
  };

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      setSubmitting(true);
      setServerError("");

      let savedEmployee: Employee;

      if (isEditMode && employee) {
        savedEmployee = await updateEmployee(employee.employeeId, {
          ...data,
          exitDate: data.exitDate || undefined,
        });
      } else {
        savedEmployee = await createEmployee({
          ...data,
          exitDate: data.exitDate || undefined,
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Failed to save employee:", error);

      setServerError(
        error?.response?.data?.message ||
          "Unable to save employee. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        width: "100%",
      }}
    >
      {serverError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: "12px",
            fontFamily: "Poppins, sans-serif",
            fontSize: 11,
          }}
        >
          {serverError}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            mb: 1.8,
            fontFamily: "Poppins, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#3B3F4A",
          }}
        >
          Personal Information
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          <FormTextField
            label="First Name"
            required
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />

          <FormTextField
            label="Last Name"
            required
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />

          <FormTextField
            label="Date of Birth"
            type="date"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            required
            {...register("dateofbirth")}
            error={!!errors.dateofbirth}
            helperText={errors.dateofbirth?.message}
          />

          <FormTextField
            label="Email"
            type="email"
            required
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <FormTextField
            label="Phone Number"
            {...register("phonenumber")}
            error={!!errors.phonenumber}
            helperText={errors.phonenumber?.message}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            mb: 1.8,
            fontFamily: "Poppins, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#3B3F4A",
          }}
        >
          Employment Information
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          <FormSelect<EmployeeFormData>
            name="deptId"
            control={control}
            label="Department"
            required
            searchable
            options={departments.map((department) => ({
              value: department.deptId,
              label: department.deptName,
            }))}
          />

          <FormSelect
            name="jobId"
            control={control}
            label="Job Position"
            required
            options={jobs.map((job) => ({
              value: job.jobId,
              label: job.jobTitle,
            }))}
          />

          <FormTextField
            label="Join Date"
            type="date"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            required
            {...register("joinDate")}
            error={!!errors.joinDate}
            helperText={errors.joinDate?.message}
          />

          <FormSelect
            name="status"
            control={control}
            label="Status"
            required
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "RESIGNED", label: "Resigned" },
              { value: "TERMINATED", label: "Terminated" },
              { value: "RETIRED", label: "Retired" },
            ]}
          />
          <Box>
            <FormTextField
              label="Salary"
              type="number"
              required
              {...register("salary")}
              error={!!errors.salary}
              helperText={errors.salary?.message}
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: "0.01",
                },
              }}
            />
            {selectedJob && (
              <Typography
                sx={{
                  mt: 0.5,
                  ml: 0.5,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10.5,
                  color: "#858A98",
                }}
              >
                Salary range: {formatSalary(selectedJob.minSalary)} –{" "}
                {formatSalary(selectedJob.maxSalary)}
              </Typography>
            )}
          </Box>

          <FormTextField
            label="Exit Date"
            type="date"
            slotProps={{
              inputLabel: { shrink: true },
            }}
            {...register("exitDate")}
            error={!!errors.exitDate}
            helperText={
              errors.exitDate?.message || "Required when employee exits"
            }
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.2,
          pt: 2.5,
          borderTop: "1px solid #ECEEF3",
        }}
      >
        <Button
          type="button"
          disabled={submitting}
          onClick={handleClear}
          startIcon={<HugeiconsIcon icon={Refresh01Icon} size={16} />}
          sx={secondaryButtonSx}
        >
          Clear
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          startIcon={
            submitting ? (
              <CircularProgress
                size={15}
                thickness={3}
                sx={{ color: "#FFFFFF" }}
              />
            ) : (
              <HugeiconsIcon
                icon={isEditMode ? Edit02Icon : UserAdd01Icon}
                size={16}
              />
            )
          }
          sx={primaryButtonSx}
        >
          {submitting
            ? "Saving..."
            : isEditMode
              ? "Save Changes"
              : "Add Employee"}
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeForm;
