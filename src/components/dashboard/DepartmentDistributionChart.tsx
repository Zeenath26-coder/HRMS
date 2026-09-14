import { Box, Card, CardContent, Typography } from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DepartmentDistributionChartProps {
  data: {
    department: string;
    employeeCount: number;
  }[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    payload: {
      department: string;
      employeeCount: number;
    };
  }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const department = payload[0].payload.department;
  const employeeCount = payload[0].value;

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E8EAF0",
        borderRadius: "12px",
        px: 1.75,
        py: 1.25,
        boxShadow: "0 8px 24px rgba(23, 25, 35, 0.10)",
        minWidth: 140,
      }}
    >
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 500,
          color: "#8A8F9C",
          mb: 0.4,
        }}
      >
        Department
      </Typography>

      <Typography
        sx={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#171923",
          mb: 0.8,
        }}
      >
        {department}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#5B5FEF",
            lineHeight: 1,
          }}
        >
          {employeeCount}
        </Typography>

        <Typography
          sx={{
            fontSize: "11px",
            color: "#8A8F9C",
          }}
        >
          Employees
        </Typography>
      </Box>
    </Box>
  );
};

const DepartmentDistributionChart = ({
  data,
}: DepartmentDistributionChartProps) => {
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
      <CardContent
        sx={{
          p: 3,
          "&:last-child": {
            pb: 3,
          },
        }}
      >
       
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#171923",
            }}
          >
            Department Distribution
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: "0.8rem",
              color: "#8A8F9C",
            }}
          >
            Employees across departments
          </Typography>
        </Box>

     
        <Box
          sx={{
            width: "100%",
            height: 260,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 0,
                right: 20,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#EEF0F4"
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#8A8F9C",
                }}
              />

              <YAxis
                type="category"
                dataKey="department"
                axisLine={false}
                tickLine={false}
                width={90}
                tick={{
                  fontSize: 11,
                  fill: "#555B6E",
                }}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "rgba(91, 95, 239, 0.04)",
                }}
              />

              <Bar
                dataKey="employeeCount"
                fill="#6366F1"
                radius={[0, 7, 7, 0]}
                barSize={19}
                activeBar={{
                  fill: "#4F46E5",
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DepartmentDistributionChart;
