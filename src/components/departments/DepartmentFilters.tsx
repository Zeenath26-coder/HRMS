import FilterBar from "../common/FilterBar";
import FilterSelect from "../common/FilterSelect";

type ManagerFilter =
  | "ALL"
  | "WITH_MANAGER"
  | "WITHOUT_MANAGER";

interface DepartmentFiltersProps {
  managerFilter: ManagerFilter;
  hasActiveFilters: boolean;
  onManagerChange: (value: ManagerFilter) => void;
  onClear: () => void;
}

const DepartmentFilters = ({
  managerFilter,
  hasActiveFilters,
  onManagerChange,
  onClear,
}: DepartmentFiltersProps) => {
  return (
    <FilterBar
      showClear={hasActiveFilters}
      onClear={onClear}
    >
      <FilterSelect
        value={
          managerFilter === "ALL"
            ? ""
            : managerFilter
        }
        onChange={(value) => {
          onManagerChange(
            value === ""
              ? "ALL"
              : (value as
                  | "WITH_MANAGER"
                  | "WITHOUT_MANAGER"),
          );
        }}
        placeholder="All Departments"
        width={160}
        options={[
          {
            value: "WITH_MANAGER",
            label: "With Manager",
          },
          {
            value: "WITHOUT_MANAGER",
            label: "Without Manager",
          },
        ]}
      />
    </FilterBar>
  );
};

export default DepartmentFilters;