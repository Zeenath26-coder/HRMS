import { Box, Pagination, Typography } from "@mui/material";

import { COLORS } from "../../theme/designToken";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const TablePagination = ({
  page,
  totalPages,
  totalElements,
  pageSize,
  onChange,
}: TablePaginationProps) => {
  const start =
    totalElements === 0
      ? 0
      : page * pageSize + 1;

  const end = Math.min(
    (page + 1) * pageSize,
    totalElements,
  );

  return (
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
        Showing {start}–{end} of {totalElements}
      </Typography>

      <Pagination
        page={page + 1}
        count={totalPages}
        onChange={(_, value) => onChange(value - 1)}
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
            boxShadow: "0 4px 10px rgba(91, 92, 235, 0.22)",
          },

          "& .MuiPaginationItem-root:hover": {
            backgroundColor: COLORS.primaryLight,
          },
        }}
      />
    </Box>
  );
};

export default TablePagination;