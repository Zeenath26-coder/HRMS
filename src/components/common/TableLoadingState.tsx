import { Box, CircularProgress, Typography } from "@mui/material";

interface TableLoadingStateProps {
  message?: string;
}

const TableLoadingState = ({
  message = "Loading...",
}: TableLoadingStateProps) => {
  return (
    <Box
      sx={{
        py: 7,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        size={25}
        thickness={4}
        sx={{
          color: "#5965E8",
        }}
      />

      <Typography
        sx={{
          mt: 1.5,
          fontFamily: "Poppins, sans-serif",
          fontSize: 11,
          color: "#969AA6",
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default TableLoadingState;