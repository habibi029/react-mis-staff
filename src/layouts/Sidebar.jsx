import { useState } from "react";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import { Box, IconButton, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { tokens } from "../theme";

const Sidebar = ({ isSidebarOpen, isMobile, toggleSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();

  const menuItemStyles = {
    button: {
      backgroundColor: colors.primary[400],
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "light"
            ? colors.primary[900]
            : colors.primary[500],
      },
    },
    activeButton: {
      borderLeft: `4px solid`,
    },
  };

  const isActiveRoute = (route) => location.pathname === route;

  return (
    <ProSidebar
      backgroundColor={colors.primary[400]}
      collapsed={!isSidebarOpen}
      width={isMobile ? "100%" : "250px"}
      collapsedWidth={isMobile ? "0px" : "80px"}
      style={{
        height: "100%",
        position: isMobile ? "fixed" : "relative",
        left: isMobile && !isSidebarOpen ? "-100%" : "0",
        transition: "all 0.3s",
        borderRight: "none",
        zIndex: isMobile ? 1000 : 1,
      }}
    >
      <Box
        backgroundColor={colors.primary[400]}
        mb={2}
        sx={{
          p: 2,
          display: "flex",
          alignItems: !isMobile ? "center" : "flex-start",
          justifyContent: !isMobile ? "center" : "flex-start",
        }}
      >
        {isSidebarOpen && !isMobile ? (
          <img
            style={{ width: "150px", height: "auto" }}
            src="/gym-republic-logo.png"
            alt="Logo"
            onClick={toggleSidebar}
          />
        ) : (
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>
      <Menu iconShape="square" menuItemStyles={menuItemStyles}>
        <MenuItem
          icon={<DashboardIcon />}
          component={<Link to="/dashboard" />}
          style={isActiveRoute("/dashboard") ? menuItemStyles.activeButton : {}}
          onClick={isMobile ? toggleSidebar : null}
        >
          Dashboard
        </MenuItem>
        <SubMenu icon={<PeopleIcon />} label="Customers">
          <MenuItem
            component={<Link to="/customers" />}
            style={
              isActiveRoute("/customers") ? menuItemStyles.activeButton : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Customer List
          </MenuItem>
          <MenuItem
            component={<Link to="/customers/subscriptions" />}
            style={
              isActiveRoute("/customers/subscriptions")
                ? menuItemStyles.activeButton
                : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Subscriptions
          </MenuItem>
        </SubMenu>
        <MenuItem
          component={<Link to="/attendance" />}
          style={
            isActiveRoute("/attendance") ? menuItemStyles.activeButton : {}
          }
          onClick={isMobile ? toggleSidebar : null}
          icon={<BadgeIcon />}
        >
          Employee Attendance
        </MenuItem>
        <MenuItem
          icon={<FitnessCenterIcon />}
          component={<Link to="/subscriptions" />}
          style={
            isActiveRoute("/subscriptions") ? menuItemStyles.activeButton : {}
          }
          onClick={isMobile ? toggleSidebar : null}
        >
          Subscriptions
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;
