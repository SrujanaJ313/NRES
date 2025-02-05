import React, { useCallback, useState } from "react";
import { Box, Grid } from "@mui/material";
import PerformanceMetrics from "./performancemetrics/PerformanceMetrics";
import CaseloadMetrics from "./caseloadmetrics/CaseloadMetrics";
import CaseModeView from "./caseModeView/CaseModeView";
import InterviewCalendarView from "./interviewCalendarView";
import { CookieNames, getCookieItem, getUserName } from "../../utils/cookies";

const Dashboard = () => {
  const [isCalendarView, setIsCalendarView] = useState(true);
  const [stage, setStage] = useState("All");
  const [userId, setUserId] = useState(getCookieItem(CookieNames.USER_ID));
  const [userName, setUserName] = useState(getUserName());
  const [selectedRow, setSelectedRow] = useState("");

  const handleSwitchView = useCallback(() => {
    setIsCalendarView((prev) => !prev);
  }, []);

  const handleMetricChange = useCallback((selectedStage) => {
    setStage(selectedStage);
  }, []);

  const handleItemsSelection = (event, user) => {
    setUserName(user.name);
    setUserId(event.target.value);
    setStage("All");
    setSelectedRow("");
  };

  return (
    <Box>
      <Grid container sx={{ border: "2px solid #000" }}>
        <Grid item xs={12} sm={3} xl={3}>
          <PerformanceMetrics userId={userId} />
        </Grid>
        <Grid item xs={12} sm={9} xl={9} maxHeight={"100%"} sx={{ padding: 1 }}>
          <Box>
            <CaseloadMetrics
              showCalendarView={isCalendarView}
              onSwitchView={handleSwitchView}
              onChange={handleMetricChange}
              userId={userId}
              handleItemsSelection={handleItemsSelection}
              stage={stage}
            />
            {isCalendarView ? (
              <InterviewCalendarView userId={userId} userName={userName} />
            ) : (
              <CaseModeView
                showCalendarView={isCalendarView}
                onSwitchView={handleSwitchView}
                selectedStage={stage}
                userId={userId}
                userName={userName}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

