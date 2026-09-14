import { ArrowDownwardRounded, ArrowUpwardRounded } from "@mui/icons-material";

import { Box, Paper, Typography } from "@mui/material";

import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;

  accentColor: string;
  iconBackground: string;

  trend?: {
    value: string;
    positive: boolean;
  };
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  accentColor,
  iconBackground,
  trend,
}: StatCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: 175,
        p: 2.5,
        borderRadius: "20px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E9EBF1",
        boxShadow: "0 4px 16px rgba(30, 35, 50, 0.04)",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: `${accentColor}35`,
          boxShadow: "0 12px 28px rgba(30, 35, 50, 0.08)",
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: 130,
          height: 130,
          right: -60,
          bottom: -70,
          borderRadius: "50%",
          backgroundColor: `${accentColor}14`,
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "15px",
              border: `1px solid ${accentColor}18`,
              color: accentColor,
              backgroundColor: iconBackground,
              "& svg": {
                fontSize: 24,
              },
            }}
          >
            {icon}
          </Box>

        </Box>

        <Typography
          sx={{
            mt: 2.2,
            fontSize: "12px",
            fontWeight: 500,
            color: "#858A99",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.35,
            fontSize: {
              xs: "27px",
              sm: "30px",
            },
            lineHeight: 1.15,
            fontWeight: 750,
            letterSpacing: "-0.8px",
            color: "#202330",
          }}
        >
          {value}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1,
          }}
        >
          {trend && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.25,
                px: 0.7,
                py: 0.35,
                borderRadius: "7px",
                fontSize: "10px",
                fontWeight: 600,
                color: trend.positive ? "#047857" : "#DC2626",

                backgroundColor: trend.positive ? "#ECFDF5" : "#FEF2F2",
              }}
            >
              {trend.positive ? (
                <ArrowUpwardRounded sx={{ fontSize: 12 }} />
              ) : (
                <ArrowDownwardRounded sx={{ fontSize: 12 }} />
              )}

              {trend.value}
            </Box>
          )}

          {subtitle && (
            <Typography
              sx={{
                fontSize: "10.5px",
                color: "#A0A4AF",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default StatCard;
