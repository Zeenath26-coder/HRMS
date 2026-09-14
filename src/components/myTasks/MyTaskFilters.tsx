import { MenuItem, TextField } from "@mui/material";

import type { TaskStatus } from "../../types/task";

import FilterBar from "../common/FilterBar";

import {
  filterFieldSx,
  menuItemSx,
} from "../common/filterStyles";

interface MyTaskFiltersProps {
  statusFilter: TaskStatus | "";
  hasActiveFilters: boolean;

  onStatusChange: (
    value: TaskStatus | "",
  ) => void;

  onClear: () => void;
}

const STATUS_OPTIONS: TaskStatus[] = [
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
];

const MyTaskFilters = ({
  statusFilter,
  hasActiveFilters,
  onStatusChange,
  onClear,
}: MyTaskFiltersProps) => {
  return (
    <FilterBar
      showClear={hasActiveFilters}
      onClear={onClear}
    >
      <TextField
        select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(
            event.target.value as TaskStatus | "",
          )
        }
        sx={{
          ...filterFieldSx,
          width: {
            xs: "100%",
            sm: 160,
          },
        }}
        slotProps={{
          select: {
            displayEmpty: true,
          },
        }}
      >
        <MenuItem
          value=""
          sx={menuItemSx}
        >
          Status
        </MenuItem>

        {STATUS_OPTIONS.map((status) => (
          <MenuItem
            key={status}
            value={status}
            sx={menuItemSx}
          >
            {status
              .replace("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (char) =>
                char.toUpperCase(),
              )}
          </MenuItem>
        ))}
      </TextField>
    </FilterBar>
  );
};

export default MyTaskFilters;