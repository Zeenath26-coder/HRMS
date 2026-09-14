import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  DashboardSquare01Icon,
  UserGroupIcon,
  Building03Icon,
  Briefcase01Icon,
  Folder01Icon,
  Task01Icon,
  TaskEdit01Icon,
  ClipboardIcon,
  UserSettings01Icon,
  Logout01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { useLocation, useNavigate } from "react-router-dom";

import tribexLogo from "../../assets/tribex-mark.png";

import { useAuth } from "../../context/AuthContext";
import type { Role } from "../../api/authApi";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;

  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: Role[];
}

const COLORS = {
  primary: "#5B55E8",
  primaryDark: "#4D47D8",
  primaryLight: "#F1F0FF",
  primaryLightHover: "#EAE8FF",

  text: "#20233A",
  textSecondary: "#6F7387",
  textMuted: "#9A9EAE",

  background: "#FFFFFF",
  backgroundSoft: "#FBFAFF",

  border: "#ECEBF4",
  borderSoft: "#F1F0F6",

  hover: "#F7F6FC",

  danger: "#DC5B68",
  dangerBackground: "#FFF3F5",
};

const mainMenuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: (
      <HugeiconsIcon icon={DashboardSquare01Icon} size={20} strokeWidth={1.8} />
    ),
    path: "/dashboard",
    roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },

  {
    label: "Employees",
    icon: <HugeiconsIcon icon={UserGroupIcon} size={20} strokeWidth={1.8} />,
    path: "/employees",
    roles: ["ADMIN", "HR"],
  },

  {
    label: "Users",
    icon: (
      <HugeiconsIcon icon={UserSettings01Icon} size={20} strokeWidth={1.8} />
    ),
    path: "/users",
    roles: ["ADMIN"],
  },

  {
    label: "Departments",
    icon: <HugeiconsIcon icon={Building03Icon} size={20} strokeWidth={1.8} />,
    path: "/departments",
    roles: ["ADMIN", "HR"],
  },

  {
    label: "Job Positions",
    icon: <HugeiconsIcon icon={Briefcase01Icon} size={20} strokeWidth={1.8} />,
    path: "/jobs",
    roles: ["ADMIN", "HR"],
  },

  {
    label: "Projects",
    icon: <HugeiconsIcon icon={Folder01Icon} size={20} strokeWidth={1.8} />,
    path: "/projects",
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },

  {
    label: "Tasks",
    icon: <HugeiconsIcon icon={Task01Icon} size={20} strokeWidth={1.8} />,
    path: "/tasks",
    roles: ["ADMIN", "MANAGER"],
  },

  {
    label: "Task Assignments",
    icon: <HugeiconsIcon icon={TaskEdit01Icon} size={20} strokeWidth={1.8} />,
    path: "/task-assignments",
    roles: ["ADMIN", "MANAGER"],
  },

  {
    label: "My Tasks",
    icon: <HugeiconsIcon icon={ClipboardIcon} size={20} strokeWidth={1.8} />,
    path: "/my-tasks",
    roles: ["EMPLOYEE"],
  },
];

const Sidebar = ({
  collapsed,
  setCollapsed,
  mobile = false,
  open = false,
  onClose,
}: SidebarProps) => {
  const { user, logOut } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const isCollapsed = mobile ? false : collapsed;

  //role based menu
  const visibleMainMenuItems = mainMenuItems.filter((item) =>
    user ? item.roles.includes(user.role) : false,
  );

  const getInitials = (username?: string) => {
    if (!username) {
      return "?";
    }

    return username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);

    if (mobile) {
      onClose?.();
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } finally {
      navigate("/login");

      if (mobile) {
        onClose?.();
      }
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const active = isActive(item.path);

    const button = (
      <ListItemButton
        onClick={() => handleNavigation(item.path)}
        sx={{
          minHeight: 46,
          mb: 0.5,
          px: 1.5,
          borderRadius: "13px",
          justifyContent: isCollapsed ? "center" : "flex-start",
          color: active ? COLORS.primary : COLORS.textSecondary,
          background: active
            ? `linear-gradient(
                135deg,
                ${COLORS.primaryLight} 0%,
                #ECEBFF 100%
              )`
            : "transparent",
          border: active
            ? "1px solid rgba(91, 85, 232, 0.07)"
            : "1px solid transparent",
          boxShadow: active ? "0 4px 14px rgba(91, 85, 232, 0.07)" : "none",
          transition:
            "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            background: active
              ? `linear-gradient(
                  135deg,
                  ${COLORS.primaryLightHover} 0%,
                  #E8E6FF 100%
                )`
              : COLORS.hover,
            color: COLORS.primary,
          },
          "&:active": {
            transform: "scale(0.99)",
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: isCollapsed ? 0 : 1.5,
            justifyContent: "center",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            transition: "color 0.2s ease",
          }}
        >
          {item.icon}
        </ListItemIcon>

        {!isCollapsed && (
          <ListItemText
            primary={item.label}
            slotProps={{
              primary: {
                sx: {
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  whiteSpace: "nowrap",
                  color: "inherit",
                  letterSpacing: "-0.05px",
                },
              },
            }}
          />
        )}
      </ListItemButton>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={item.path} title={item.label} placement="right" arrow>
          {button}
        </Tooltip>
      );
    }

    return <Box key={item.path}>{button}</Box>;
  };

  const sidebarContent = (
    <>
      <Box
        sx={{
          height: 68,
          px: mobile ? 1.75 : collapsed ? 1.25 : 1.75,
          display: "flex",
          alignItems: "center",
          justifyContent: mobile || !collapsed ? "flex-start" : "center",
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={tribexLogo}
          alt="Tribex"
          sx={{
            width: mobile ? 38 : collapsed ? 36 : 38,
            height: mobile ? 38 : collapsed ? 36 : 38,
            objectFit: "contain",
            display: "block",
          }}
        />
      </Box>

      {!mobile && (
        <IconButton
          onClick={() => setCollapsed((previous) => !previous)}
          sx={{
            position: "absolute",
            right: -14,
            top: 50,
            width: 28,
            height: 28,
            background: "#FFFFFF",
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 3px 12px rgba(52, 45, 105, 0.10)",
            "&:hover": {
              background: COLORS.primaryLight,
              borderColor: "rgba(91, 85, 232, 0.15)",
            },
          }}
        >
          <HugeiconsIcon
            icon={collapsed ? ArrowRight01Icon : ArrowLeft01Icon}
            size={16}
            strokeWidth={2}
            color={COLORS.textSecondary}
          />
        </IconButton>
      )}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: mobile ? 1.25 : collapsed ? 0.9 : 1.25,
          py: 2.25,
          "&::-webkit-scrollbar": {
            width: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#E8E7F0",
            borderRadius: 10,
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
        }}
      >
        <List disablePadding>{visibleMainMenuItems.map(renderMenuItem)}</List>
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${COLORS.borderSoft}`,
          p: mobile ? 1.1 : collapsed ? 0.9 : 1.1,
        }}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            borderRadius: "12px",
            px: mobile ? 1.1 : collapsed ? 1 : 1.1,
            justifyContent: mobile || !collapsed ? "flex-start" : "center",
            "&:hover": {
              backgroundColor: COLORS.hover,
            },
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #F0EFFF 0%, #E7E5FF 100%)",
              color: COLORS.primary,
              fontSize: 10.5,
              fontWeight: 600,
              flexShrink: 0,
              border: "1px solid rgba(91, 85, 232, 0.06)",
            }}
          >
            {getInitials(user?.username)}
          </Box>

          {(mobile || !collapsed) && (
            <Box
              sx={{
                ml: 1.2,
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: COLORS.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.username}
              </Typography>

              <Typography
                sx={{
                  fontSize: 10.5,
                  color: COLORS.textMuted,
                  mt: 0.2,
                }}
              >
                {user?.role}
              </Typography>
            </Box>
          )}
        </ListItemButton>

        {isCollapsed ? (
          <Tooltip title="Logout" placement="right" arrow>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 42,
                mt: 0.4,
                borderRadius: "11px",
                justifyContent: "center",
                color: COLORS.textMuted,
                "&:hover": {
                  backgroundColor: COLORS.dangerBackground,
                  color: COLORS.danger,
                },
              }}
            >
              <HugeiconsIcon icon={Logout01Icon} size={19} strokeWidth={1.8} />
            </ListItemButton>
          </Tooltip>
        ) : (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 42,
              mt: 0.4,
              borderRadius: "11px",
              color: COLORS.textMuted,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: COLORS.dangerBackground,
                color: COLORS.danger,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            >
              <HugeiconsIcon icon={Logout01Icon} size={19} strokeWidth={1.8} />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              slotProps={{
                primary: {
                  sx: {
                    fontSize: 12.5,
                    fontWeight: 500,
                  },
                },
              }}
            />
          </ListItemButton>
        )}
      </Box>
    </>
  );

  if (mobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        slotProps={{
          root: {
            keepMounted: true,
          },
          paper: {
            sx: {
              width: 248,
              background: COLORS.background,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "0 18px 18px 0",
              boxShadow: "0 10px 35px rgba(52, 45, 105, 0.12)",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {sidebarContent}
        </Box>
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        left: 18,
        top: 18,
        bottom: 18,
        width: collapsed ? 72 : 248,
        background: COLORS.background,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "18px",
        boxShadow: "0 10px 35px rgba(52, 45, 105, 0.06)",
        display: "flex",
        flexDirection: "column",
        overflow: "visible",
        zIndex: 1200,
        transition: "width 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          boxShadow: "0 12px 40px rgba(52, 45, 105, 0.08)",
        },
      }}
    >
      {sidebarContent}
    </Box>
  );
};

export default Sidebar;
