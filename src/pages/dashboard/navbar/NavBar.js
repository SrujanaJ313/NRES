import React, { useState, useCallback } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/system";

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  minWidth: 100,
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: "rgba(0, 0, 0, 0.7)",
  margin: 0,
  borderRight: "2px solid #000",
  backgroundColor: "#dcebf7",
  "&.Mui-selected": {
    color: "#1976d2",
    backgroundColor: "#c9eefe",
    fontWeight: theme.typography.fontWeightBold,
  },
  "&:hover": {
    color: "#40a9ff",
    opacity: 1,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);

const NavBar = () => {
  const [outerTab, setOuterTab] = useState(0);
  const [innerTab, setInnerTab] = useState(0);

  const handleOuterTabChange = useCallback((event, newValue) => {
    setOuterTab(newValue);
  }, []);

  const handleInnerTabChange = useCallback((event, newValue) => {
    setInnerTab(newValue);
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000" }}>
      <Toolbar disableGutters>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container>
            <Grid xs={2}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  backgroundColor: "#012160",
                  color: "#fff",
                  px: 3,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                RESEA
              </Typography>
            </Grid>
            <Grid xs={8}>
              <Box sx={{ backgroundColor: "#0c76a0" }}>
                <Tabs
                  value={outerTab}
                  onChange={handleOuterTabChange}
                  aria-label="outer tabs"
                >
                  <StyledTab label="Home" />
                </Tabs>
                <TabPanel value={outerTab} index={0}>
                  <Tabs
                    value={innerTab}
                    onChange={handleInnerTabChange}
                    aria-label="inner tabs"
                  >
                    <StyledTab label="Dashboard" />
                    <StyledTab label="Reminders" />
                    <StyledTab label="Work Schedule" />
                    <StyledTab label="Preferences" />
                  </Tabs>
                </TabPanel>
              </Box>
            </Grid>
            <Grid xs={2}>
              <Typography
                sx={{
                  marginLeft: "auto",
                  backgroundColor: "#0c76a0",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 500,
                  px: 3,
                }}
              >
                Welcome, Srujana
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
