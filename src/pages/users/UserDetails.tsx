import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import {
  ArrowLeft01Icon,
  Edit02Icon,
  UserIcon,
  UserAccountIcon,
  Shield01Icon,
  IdIcon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { getUserById } from "../../api/userApi";

import type { User } from "../../types/user";

import DetailsCard from "../../components/common/DetailsCard";
import FormDialog from "../../components/common/FormDialog";

import UserEditForm from "../../components/users/UserEditForm";

import { primaryButtonSx } from "../../components/common/formStyles";

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [editDialogOpen, setEditDialogOpen] =
    useState(false);

 
  const loadUser = useCallback(
    async () => {
      if (!id) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getUserById(Number(id));

        setUser(data);
      } catch (err) {
        console.error(
          "Failed to load user:",
          err,
        );

        setError(
          "Failed to load user details.",
        );
      } finally {
        setLoading(false);
      }
    },
    [id],
  );

 
  useEffect(() => {
    loadUser();
  }, [loadUser]);

 
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={28}
          sx={{
            color: "#5965E8",
          }}
        />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || "User not found."}
        </Alert>

        <Button
          startIcon={
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={17}
            />
          }
          onClick={() =>
            navigate("/users")
          }
          sx={{
            mt: 2,
            textTransform: "none",
            fontFamily:
              "Poppins, sans-serif",
            fontSize: 12,
            color: "#5965E8",
          }}
        >
          Back to Users
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: {
          xs: 2,
          md: 3,
        },
        py: {
          xs: 2,
          md: 2.5,
        },
        backgroundColor:
          "#eef2ff36",
        minHeight: "100%",
      }}
    >
      

      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent:
            "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Button
            onClick={() =>
              navigate("/users")
            }
            startIcon={
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={16}
              />
            }
            sx={{
              p: 0,
              mb: 2,
              minWidth: 0,
              fontFamily:
                "Poppins, sans-serif",
              fontSize: 10.5,
              fontWeight: 500,
              color: "#858A98",
              textTransform: "none",

              "&:hover": {
                backgroundColor:
                  "transparent",
                color: "#5965E8",
              },
            }}
          >
            Back to Users
          </Button>

          <Typography
            sx={{
              fontFamily:
                "Poppins, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: "#292D38",
              lineHeight: 1.3,
            }}
          >
            User Details
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <HugeiconsIcon
              icon={Edit02Icon}
              size={16}
            />
          }
          onClick={() =>
            setEditDialogOpen(true)
          }
          sx={primaryButtonSx}
        >
          Edit User
        </Button>
      </Box>

    

      <Card
        elevation={0}
        sx={{
          border:
            "1px solid #ECEEF3",
          borderRadius: "14px",
          backgroundColor:
            "#FFFFFF",
          mb: 2,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 2.5,
            },

            "&:last-child": {
              pb: {
                xs: 2,
                md: 2.5,
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
           

            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  "#EEF0FF",
                color: "#5965E8",
              }}
            >
              <HugeiconsIcon
                icon={UserIcon}
                size={28}
              />
            </Box>

           

            <Box>
              <Typography
                sx={{
                  fontFamily:
                    "Poppins, sans-serif",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "#292D38",
                }}
              >
                {user.username}
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontFamily:
                    "Poppins, sans-serif",
                  fontSize: 11,
                  color: "#7B8190",
                }}
              >
                USER-{user.userId}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      

      <Grid
        container
        spacing={2}
      >
        

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <DetailsCard
            title="Account Information"
            items={[
              {
                label: "Username",
                value:
                  user.username,
                icon: UserAccountIcon,
              },
              {
                label: "User ID",
                value: `USER-${user.userId}`,
                icon: IdIcon,
              },
              {
                label: "Role",
                value:
                  formatRole(
                    user.role,
                  ),
                icon: Shield01Icon,
              },
            ]}
          />
        </Grid>

      

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <DetailsCard
            title="Employee Information"
            items={[
              {
                label: "Employee ID",
                value:
                  user.employeeId
                    ? `EMP-${user.employeeId}`
                    : "-",
                icon: UserIcon,
              },
            ]}
          />
        </Grid>
      </Grid>

    

      <FormDialog
        open={editDialogOpen}
        title="Edit User"
        onClose={() =>
          setEditDialogOpen(false)
        }
        maxWidth="sm"
      >
        <UserEditForm
          user={user}
          onSuccess={async () => {
            setEditDialogOpen(false);

            await loadUser();
          }}
          onCancel={() =>
            setEditDialogOpen(false)
          }
        />
      </FormDialog>
    </Box>
  );
};


const formatRole = (
  role: User["role"],
) => {
  switch (role) {
    case "ADMIN":
      return "Admin";

    case "HR":
      return "HR";

    case "MANAGER":
      return "Manager";

    case "EMPLOYEE":
      return "Employee";

    default:
      return role;
  }
};

export default UserDetails;