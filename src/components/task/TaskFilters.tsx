import type { Project } from "../../types/project";

import FilterBar from "../common/FilterBar";
import FilterSelect from "../common/FilterSelect";

interface TaskFiltersProps {
  projectFilter: number | "";
  projects: Project[];
  hasActiveFilters: boolean;

  onProjectChange: (
    value: number | "",
  ) => void;
  onClear: () => void;
}

const TaskFilters = ({
  projectFilter,
  projects,
  hasActiveFilters,
  onProjectChange,
  onClear,
}: TaskFiltersProps) => {
  return (
    <FilterBar
      showClear={hasActiveFilters}
      onClear={onClear}
    >
      <FilterSelect
        value={
          projectFilter === ""
            ? ""
            : projectFilter
        }
        onChange={(value) => {
          onProjectChange(
            value === ""
              ? ""
              : Number(value),
          );
        }}
        placeholder="Project"
        width={170}
        options={projects.map((project) => ({
          value: project.projectId,
          label: project.projectName,
        }))}
      />
    </FilterBar>
  );
};

export default TaskFilters;