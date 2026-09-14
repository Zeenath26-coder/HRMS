import { MenuItem, TextField } from "@mui/material";

import type { Department } from "../../types/department";
import type { Job } from "../../types/jobdesc";
import type { EmployeeStatus } from "../../types/employee";

import FilterBar from "../common/FilterBar";

import {
  filterFieldSx,
  menuItemSx,
} from "../common/filterStyles";

interface EmployeeFiltersProps {
  statusFilter: EmployeeStatus | "";
  departmentFilter: number | "";
  jobFilter: number | "";

  departments: Department[];
  jobs: Job[];

  hasActiveFilters: boolean;

  onStatusChange: (value: EmployeeStatus | "") => void;
  onDepartmentChange: (value: number | "") => void;
  onJobChange: (value: number | "") => void;

  onClear: () => void;
}

const STATUS_OPTIONS: EmployeeStatus[] = [
  "ACTIVE",
  "RESIGNED",
  "TERMINATED",
  "RETIRED",
];

const EmployeeFilters = ({
  statusFilter,
  departmentFilter,
  jobFilter,
  departments,
  jobs,
  hasActiveFilters,
  onStatusChange,
  onDepartmentChange,
  onJobChange,
  onClear,
}: EmployeeFiltersProps) => {
  return (
    <FilterBar
      showClear={hasActiveFilters}
      onClear={onClear}
    >
      
      <TextField
        select
        value={statusFilter}
        onChange={(e) =>
          onStatusChange(
            e.target.value as EmployeeStatus | "",
          )
        }
        sx={{
          ...filterFieldSx,
          width: {
            xs: "100%",
            sm: 140,
          },
        }}
        slotProps={{
          select: {
            displayEmpty: true,
          },
        }}
      >
        <MenuItem value="" sx={menuItemSx}>
          Status
        </MenuItem>

        {STATUS_OPTIONS.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={menuItemSx}
          >
            {option.charAt(0) +
              option.slice(1).toLowerCase()}
          </MenuItem>
        ))}
      </TextField>

     
      <TextField
        select
        value={departmentFilter}
        onChange={(e) =>
          onDepartmentChange(
            e.target.value === ""
              ? ""
              : Number(e.target.value),
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
        <MenuItem value="" sx={menuItemSx}>
          Department
        </MenuItem>

        {departments.map((department) => (
          <MenuItem
            key={department.deptId}
            value={department.deptId}
            sx={menuItemSx}
          >
            {department.deptName}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        value={jobFilter}
        onChange={(e) =>
          onJobChange(
            e.target.value === ""
              ? ""
              : Number(e.target.value),
          )
        }
        sx={{
          ...filterFieldSx,
          width: {
            xs: "100%",
            sm: 170,
          },
        }}
        slotProps={{
          select: {
            displayEmpty: true,
          },
        }}
      >
        <MenuItem value="" sx={menuItemSx}>
          Job Position
        </MenuItem>

        {jobs.map((job) => (
          <MenuItem
            key={job.jobId}
            value={job.jobId}
            sx={menuItemSx}
          >
            {job.jobTitle}
          </MenuItem>
        ))}
      </TextField>
    </FilterBar>
  );
};

export default EmployeeFilters;