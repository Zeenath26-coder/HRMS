import { useState } from "react";

import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  SearchRounded,
  NotificationsNoneRounded,
  KeyboardArrowDownRounded,
  PersonOutlineRounded,
  SettingsOutlined,
  LogoutRounded,
  TaskAltRounded,
  CloseRounded,
  MenuRounded,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPageMeta } from "../../config/pageMeta";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();

  const location = useLocation();
  const { title, subtitle } = getPageMeta(location.pathname);

  const { user, logOut } = useAuth();

  const [search, setSearch] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleNotificationToggle = () => {
    setNotificationOpen((previous) => !previous);
    setProfileOpen(false);
  };

  const handleProfileToggle = () => {
    setProfileOpen((previous) => !previous);
    setNotificationOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() || "US";

  return (
    <Box
      component="header"
      sx={{
        minHeight: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        px: {
          xs: 1,
          md: 1.5,
        },
        borderRadius: "18px",
        backgroundColor: "transparent",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          minWidth: 0,
        }}
      >
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },
            width: 40,
            height: 40,
            borderRadius: "12px",
            color: "#707686",
            flexShrink: 0,
          }}
        >
          <MenuRounded />
        </IconButton>

        <Box>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: 20, md: 24 },
              fontWeight: 600,
              letterSpacing: "-0.5px",
              color: "#252837",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                mt: 0.3,
                fontFamily: "Poppins, sans-serif",
                fontSize: 11.5,
                color: "#9297A5",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",

          gap: {
            xs: 0.5,
            md: 1,
          },
        }}
      >
        <ClickAwayListener onClickAway={() => setNotificationOpen(false)}>
          <Box sx={{ position: "relative" }}>
            <Tooltip title="Notifications">
              <IconButton
                onClick={handleNotificationToggle}
                sx={{
                  width: 42,
                  height: 42,

                  borderRadius: "13px",

                  color: notificationOpen ? "#5965E8" : "#707686",

                  backgroundColor: notificationOpen ? "#EEF0FF" : "transparent",

                  "&:hover": {
                    backgroundColor: "#ffffffa2",
                  },
                }}
              >
                <Badge
                  variant="dot"
                  sx={{
                    "& .MuiBadge-badge": {
                      width: 7,
                      height: 7,

                      minWidth: 7,

                      right: 2,
                      top: 3,

                      backgroundColor: "#EF4444",

                      boxShadow: "0 0 0 2px #F7F8FC",
                    },
                  }}
                >
                  <NotificationsNoneRounded
                    sx={{
                      fontSize: 23,
                    }}
                  />
                </Badge>
              </IconButton>
            </Tooltip>

            {notificationOpen && (
              <Paper
                elevation={0}
                sx={{
                  position: "absolute",

                  top: 52,
                  right: 0,

                  width: {
                    xs: 290,
                    sm: 340,
                  },

                  borderRadius: "18px",

                  border: "1px solid #E8EAF0",

                  backgroundColor: "#FFFFFF",

                  boxShadow: "0 18px 45px rgba(30,35,50,0.12)",

                  overflow: "hidden",

                  zIndex: 20,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                    px: 2,

                    py: 1.8,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",

                        fontSize: 14,

                        fontWeight: 600,

                        color: "#202330",
                      }}
                    >
                      Notifications
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.25,

                        fontFamily: "Poppins, sans-serif",

                        fontSize: 10.5,

                        color: "#969AA6",
                      }}
                    >
                      You have new updates
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",

                      fontSize: 10,

                      fontWeight: 600,

                      color: "#5965E8",

                      cursor: "pointer",

                      "&:hover": {
                        color: "#4338CA",
                      },
                    }}
                  >
                    Mark all read
                  </Typography>
                </Box>

                <Divider />

                <Box
                  sx={{
                    display: "flex",

                    gap: 1.2,

                    px: 2,
                    py: 1.6,

                    cursor: "pointer",

                    "&:hover": {
                      backgroundColor: "#F8F8FC",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,

                      flexShrink: 0,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      borderRadius: "10px",

                      color: "#5965E8",

                      backgroundColor: "#EEF0FF",
                    }}
                  >
                    <PersonOutlineRounded sx={{ fontSize: 18 }} />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",

                        fontSize: 11.5,

                        fontWeight: 600,

                        color: "#292D38",
                      }}
                    >
                      New employee added
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.3,

                        fontFamily: "Poppins, sans-serif",

                        fontSize: 10,

                        color: "#969AA6",
                      }}
                    >
                      A new employee was added to the organization.
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,

                        fontFamily: "Poppins, sans-serif",

                        fontSize: 9.5,

                        color: "#A5A8B2",
                      }}
                    >
                      5 minutes ago
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",

                    gap: 1.2,

                    px: 2,
                    py: 1.6,

                    cursor: "pointer",

                    "&:hover": {
                      backgroundColor: "#F8F8FC",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,

                      flexShrink: 0,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      borderRadius: "10px",

                      color: "#D97706",

                      backgroundColor: "#FFF5DD",
                    }}
                  >
                    <TaskAltRounded sx={{ fontSize: 18 }} />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",

                        fontSize: 11.5,

                        fontWeight: 600,

                        color: "#292D38",
                      }}
                    >
                      Task requires attention
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.3,

                        fontFamily: "Poppins, sans-serif",

                        fontSize: 10,

                        color: "#969AA6",
                      }}
                    >
                      A task is approaching its deadline.
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,

                        fontFamily: "Poppins, sans-serif",

                        fontSize: 9.5,

                        color: "#A5A8B2",
                      }}
                    >
                      1 hour ago
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box
                  sx={{
                    py: 1.4,
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#F8F8FC",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#5965E8",
                    }}
                  >
                    View all notifications
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </ClickAwayListener>

        <Box
          sx={{
            width: "1px",
            height: 30,
            backgroundColor: "#E4E6EC",
            mx: 0.5,
          }}
        />

        <ClickAwayListener onClickAway={() => setProfileOpen(false)}>
          <Box sx={{ position: "relative" }}>
            <Box
              component="button"
              type="button"
              onClick={() => {
                setProfileOpen((previous) => !previous);
                setNotificationOpen(false);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: "none",
                outline: "none",
                cursor: "pointer",
                px: 1.25,
                py: 0.75,
                borderRadius: "13px",
                backgroundColor: profileOpen ? "#ffffff90" : "transparent",
                fontFamily: "Poppins, sans-serif",
                "&:hover": {
                  backgroundColor: "#ffffffa2",
                },
                "&:focus-visible": {
                  boxShadow: "0 0 0 2px #C7CBFF",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: "#E9E7FF",
                  color: "#4F46E5",
                }}
              >
                {initials}
              </Avatar>

              <Box
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                  textAlign: "left",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#292D38",
                    lineHeight: 1.2,
                  }}
                >
                  {user?.username}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 10,
                    color: "#969AA6",
                    mt: 0.25,
                    textTransform: "capitalize",
                  }}
                >
                  {user?.role?.toLowerCase()}
                </Typography>
              </Box>

              <KeyboardArrowDownRounded
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },

                  fontSize: 19,
                  color: "#969AA6",
                  transition: "transform 0.2s ease",
                  transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </Box>

            {profileOpen && (
              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 230,
                  borderRadius: "15px",
                  border: "1px solid #E8EAF0",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 18px 45px rgba(30,35,50,0.12)",
                  overflow: "hidden",
                  zIndex: 9999,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    px: 1.8,
                    py: 1.7,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      backgroundColor: "#E9E7FF",
                      color: "#4F46E5",
                    }}
                  >
                    {initials}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#292D38",
                      }}
                    >
                      {user?.username}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.2,
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 9.5,
                        color: "#969AA6",
                        textTransform: "capitalize",
                      }}
                    >
                      {user?.role?.toLowerCase()}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    px: 1.8,
                    py: 1.3,
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11.5,
                    color: "#4B5060",
                    "&:hover": {
                      backgroundColor: "#F7F7FC",
                    },
                  }}
                >
                  <PersonOutlineRounded
                    sx={{
                      fontSize: 19,
                      color: "#7C8190",
                    }}
                  />
                  My Profile
                </Box>

                <Divider />

                <Box
                  onClick={handleLogout}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    px: 1.8,
                    py: 1.3,
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: "#DC2626",
                    "&:hover": {
                      backgroundColor: "#FEF2F2",
                    },
                  }}
                >
                  <LogoutRounded
                    sx={{
                      fontSize: 19,
                    }}
                  />
                  Sign out
                </Box>
              </Paper>
            )}
          </Box>
        </ClickAwayListener>
      </Box>
    </Box>
  );
};

export default Header;
