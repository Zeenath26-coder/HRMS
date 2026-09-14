import { useMemo, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";

import {
  Search01Icon,
  UserAdd01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import type { Employee } from "../../types/employee";

import { assignEmployeeToProject } from "../../api/projectApi";

import SearchField from "../common/SearchField";
import FormDialog from "../common/FormDialog";

import { COLORS, TYPOGRAPHY } from "../../theme/designToken";
import { primaryButtonSx, secondaryButtonSx } from "../common/formStyles";

interface AddProjectEmployeeDialogProps {
  open: boolean;
  projectId: number;
  employees: Employee[];
  assignedEmployeeIds: number[];
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

const AddProjectEmployeeDialog = ({
  open,
  projectId,
  employees,
  assignedEmployeeIds,
  onClose,
  onSuccess,
}: AddProjectEmployeeDialogProps) => {
  const [search, setSearch] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const [submitting, setSubmitting] = useState(false);

  const availableEmployees = useMemo(() => {
    return employees.filter(
      (employee) => !assignedEmployeeIds.includes(employee.employeeId),
    );
  }, [employees, assignedEmployeeIds]);

  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return availableEmployees;
    }

    return availableEmployees.filter((employee) => {
      const fullName =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();

      return (
        fullName.includes(keyword) ||
        employee.email?.toLowerCase().includes(keyword) ||
        employee.jobTitle?.toLowerCase().includes(keyword) ||
        employee.departmentName?.toLowerCase().includes(keyword)
      );
    });
  }, [availableEmployees, search]);

  const handleClose = () => {
    if (submitting) return;

    setSearch("");
    setSelectedEmployee(null);
    onClose();
  };

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleAddEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      setSubmitting(true);

      await assignEmployeeToProject(projectId, selectedEmployee.employeeId);

      toast.success("Employee added to project");

      setSearch("");
      setSelectedEmployee(null);

      await onSuccess();

      onClose();
    } catch (error: any) {
      console.error("Failed to assign employee:", error);

      toast.error(
        error?.response?.data?.message || "Unable to add employee to project.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormDialog
      open={open}
      title="Add Employee to Project"
      onClose={handleClose}
      maxWidth="sm"
    >
      <Box sx={{ width: "100%" }}>
       
        <Typography
          sx={{
            mb: 2.2,
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: 11,
            color: COLORS.textSecondary,
          }}
        >
          Select an employee to add to this project team.
        </Typography>

       
        <SearchField
          value={search}
          onChange={(value) => {
            setSearch(value);
            setSelectedEmployee(null);
          }}
          placeholder="Search employees..."
        />

        <Box
          sx={{
            mt: 1.5,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "12px",
            overflow: "hidden",
            maxHeight: 300,
            overflowY: "auto",

            "&::-webkit-scrollbar": {
              width: 5,
            },

            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#D9DCE8",
              borderRadius: 10,
            },
          }}
        >
          {filteredEmployees.length === 0 ? (
            <Box
              sx={{
                py: 5,
                px: 2,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: TYPOGRAPHY.fontFamily,
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.text,
                }}
              >
                No employees found
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontFamily: TYPOGRAPHY.fontFamily,
                  fontSize: 10.5,
                  color: COLORS.textSecondary,
                }}
              >
                Try another employee name.
              </Typography>
            </Box>
          ) : (
            filteredEmployees.map((employee) => {
              const selected =
                selectedEmployee?.employeeId === employee.employeeId;

              return (
                <Box
                  key={employee.employeeId}
                  onClick={() => handleSelectEmployee(employee)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.3,
                    px: 1.5,
                    py: 1.2,
                    cursor: "pointer",

                    backgroundColor: selected
                      ? COLORS.primaryLight
                      : COLORS.white,

                    borderBottom: `1px solid ${COLORS.border}`,

                    "&:last-child": {
                      borderBottom: "none",
                    },

                    "&:hover": {
                      backgroundColor: COLORS.primaryLight,
                    },
                  }}
                >
                 
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      backgroundColor: "#E9E7FF",
                      color: COLORS.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,

                      fontFamily: TYPOGRAPHY.fontFamily,
                      fontSize: 10.5,
                      fontWeight: 600,
                    }}
                  >
                    {employee.firstName?.charAt(0)}
                    {employee.lastName?.charAt(0)}
                  </Box>

                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: TYPOGRAPHY.fontFamily,
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: COLORS.text,
                      }}
                    >
                      {employee.firstName} {employee.lastName}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.2,
                        fontFamily: TYPOGRAPHY.fontFamily,
                        fontSize: 10,
                        color: COLORS.textSecondary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {employee.jobTitle || "Employee"}

                      {employee.departmentName
                        ? ` • ${employee.departmentName}`
                        : ""}
                    </Typography>
                  </Box>

                  {selected && (
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        backgroundColor: COLORS.primary,
                        mr: 0.5,
                      }}
                    />
                  )}
                </Box>
              );
            })
          )}
        </Box>

       
        {selectedEmployee && (
          <Box
            sx={{
              mt: 1.5,
              px: 1.4,
              py: 1,
              borderRadius: "10px",
              backgroundColor: COLORS.primaryLight,
              display: "flex",
              alignItems: "center",
              gap: 0.8,
            }}
          >
            <HugeiconsIcon
              icon={UserAdd01Icon}
              size={15}
              color={COLORS.primary}
            />

            <Typography
              sx={{
                fontFamily: TYPOGRAPHY.fontFamily,
                fontSize: 10.5,
                color: COLORS.textSecondary,
              }}
            >
              Selected:
              <Box
                component="span"
                sx={{
                  ml: 0.5,
                  fontWeight: 600,
                  color: COLORS.primary,
                }}
              >
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </Box>
            </Typography>
          </Box>
        )}

      
        <Divider
          sx={{
            mt: 2.5,
            mb: 2,
            borderColor: COLORS.border,
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.2,
          }}
        >
          <Button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            startIcon={<HugeiconsIcon icon={Cancel01Icon} size={16} />}
            sx={secondaryButtonSx}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleAddEmployee}
            disabled={!selectedEmployee || submitting}
            startIcon={
              submitting ? (
                <CircularProgress
                  size={15}
                  thickness={3}
                  sx={{ color: "#FFFFFF" }}
                />
              ) : (
                <HugeiconsIcon icon={UserAdd01Icon} size={16} />
              )
            }
            sx={primaryButtonSx}
          >
            {submitting ? "Adding..." : "Add Employee"}
          </Button>
        </Box>
      </Box>
    </FormDialog>
  );
};

export default AddProjectEmployeeDialog;
