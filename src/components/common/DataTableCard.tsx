import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";

import { type ReactNode } from "react";

import { COLORS } from "../../theme/designToken";

interface DataTableCardProps {
  loading: boolean;
  error?: string;
  empty: boolean;
  emptyMessage?: string;
  children: ReactNode;
}

const DataTableCard = ({
  loading,
  error,
  empty,
  emptyMessage = "No records found.",
  children,
}: DataTableCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: 350,
        borderRadius: "16px",
        border: "1px solid #E7E8F0",
        backgroundColor: COLORS.white,
        overflow: "hidden",
        boxShadow: "0 4px 18px rgba(48, 52, 110, 0.035)",
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

      {!loading && !error && empty && (
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
            {emptyMessage}
          </Typography>
        </Box>
      )}

      {!loading && !error && !empty && children}
    </Paper>
  );
};

export default DataTableCard;
