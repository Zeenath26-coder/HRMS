import { useEffect, useState } from "react";
import axios from "axios";

import {
  Alert,
  Box,
  CircularProgress,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";

import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

import { deleteJob, searchJobs } from "../../api/jobdescApi";

import type { Job } from "../../types/jobdesc";
import type { PageResponse } from "../../types/common";

import JobTable from "../../components/jobs/JobTable";
import JobForm from "../../components/jobs/JobForm";

import ConfirmDialog from "../../components/common/ConfirmDialog";
import FormDialog from "../../components/common/FormDialog";
import PageActionButton from "../../components/common/PageActionButton";
import SearchField from "../../components/common/SearchField";

import { COLORS } from "../../theme/designToken";

import { useBounce } from "../../hooks/useDebounce";
import { Add01Icon } from "@hugeicons/core-free-icons";

const PAGE_SIZE = 10;

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useBounce(searchInput, 400);

  const [jobDialogOpen, setJobDialogOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data: PageResponse<Job> = await searchJobs({
        page,
        size: PAGE_SIZE,
        sort: "id,desc",
        jname: debouncedSearch || undefined,
      });

      setJobs(data.content);

      setTotalPages(data.totalPages);

      setTotalElements(data.totalElements);
    } catch (err) {
      console.error("Failed to load jobs:", err);

      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page, debouncedSearch]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(0);
  };

  const handleAddJob = () => {
    setSelectedJob(null);
    setJobDialogOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setJobDialogOpen(true);
  };
  const handleViewJob = (job: Job) => {
    navigate(`/jobs/${job.jobId}`);
  };

  const handleCloseJobDialog = () => {
    setJobDialogOpen(false);
    setSelectedJob(null);
  };

  const handleJobSuccess = async () => {
    const editing = Boolean(selectedJob);

    handleCloseJobDialog();

    await loadJobs();

    toast.success(
      editing ? "Job updated successfully" : "Job added successfully",
    );
  };

  const handleDeleteJob = (job: Job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedJob) return;

    try {
      setDeleting(true);

      await deleteJob(selectedJob.jobId);

      toast.success("Job deleted successfully");

      setDeleteDialogOpen(false);
      setSelectedJob(null);

      if (jobs.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        await loadJobs();
      }
    } catch (error: unknown) {
      console.error("Failed to delete job:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        const message = error.response?.data?.message;

        if (status === 409) {
          toast.error(
            message || "Job cannot be deleted because it is being used.",
          );

          return;
        }

        toast.error(message || "Unable to delete job. Please try again.");
      } else {
        toast.error("Unable to delete job. Please try again.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (deleting) return;

    setDeleteDialogOpen(false);
    setSelectedJob(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        pb: 5,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 1.8,
        }}
      >
        <SearchField
          value={searchInput}
          onChange={handleSearch}
          placeholder="Search job positions..."
        />

        <PageActionButton
          label="Add Job"
          icon={Add01Icon}
          onClick={handleAddJob}
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #E7E8F0",
          backgroundColor: COLORS.white,
          overflow: "hidden",
          boxShadow: "0 4px 18px rgba(48,52,110,0.035)",
        }}
      >
        {loading && (
          <Box
            sx={{
              minHeight: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              size={27}
              thickness={3}
              sx={{
                color: COLORS.primary,
              }}
            />
          </Box>
        )}

        {!loading && error && (
          <Box sx={{ p: 3 }}>
            <Alert
              severity="error"
              sx={{
                borderRadius: "12px",
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {!loading && !error && jobs.length === 0 && (
          <Box
            sx={{
              minHeight: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 12.5,
                color: COLORS.textSecondary,
              }}
            >
              No jobs found.
            </Typography>
          </Box>
        )}

        {!loading && !error && jobs.length > 0 && (
          <>
            <JobTable
              jobs={jobs}
              onView={handleViewJob}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                px: 2.5,
                py: 1.8,
                borderTop: "1px solid #ECEEF4",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10.5,
                  color: COLORS.textSecondary,
                }}
              >
                Showing {page * PAGE_SIZE + 1}–
                {Math.min((page + 1) * PAGE_SIZE, totalElements)} of{" "}
                {totalElements}
              </Typography>

              <Pagination
                page={page + 1}
                count={totalPages}
                onChange={(_, value) => setPage(value - 1)}
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11.5,
                    minWidth: 30,
                    height: 30,
                    borderRadius: "9px",
                    color: "#747991",
                  },

                  "& .Mui-selected": {
                    background: `${COLORS.primary} !important`,
                    color: "#FFFFFF",
                  },

                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: COLORS.primaryLight,
                  },
                }}
              />
            </Box>
          </>
        )}
      </Paper>

      <FormDialog
        open={jobDialogOpen}
        title={selectedJob ? "Edit Job" : "Add Job"}
        onClose={handleCloseJobDialog}
        maxWidth="sm"
      >
        <JobForm
          job={selectedJob}
          onSuccess={handleJobSuccess}
          onCancel={handleCloseJobDialog}
        />
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        itemName={selectedJob?.jobTitle}
        confirmText="Delete Job"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default Jobs;
