import React from "react";
import { Box, Typography } from "@mui/material";
import LookUpAppointments from "./LookUpAppointments";

function Appointments() {
  return (
    <Box display="flex" height="100vh">
      {/* Left Panel */}
      <LookUpAppointments />

      {/* Right Panel */}
      <Box width="65%" bgcolor="#f1f3f8" p={2}>
        <Typography variant="h6" gutterBottom>
          Appointment Details
        </Typography>
        {/* Content for the right panel */}
      </Box>
    </Box>
  );
}

export default Appointments;

