import { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

import {
  Add01Icon,
  Delete02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { toast } from "sonner";

import type { Project } from "../../types/project";

import { removeEmployeeFromProject } from "../../api/projectApi";

import { UserAvatar } from "../common/UserAvatar";
import TableActionMenu from "../common/TableActionMenu";
import ConfirmDialog from "../common/ConfirmDialog";

import {
  tablePrimaryTextSx,
  tableSecondaryTextSx,
} from "../common/tableStyles";

import { COLORS, TYPOGRAPHY } from "../../theme/designToken";

interface ProjectTeamProps {
  project: Project;
  canManage: boolean;
  onAddEmployee: () => void;
  onSuccess: () => void | Promise<void>;
}

const ProjectTeam = ({
  project,
  onAddEmployee,
  onSuccess,
  canManage,
}: ProjectTeamProps) => {
  const employeeIds = project.employeeIds ?? [];
  const employeeNames = project.employeeNames ?? [];

  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState<number | null>(null);

  const [selectedEmployeeName, setSelectedEmployeeName] =
    useState("");

  const [removing, setRemoving] = useState(false);

  const handleOpenRemoveDialog = (
    employeeId: number,
    employeeName: string,
  ) => {
    setSelectedEmployeeId(employeeId);
    setSelectedEmployeeName(employeeName);
    setRemoveDialogOpen(true);
  };

  const handleCloseRemoveDialog = () => {
    if (removing) return;

    setRemoveDialogOpen(false);
    setSelectedEmployeeId(null);
    setSelectedEmployeeName("");
  };

  const handleConfirmRemove = async () => {
    if (selectedEmployeeId === null) return;

    try {
      setRemoving(true);

      await removeEmployeeFromProject(
        project.projectId,
        selectedEmployeeId,
      );

      toast.success("Employee removed from project");

      setRemoveDialogOpen(false);
      setSelectedEmployeeId(null);
      setSelectedEmployeeName("");

      await onSuccess();
    } catch (error: any) {
      console.error(
        "Failed to remove employee from project:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to remove employee from project.",
      );
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          mt: 2,
          border: "1px solid #ECEEF3",
          borderRadius: "14px",
          backgroundColor: COLORS.white,
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, md: 2.5 },
            "&:last-child": {
              pb: { xs: 2, md: 2.5 },
            },
          }}
        >
          
          <Box
            sx={{
              display: "flex",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              justifyContent: "space-between",
              gap: 2,
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              mb: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: TYPOGRAPHY.fontFamily,
                  fontSize: 14,
                  fontWeight: 600,
                  color: COLORS.text,
                }}
              >
                Project Team
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontFamily: TYPOGRAPHY.fontFamily,
                  fontSize: 10.5,
                  color: COLORS.textSecondary,
                }}
              >
                {employeeNames.length}{" "}
                {employeeNames.length === 1
                  ? "team member"
                  : "team members"}
              </Typography>
            </Box>

{canManage && (
            <Button
              startIcon={
                <HugeiconsIcon
                  icon={Add01Icon}
                  size={16}
                />
              }
              onClick={onAddEmployee}
              sx={{
                height: 36,
                px: 1.8,
                borderRadius: "9px",
                backgroundColor: COLORS.primary,
                color: COLORS.white,
                textTransform: "none",
                fontFamily: TYPOGRAPHY.fontFamily,
                fontSize: 11.5,
                fontWeight: 600,

                "&:hover": {
                  backgroundColor: COLORS.primaryDark,
                },
              }}
            >
              Add Employee
            </Button>
)}
          </Box>

          
          {employeeNames.length === 0 ? (
            <Box
              sx={{
                py: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <HugeiconsIcon
                icon={UserIcon}
                size={24}
                color="#9BA0B5"
              />

              <Typography
                sx={{
                  fontFamily: TYPOGRAPHY.fontFamily,
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.text,
                }}
              >
                No team members
              </Typography>

              <Typography
                sx={{
                  fontFamily: TYPOGRAPHY.fontFamily,
                  fontSize: 10.5,
                  color: COLORS.textSecondary,
                }}
              >
                Add employees to this project.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                border: "1px solid #ECEEF3",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {employeeNames.map((name, index) => {
                const employeeId = employeeIds[index];

                const nameParts = name.split(" ");

                const firstName = nameParts[0] || "";

                const lastName = nameParts
                  .slice(1)
                  .join(" ");

                return (
                  <Box key={employeeId}>
                    <Box
                      sx={{
                        px: 2,
                        py: 1.4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.3,
                          minWidth: 0,
                        }}
                      >
                        <UserAvatar
                          firstName={firstName}
                          lastName={lastName}
                          size={36}
                        />

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={tablePrimaryTextSx}
                          >
                            {name}
                          </Typography>

                          <Typography
                            sx={tableSecondaryTextSx}
                          >
                            EMP-{employeeId}
                          </Typography>
                        </Box>
                      </Box>

{canManage && (
                      <TableActionMenu
                        actions={[
                          {
                            label: "Remove Employee",
                            icon: Delete02Icon,
                            danger: true,
                            onClick: () =>
                              handleOpenRemoveDialog(
                                employeeId,
                                name,
                              ),
                          },
                        ]}
                      />
)}
                    </Box>

                    {index <
                      employeeNames.length - 1 && (
                      <Divider />
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={removeDialogOpen}
        title="Remove Employee"
        message="Are you sure you want to remove this employee from the project?"
        itemName={selectedEmployeeName}
        confirmText="Remove Employee"
        cancelText="Cancel"
        loading={removing}
        onConfirm={handleConfirmRemove}
        onCancel={handleCloseRemoveDialog}
      />
    </>
  );
};

export default ProjectTeam;