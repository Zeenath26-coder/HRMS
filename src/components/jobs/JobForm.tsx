import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

import {
  Edit02Icon,
  Refresh01Icon,
  Briefcase02Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  jobdescSchema,
  type JobFormData,
} from "../../validation/jobdescvalidation";

import type { Job } from "../../types/jobdesc";

import { createJob, updateJob } from "../../api/jobdescApi";

import { primaryButtonSx, secondaryButtonSx } from "../common/formStyles";

import FormTextField from "../common/FormTextField";

interface JobFormProps {
  job?: Job | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyValues: JobFormData = {
  jobTitle: "",
  jobCode: "",
  minSalary: 0,
  maxSalary: 0,
};

const JobForm = ({ job, onSuccess }: JobFormProps) => {
  const isEditMode = !!job;

  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: yupResolver(jobdescSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (job) {
      reset({
        jobTitle: job.jobTitle,
        jobCode: job.jobCode ?? "",
        minSalary: Number(job.minSalary),
        maxSalary: Number(job.maxSalary),
      });
    } else {
      reset(emptyValues);
    }

    setServerError("");
  }, [job, reset]);

  const handleClear = () => {
    if (isEditMode && job) {
      reset({
        jobTitle: job.jobTitle,
        jobCode: job.jobCode ?? "",
        minSalary: Number(job.minSalary),
        maxSalary: Number(job.maxSalary),
      });
    } else {
      reset(emptyValues);
    }

    setServerError("");
  };

  const onSubmit = async (data: JobFormData) => {
    try {
      setSubmitting(true);
      setServerError("");

      const requestData = {
        jobTitle: data.jobTitle,
        jobCode: data.jobCode || undefined,
        minSalary: Number(data.minSalary),
        maxSalary: Number(data.maxSalary),
      };

      if (isEditMode && job) {
        await updateJob(job.jobId, requestData);
      } else {
        await createJob(requestData);
      }

      onSuccess();
    } catch (error: any) {
      console.error("Failed to save job:", error);

      setServerError(
        error?.response?.data?.message ||
          "Unable to save job. Please try again.",
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
          Job Information
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
            label="Job Title"
            required
            {...register("jobTitle")}
            error={!!errors.jobTitle}
            helperText={errors.jobTitle?.message}
          />

          <FormTextField
            label="Job Code"
            {...register("jobCode")}
            error={!!errors.jobCode}
            helperText={errors.jobCode?.message}
          />

          <FormTextField
            label="Minimum Salary"
            type="number"
            required
            {...register("minSalary")}
            error={!!errors.minSalary}
            helperText={errors.minSalary?.message}
            slotProps={{
              htmlInput: {
                min: 0,
                step: "0.01",
              },
            }}
          />

          <FormTextField
            label="Maximum Salary"
            type="number"
            required
            {...register("maxSalary")}
            error={!!errors.maxSalary}
            helperText={errors.maxSalary?.message}
            slotProps={{
              htmlInput: {
                min: 0,
                step: "0.01",
              },
            }}
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
                sx={{
                  color: "#FFFFFF",
                }}
              />
            ) : (
              <HugeiconsIcon
                icon={isEditMode ? Edit02Icon : Briefcase02Icon}
                size={16}
              />
            )
          }
          sx={primaryButtonSx}
        >
          {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Job"}
        </Button>
      </Box>
    </Box>
  );
};

export default JobForm;
