import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { clearSession, getUserName } from "../../utils/cookies";
// import NHUISLogo from "../../../src/assets/images/NHUIS-Logo.gif";
// import { CookieNames, getCookieItem } from "../../utils/cookies";
import { Menu, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import JwtTokenHandler from "../jwtTokenHandler/JwtTokenHandler";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useNavigate } from "react-router-dom";
import { getGreeting } from "../../helpers/utils";

const drawerWidth = 240;

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Header() {
  const navigate = useNavigate();

  // let userDetails = null;
  // if (getCookieItem(CookieNames.USER)) {
  //   userDetails = JSON.parse(getCookieItem(CookieNames.USER));
  // }

  const theme = useTheme();

  const [userAnchorEl, setUserAnchorEl] = useState(null);

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setUserAnchorEl(null);
  };

  const handleLogout = () => {
    clearSession();
    window.close();
  };

  const handleDrawerOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleNavigation = (page) => {
    setAnchorEl(null);
    setOpen(false);
    navigate(page);
  };

  return (
    <>
      <Box
        boxSizing="border-box"
        height={{ xs: "45px" }}
        sx={{
          backgroundColor: "#183084",
          // position: "fixed",
          zIndex: "999",
          // top: 0,
        }}
        width="100%"
        alignItems="center"
      >
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignItems={"center"}
          height={"inherit"}
        >
          <Stack
            direction="row"
            marginLeft={2}
            spacing={3}
            alignItems="center"
            height="100%"
          >
            <IconButton
              size="small"
              // sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ color: "#fff", mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Stack>
              <Typography color="white" fontSize={"2rem"}>
                RESEA
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} alignItems={"center"}>
            <Typography color="white"> {getGreeting(getUserName())}</Typography>
            <IconButton
              color="inherit"
              onClick={handleOpenMenu}
              style={{ padding: "0" }}
            >
              <Avatar
                // {...stringAvatar(userDetails?.userName)}
                style={{
                  width: "28px",
                  height: "28px",
                  fontSize: "0.8rem",
                  margin: "0 10px",
                }}
              />
            </IconButton>
          </Stack>
          {/* {userDetails && ( */}

          {/* )} */}
        </Stack>
      </Box>
      <Menu
        anchorEl={userAnchorEl}
        open={Boolean(userAnchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <JwtTokenHandler onLogout={handleLogout} />

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleDrawerClose}
        // onClick={handleDrawerClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 15,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <SimpleTreeView>
          <TreeItem itemId="home" label="Home">
            <TreeItem
              itemId="dashboard"
              label="Dashboard"
              onClick={() => handleNavigation("dashboard")}
            />
            <TreeItem
              itemId="reminders"
              label="Reminders"
              onClick={() => handleNavigation("reminders")}
            />
            <TreeItem
              itemId="workSchedule"
              label="Work Schedule"
              onClick={() => handleNavigation("workSchedule")}
            />
            <TreeItem
              itemId="preferences"
              label="Preferences"
              onClick={() => handleNavigation("preferences")}
            />
          </TreeItem>
          <TreeItem itemId="cases" label="Cases">
            <TreeItem
              itemId="cases-dashboard"
              label="Dashboard"
              onClick={() => handleNavigation("cases-dashboard")}
            />
            <TreeItem
              itemId="cases-reminders"
              label="Reminders"
              onClick={() => handleNavigation("cases-reminders")}
            />
            <TreeItem
              itemId="cases-workSchedule"
              label="Work Schedule"
              onClick={() => handleNavigation("cases-workSchedule")}
            />
          </TreeItem>
          <TreeItem itemId="appointments" label="Appointments">
            <TreeItem
              itemId="appointments-appointments"
              label="Appointments"
              onClick={() => handleNavigation("appointments-appointments")}
            />
          </TreeItem>
          <TreeItem itemId="reports" label="Reports">
            <TreeItem
              itemId="reports-reports"
              label="Reports"
              onClick={() => handleNavigation("reports-reports")}
            />
          </TreeItem>
        </SimpleTreeView>
      </Menu>
      {/* <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="top"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["Dashboard", "Remainders", "Work Schedule", "Preferences"].map(
            (text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer> */}
    </>
  );
}
