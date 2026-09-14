import { Box, TextField, Typography } from "@mui/material";

import type { Employee } from "../../types/employee";
import type { TaskStatus } from "../../types/task";

import FilterBar from "../common/FilterBar";
import FilterSelect from "../common/FilterSelect";

import { filterFieldSx } from "../common/filterStyles";

interface TaskAssignmentFiltersProps {
  statusFilter: TaskStatus | "";
  employeeFilter: number | "";

  employees: Employee[];

  dueFrom: string;
  dueTo: string;

  hasActiveFilters: boolean;

  onStatusChange: (value: TaskStatus | "") => void;
  onEmployeeChange: (value: number | "") => void;

  onDueFromChange: (value: string) => void;
  onDueToChange: (value: string) => void;

  onClear: () => void;
}

const STATUS_OPTIONS: {
  value: TaskStatus;
  label: string;
}[] = [
  {
    value: "ASSIGNED",
    label: "Assigned",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
];

const dateFieldSx = {
  ...filterFieldSx,

  width: {
    xs: "100%",
    sm: 150,
  },

  "& .MuiInputBase-root": {
    height: 44,
  },

  "& input": {
    fontFamily: "Poppins, sans-serif",
    fontSize: 12,
    color: "#292D38",
  },

  "& input::-webkit-calendar-picker-indicator": {
    cursor: "pointer",
    opacity: 0.7,
  },
};

const filterLabelSx = {
  fontFamily: "Poppins, sans-serif",
  fontSize: 10.5,
  fontWeight: 500,
  color: "#7B8190",
  whiteSpace: "nowrap",
};

const TaskAssignmentFilters = ({
  statusFilter,
  employeeFilter,
  employees,
  dueFrom,
  dueTo,
  hasActiveFilters,
  onStatusChange,
  onEmployeeChange,
  onDueFromChange,
  onDueToChange,
  onClear,
}: TaskAssignmentFiltersProps) => {
  return (
    <FilterBar showClear={hasActiveFilters} onClear={onClear}>
     

      <FilterSelect
        value={statusFilter}
        onChange={(value) => {
          onStatusChange(value as TaskStatus | "");
        }}
        placeholder="Status"
        width={145}
        options={STATUS_OPTIONS}
      />

   

      <FilterSelect
        value={employeeFilter === "" ? "" : employeeFilter}
        onChange={(value) => {
          onEmployeeChange(value === "" ? "" : Number(value));
        }}
        placeholder="Employee"
        width={175}
        options={employees.map((employee) => ({
          value: employee.employeeId,
          label: `${employee.firstName} ${employee.lastName}`,
        }))}
      />

     

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.8,
        }}
      >
        <Typography sx={filterLabelSx}>Due From</Typography>

        <TextField
          type="date"
          value={dueFrom}
          onChange={(e) => onDueFromChange(e.target.value)}
          size="small"
          sx={dateFieldSx}
        />
      </Box>

    

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.8,
        }}
      >
        <Typography sx={filterLabelSx}>Due To</Typography>

        <TextField
          type="date"
          value={dueTo}
          onChange={(e) => onDueToChange(e.target.value)}
          size="small"
          sx={dateFieldSx}
        />
      </Box>
    </FilterBar>
  );
};

export default TaskAssignmentFilters;
