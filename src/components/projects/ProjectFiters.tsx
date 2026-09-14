import { MenuItem, TextField } from "@mui/material";

import type { Manager } from "../../types/manager";

import FilterBar from "../common/FilterBar";

import { filterFieldSx, menuItemSx } from "../common/filterStyles";

interface ProjectFiltersProps {
  managerFilter: number | "";
  managers: Manager[];

  hasActiveFilters: boolean;

  onManagerChange: (value: number | "") => void;
  onClear: () => void;
}

const ProjectFilters = ({
  managerFilter,
  managers,
  hasActiveFilters,
  onManagerChange,
  onClear,
}: ProjectFiltersProps) => {
  return (
    <FilterBar showClear={hasActiveFilters} onClear={onClear}>
      <TextField
        select
        value={managerFilter}
        onChange={(e) =>
          onManagerChange(e.target.value === "" ? "" : Number(e.target.value))
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
        <MenuItem value="" sx={menuItemSx}>
          Manager
        </MenuItem>

        {managers.map((manager) => (
          <MenuItem key={manager.userId} value={manager.userId} sx={menuItemSx}>
            {manager.username}
          </MenuItem>
        ))}
      </TextField>
    </FilterBar>
  );
};

export default ProjectFilters;
