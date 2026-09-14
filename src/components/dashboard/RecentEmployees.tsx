import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import { ArrowRight01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  getRecentEmployees,
  type RecentEmployee,
} from "../../api/dashboardApi";
import { useNavigate } from "react-router-dom";

const RecentEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<RecentEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sortedEmployees = [...employees].sort(
    (a, b) => b.employeeId - a.employeeId,
  );

  useEffect(() => {
    const fetchRecentEmployees = async () => {
      try {
        const data = await getRecentEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch recent employees:", error);
        setError("Unable to load recent employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEmployees();
  }, []);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: RecentEmployee["status"]) => {
    switch (status) {
      case "ACTIVE":
        return {
          background: "#ECFDF3",
          color: "#027A48",
          dot: "#12B76A",
        };

      case "RESIGNED":
        return {
          background: "#FFF7E8",
          color: "#B54708",
          dot: "#F79009",
        };

      case "TERMINATED":
        return {
          background: "#FEF3F2",
          color: "#B42318",
          dot: "#F04438",
        };

      default:
        return {
          background: "#F2F4F7",
          color: "#475467",
          dot: "#98A2B3",
        };
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: "20px",
        border: "1px solid #EAECF0",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 18px rgba(16, 24, 40, 0.03)",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2.2, sm: 2.8 },
          "&:last-child": {
            pb: { xs: 2.2, sm: 2.8 },
          },
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 600,
                color: "#101828",
                letterSpacing: "-0.2px",
              }}
            >
              Recent Employees
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                fontSize: "12.5px",
                color: "#667085",
              }}
            >
              Recently joined employees
            </Typography>
          </Box>

          <Box
            onClick={() => navigate("/employees")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.3,
              color: "#6941C6",
              cursor: "pointer",
              px: 1,
              py: 0.6,
              borderRadius: "8px",
              transition: "all 0.2s ease",

              "&:hover": {
                backgroundColor: "#F4F1FF",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "12.5px",
                fontWeight: 600,
              }}
            >
              View all
            </Typography>

            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={15}
              strokeWidth={1.8}
            />
          </Box>
        </Stack>

        {loading && (
          <Box
            sx={{
              height: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              size={26}
              thickness={4}
              sx={{
                color: "#635BFF",
              }}
            />
          </Box>
        )}

        {!loading && error && (
          <Box
            sx={{
              py: 5,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                color: "#B42318",
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        {!loading && !error && employees.length === 0 && (
          <Box
            sx={{
              py: 5,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                color: "#667085",
              }}
            >
              No recent employees found.
            </Typography>
          </Box>
        )}

        {!loading && !error && employees.length > 0 && (
          <Stack>
            {sortedEmployees.map((employee, index) => {
              const status = getStatusStyle(employee.status);

              return (
                <Box
                  key={employee.employeeId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    minHeight: 66,
                    py: 1.2,
                    px: 1,
                    borderRadius: "12px",

                    borderBottom:
                      index !== employees.length - 1
                        ? "1px solid #F2F4F7"
                        : "none",

                    transition:
                      "background-color 0.2s ease, transform 0.2s ease",

                    "&:hover": {
                      backgroundColor: "#FAF9FF",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                      borderRadius: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #F1EDFF 0%, #E8E2FF 100%)",
                      border: "1px solid #E4DEFF",
                      color: "#6941C6",
                    }}
                  >
                    {employee.firstName && employee.lastName ? (
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.2px",
                        }}
                      >
                        {getInitials(employee.firstName, employee.lastName)}
                      </Typography>
                    ) : (
                      <HugeiconsIcon
                        icon={UserIcon}
                        size={19}
                        strokeWidth={1.7}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13.5px",
                        fontWeight: 650,
                        color: "#101828",
                        lineHeight: 1.4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {employee.firstName} {employee.lastName}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.7,
                        mt: 0.35,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "11.5px",
                          color: "#667085",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {employee.department}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      display: { xs: "none", sm: "block" },
                      minWidth: 82,
                      textAlign: "right",
                      fontSize: "11.5px",
                      color: "#667085",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(employee.joinDate)}
                  </Typography>

                  <Box
                    sx={{
                      minWidth: 66,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.6,
                        px: 1.05,
                        py: 0.55,
                        borderRadius: "999px",
                        backgroundColor: status.background,
                      }}
                    >
                      <Box
                        sx={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          backgroundColor: status.dot,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: status.color,
                          letterSpacing: "0.2px",
                        }}
                      >
                        {employee.status}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentEmployees;
