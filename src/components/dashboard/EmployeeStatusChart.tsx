import { Box, Card, CardContent, Typography } from "@mui/material";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface EmployeeStatusChartProps {
  data: {
    active: number;
    resigned: number;
    terminated: number;
    retired: number;
  };
}

const EmployeeStatusChart = ({ data }: EmployeeStatusChartProps) => {
  const chartData = [
    {
      name: "Active",
      value: data.active,
      color: "#635BFF",
    },
    {
      name: "Resigned",
      value: data.resigned,
      color: "#F5A623",
    },
    {
      name: "Terminated",
      value: data.terminated,
      color: "#F05A67",
    },
    {
      name: "Retired",
      value: data.retired,
      color: "#94A3B8",
    },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid #E8EAF0",
        backgroundColor: "#FFFFFF",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#171923",
            }}
          >
            Employee Status
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: "0.8rem",
              color: "#8A8F9C",
            }}
          >
            Current workforce distribution
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: 220,
              height: 220,
              position: "relative",
              flexShrink: 0,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={88}
                  paddingAngle={4}
                  stroke="none"
                  cornerRadius={8}
                  isAnimationActive
                >
                  {chartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E8EAF0",
                    boxShadow: "0 8px 24px rgba(23, 25, 35, 0.08)",
                    fontSize: "0.8rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                pointerEvents: "none",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: 600,
                  lineHeight: 1,
                  color: "#171923",
                }}
              >
                {total}
              </Typography>

              <Typography
                sx={{
                  mt: 0.7,
                  fontSize: "0.7rem",
                  color: "#8A8F9C",
                }}
              >
                Total Employees
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: 190,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {chartData.map((item) => {
              const percentage =
                total > 0 ? Math.round((item.value / total) * 100) : 0;

              return (
                <Box
                  key={item.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: item.color,
                        boxShadow: `0 0 0 3px ${item.color}15`,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "#555B6E",
                        fontWeight: 500,
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: "#171923",
                      }}
                    >
                      {item.value}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        color: "#9AA0AE",
                        minWidth: 32,
                        textAlign: "right",
                      }}
                    >
                      {percentage}%
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmployeeStatusChart;
