import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

const COLLAPSED_WIDTH = 76;
const EXPANDED_WIDTH = 250;
const CONTENT_GAP = 28;

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  const [mobileSidebarOpen , setMobileSidebarOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 15% 10%, rgba(99,102,241,0.10), transparent 30%)," +
          "radial-gradient(circle at 85% 20%, rgba(139,92,246,0.08), transparent 28%)," +
          "radial-gradient(circle at 70% 90%, rgba(59,130,246,0.06), transparent 30%)," +
          "#F7F8FC",
      }}
    >
      <Box sx={{ display: {
        xs: "none",
        md: "block",
      },}}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </Box>
      <Box
        sx={{
          minHeight: "100vh",
          ml: {
            xs: 0,
            md: `${sidebarWidth + 28}px`,
          },
          width: {
            xs: "100%",
            md: `calc(100% - ${sidebarWidth + CONTENT_GAP}px)`,
          },

          boxSizing: "border-box",

          transition: "margin-left 0.25s ease, width 0.25s ease",
          px: {
            xs: 1.5,
            sm: 2.5,
            md: 3,
          },
          py: {
            xs: 1.5,
            md: 2.5,
          },
          minWidth: 0,
        }}
      >
        <Header onMenuClick={() =>
            setMobileSidebarOpen(true)
          } />
        <Box
          component="main"
          sx={{ mt: { xs: 2.5, md: 4 }, width: "100%", minWidth: 0 }}
        >
          <Outlet />
        </Box>
      </Box>
      {mobileSidebarOpen && (
        <Sidebar
        collapsed={false}
        setCollapsed={setCollapsed}
        mobile
        open={mobileSidebarOpen}
        onClose={()=> setMobileSidebarOpen(false)
        }
      />
      )}
    </Box>
  );
};
