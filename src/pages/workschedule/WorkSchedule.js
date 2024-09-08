import React from "react";
import { Box, Typography } from "@mui/material";

export default function WorkSchedule() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <Typography variant="h1" style={{ color: "#183084" }}>
        Work Schedule Page
      </Typography>
      <Typography variant="h6" style={{ color: "#183084" }}>
        Coming Soon.
      </Typography>
    </Box>
  );
}
