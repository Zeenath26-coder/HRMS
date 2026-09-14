import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import { Folder01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { getRecentProjects, type RecentProject } from "../../api/dashboardApi";
import { useNavigate } from "react-router-dom";

const RecentProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getRecentProjects();

        const recentProjects = data
          .filter((project) => project.createdDate)
          .slice(0, 5);

        setProjects(recentProjects);
      } catch (error) {
        console.error("Failed to fetch recent projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid #E8EAF0",
        boxShadow: "none",
        backgroundColor: "#FFFFFF",
      }}
    >
      <CardContent
        sx={{
          p: 3,
          "&:last-child": {
            pb: 3,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 600,
                color: "#101828",
                letterSpacing: "-0.2px",
              }}
            >
              Recent Projects
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13,
                fontWeight: 400,
                color: "#8A9099",
              }}
            >
              Recently created projects
            </Typography>
          </Box>

          <Box
            onClick={() => navigate("/projects")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.4,
              cursor: "pointer",
              color: "#6C4CF1",
              transition: "all 0.2s ease",

              "&:hover": {
                color: "#5736D9",
                transform: "translateX(2px)",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              View all
            </Typography>

            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
          </Box>
        </Box>

        {loading ? (
          <Box
            sx={{
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              size={25}
              thickness={4}
              sx={{
                color: "#6C4CF1",
              }}
            />
          </Box>
        ) : projects.length === 0 ? (
          <Box
            sx={{
              minHeight: 250,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                backgroundColor: "#F1EDFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
              }}
            >
              <HugeiconsIcon
                icon={Folder01Icon}
                size={22}
                color="#6C4CF1"
                strokeWidth={1.8}
              />
            </Box>

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "#344054",
              }}
            >
              No recent projects
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "#98A2B3",
                mt: 0.5,
              }}
            >
              New projects will appear here
            </Typography>
          </Box>
        ) : (
          <Stack>
            {projects.map((project, index) => (
              <Box
                key={project.projectId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  minHeight: 78,
                  py: 1.3,
                  px: 1,
                  borderBottom:
                    index !== projects.length - 1
                      ? "1px solid #F0F1F5"
                      : "none",
                  borderRadius: 2,
                  transition: "all 0.2s ease",

                  "&:hover": {
                    backgroundColor: "#FAF9FF",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: 2.5,
                    backgroundColor: "#F0ECFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HugeiconsIcon
                    icon={Folder01Icon}
                    size={20}
                    color="#6C4CF1"
                    strokeWidth={1.8}
                  />
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 650,
                      color: "#101828",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.projectName}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.45,
                      fontSize: 12,
                      color: "#8A9099",
                    }}
                  >
                    {formatDate(project.createdDate)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flexShrink: 0,
                    px: 1.25,
                    py: 0.65,
                    borderRadius: "999px",
                    backgroundColor: "#F5F6F8",
                    border: "1px solid #ECEEF2",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: "#667085",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.employeeCount}{" "}
                    {project.employeeCount === 1 ? "Employee" : "Employees"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProjects;
