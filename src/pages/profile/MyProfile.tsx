import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";

import {
  UserIcon,
  Mail01Icon,
  Call02Icon,
  Building03Icon,
  Briefcase01Icon,
  Calendar03Icon,
  Shield01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { getCurrentUser } from "../../api/authApi";
import type { CurrentUser } from "../../api/authApi";

import DetailsCard from "../../components/common/DetailsCard";
import { UserAvatar } from "../../components/common/UserAvatar";

import { formatDate } from "../../utils/formatters";

const MyProfile = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 13,
            color: "#7A7F9A",
          }}
        >
          Loading profile...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 13,
            color: "#7A7F9A",
          }}
        >
          Unable to load profile information.
        </Typography>
      </Box>
    );
  }

  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || user.username;

  const roleLabel =
    user.role.charAt(0) +
    user.role.slice(1).toLowerCase();

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 2.5 },
        backgroundColor: "#eef2ff36",
        minHeight: "100%",
      }}
    >
     

      <Card
        elevation={0}
        sx={{
          border: "1px solid #ECEEF3",
          borderRadius: "14px",
          backgroundColor: "#FFFFFF",
          mb: 2,
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
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
         

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <UserAvatar
                firstName={user.firstName || user.username}
                lastName={user.lastName || ""}
              />

              <Box>
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#20234A",
                  }}
                >
                  {fullName}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11.5,
                    color: "#7A7F9A",
                  }}
                >
                  @{user.username}
                </Typography>
              </Box>
            </Box>

         

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={
                  <HugeiconsIcon
                    icon={Shield01Icon}
                    size={14}
                  />
                }
                label={roleLabel}
                sx={{
                  height: 30,
                  borderRadius: "8px",
                  backgroundColor: "#EEF0FF",
                  color: "#4F46E5",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,

                  "& .MuiChip-icon": {
                    color: "#4F46E5",
                  },
                }}
              />

              <Chip
                icon={
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={14}
                  />
                }
                label={user.active ? "Active" : "Inactive"}
                sx={{
                  height: 30,
                  borderRadius: "8px",
                  backgroundColor: user.active
                    ? "#ECFDF5"
                    : "#FEF2F2",
                  color: user.active
                    ? "#047857"
                    : "#DC2626",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,

                  "& .MuiChip-icon": {
                    color: user.active
                      ? "#047857"
                      : "#DC2626",
                  },
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

     

      <Grid container spacing={2}>

      
        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Personal Information"
            items={[
              {
                label: "Full Name",
                value: fullName,
                icon: UserIcon,
              },
              {
                label: "Email Address",
                value: user.email || "Not available",
                icon: Mail01Icon,
              },
              {
                label: "Phone Number",
                value: user.phoneNumber || "Not available",
                icon: Call02Icon,
              },
            ]}
          />
        </Grid>

      

        <Grid size={{ xs: 12, md: 6 }}>
          <DetailsCard
            title="Employment Information"
            items={[
              {
                label: "Employee ID",
                value:
                  user.employeeId !== null
                    ? `EMP-${user.employeeId}`
                    : "Not linked",
                icon: UserIcon,
              },
              {
                label: "Department",
                value:
                  user.department || "Not assigned",
                icon: Building03Icon,
              },
              {
                label: "Job Position",
                value:
                  user.jobPosition || "Not assigned",
                icon: Briefcase01Icon,
              },
              {
                label: "Join Date",
                value: formatDate(user.joinDate),
                icon: Calendar03Icon,
              },
            ]}
          />
        </Grid>

      

        <Grid size={{ xs: 12 }}>
          <DetailsCard
            title="Account Information"
            items={[
              {
                label: "Username",
                value: user.username,
                icon: UserIcon,
              },
              {
                label: "Role",
                value: roleLabel,
                icon: Shield01Icon,
              },
              {
                label: "Account Status",
                value: user.active
                  ? "Active"
                  : "Inactive",
                icon: CheckmarkCircle02Icon,
              },
            ]}
          />
        </Grid>

      </Grid>
    </Box>
  );
};

export default MyProfile;