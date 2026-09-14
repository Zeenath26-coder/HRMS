import type { ReactNode } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import loginBackground from "../../assets/hbg1.jpg";
import logo from "../../assets/logo.png";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
}

const AuthCard = ({ title, subtitle, children, footer, onBack }: AuthCardProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100dvh",
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        backgroundImage: `url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        px: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: { xs: "100%", sm: "430px" },
          p: { xs: 3, sm: 4.5, md: 5 },
          borderRadius: { xs: "22px", sm: "28px" },
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.8)",
          boxShadow: "0 12px 40px rgba(71,65,120,0.16)",
        }}
      >
        {onBack && (
          <IconButton
            onClick={onBack}
            size="small"
            sx={{
              mb: 1,
              ml: -1,
              color: "#64748B",
              "&:hover": { color: "#4F46E5", background: "rgba(79,70,229,0.06)" },
            }}
          >
            <ArrowBackRoundedIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        )}

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box
            component="img"
            src={logo}
            alt="HRMS logo"
            sx={{
              width: { xs: 125, sm: 140 },
              height: "auto",
              maxHeight: 55,
              objectFit: "contain",
              objectPosition: "left center",
              display: "block",
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: { xs: "29px", sm: "33px" },
            fontWeight: 750,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            color: "#1E1B4B",
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              mt: 1.2,
              mb: 4,
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#64748B",
              maxWidth: "340px",
            }}
          >
            {subtitle}
          </Typography>
        )}

        {children}
        {footer}
      </Box>

      <Typography
        sx={{
          position: "absolute",
          bottom: { xs: 12, sm: 18, md: 22 },
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "10px",
          color: "rgba(71,85,105,0.65)",
          zIndex: 2,
        }}
      >
        © 2026 HRMS · All rights reserved
      </Typography>
    </Box>
  );
};

export default AuthCard;