import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import {
  ArrowLeft01Icon,
  Edit02Icon,
  Briefcase01Icon,
  Money01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { getJobsById } from "../../api/jobdescApi";

import type { Job } from "../../types/jobdesc";

import DetailsCard from "../../components/common/DetailsCard";

import { primaryButtonSx } from "../../components/common/formStyles";
import FormDialog from "../../components/common/FormDialog";
import JobForm from "../../components/jobs/JobForm";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const loadJob = useCallback(async () => {
    if (!id) {
      setError("Job ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getJobsById(Number(id));

      setJob(data);
    } catch (err) {
      console.error("Failed to load job:", err);

      setError("Failed to load job details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={28}
          sx={{
            color: "#5965E8",
          }}
        />
      </Box>
    );
  }

  if (error || !job) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || "Job not found."}</Alert>

        <Button
          startIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={17} />}
          onClick={() => navigate("/jobs")}
          sx={{
            mt: 2,
            textTransform: "none",
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            color: "#5965E8",
          }}
        >
          Back to Jobs
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 2.5 },
        backgroundColor: "#eef2ff36",
        minHeight: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Button
            onClick={() => navigate("/jobs")}
            startIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={16} />}
            sx={{
              p: 0,
              mb: 1,
              minWidth: 0,
              fontFamily: "Poppins, sans-serif",
              fontSize: 10.5,
              fontWeight: 500,
              color: "#858A98",
              textTransform: "none",

              "&:hover": {
                backgroundColor: "transparent",
                color: "#5965E8",
              },
            }}
          >
            Back to Jobs
          </Button>

          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: "#292D38",
            }}
          >
            Job Details
          </Typography>
        </Box>

        <Button
          startIcon={<HugeiconsIcon icon={Edit02Icon} size={16} />}
          onClick={() => setEditDialogOpen(true)}
          sx={primaryButtonSx}
        >
          Edit Job
        </Button>
      </Box>

      <Card
        elevation={0}
        sx={{
          border: "1px solid #ECEEF3",
          borderRadius: "14px",
          backgroundColor: "#FFFFFF",
          mb: 2,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, md: 2.5 },
            "&:last-child": {
              pb: { xs: 2, md: 2.5 },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.8,
            }}
          >
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: "14px",
                backgroundColor: "#E9E7FF",
                color: "#5965E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <HugeiconsIcon icon={Briefcase01Icon} size={27} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#292D38",
                }}
              >
                {job.jobTitle}
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10.5,
                  color: "#969AA6",
                }}
              >
                JOB-{job.jobId}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Job Information"
            items={[
              {
                label: "Job ID",
                value: `JOB-${job.jobId}`,
                icon: Briefcase01Icon,
              },
              {
                label: "Job Title",
                value: job.jobTitle,
                icon: Briefcase01Icon,
              },
              {
                label: "Job Code",
                value: job.jobCode || "Not Assigned",
                icon: Briefcase01Icon,
              },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Salary Information"
            items={[
              {
                label: "Minimum Salary",
                value: formatSalary(job.minSalary),
                icon: Money01Icon,
              },
              {
                label: "Maximum Salary",
                value: formatSalary(job.maxSalary),
                icon: Money01Icon,
              },
              {
                label: "Salary Range",
                value: `${formatSalary(job.minSalary)} - ${formatSalary(
                  job.maxSalary,
                )}`,
                icon: Money01Icon,
              },
            ]}
          />
        </Grid>
      </Grid>

      <FormDialog
        open={editDialogOpen}
        title="Edit Job"
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
      >
        <JobForm
          job={job}
          onSuccess={async () => {
            setEditDialogOpen(false);
            await loadJob();
          }}
          onCancel={() => setEditDialogOpen(false)}
        />
      </FormDialog>
    </Box>
  );
};

const formatSalary = (salary?: number | null) => {
  if (salary === null || salary === undefined) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(salary);
};

export default JobDetails;
