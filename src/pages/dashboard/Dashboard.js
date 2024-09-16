import React, { useCallback, useState } from "react";
import { Box, Grid } from "@mui/material";
import PerformanceMetrics from "./performancemetrics/PerformanceMetrics";
import CaseloadMetrics from "./caseloadmetrics/CaseloadMetrics";
import CaseModeView from "./caseModeView/CaseModeView";
import InterviewCalendarView from "./interviewCalendarView";
import { CookieNames, getCookieItem } from "../../utils/cookies";

const Dashboard = () => {
  const [isCalendarView, setIsCalendarView] = useState(true);
  const [stage, setStage] = useState("All");
  const [userId, setUserId] = useState(getCookieItem(CookieNames.USER_ID));

  const handleSwitchView = useCallback(() => {
    setIsCalendarView((prev) => !prev);
  }, []);

  const handleMetricChange = useCallback((selectedStage) => {
    setStage(selectedStage);
  }, []);

  const handleItemsSelection = (event) => {
    setUserId(event.target.value);
  };

  return (
    <Box>
      <Grid container sx={{ border: "2px solid #000" }}>
        <Grid item xs={12} sm={3} xl={3}>
          <PerformanceMetrics />
        </Grid>
        <Grid item xs={12} sm={9} xl={9} maxHeight={"100%"} sx={{ padding: 1 }}>
          <Box>
            <CaseloadMetrics
              showCalendarView={isCalendarView}
              onSwitchView={handleSwitchView}
              onChange={handleMetricChange}
              userId={userId}
              handleItemsSelection={handleItemsSelection}
            />
            {isCalendarView ? (
              <InterviewCalendarView userId={userId} />
            ) : (
              <CaseModeView selectedStage={stage} userId={userId} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
