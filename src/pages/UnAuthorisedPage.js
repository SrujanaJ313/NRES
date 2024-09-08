import React from "react";
import { Box, Typography } from "@mui/material";

export default function UnAuthorised() {
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
        401
      </Typography>
      <Typography variant="h6" style={{ color: "#183084" }}>
        You are unauthorised to access the page you're looking for.
      </Typography>
    </Box>
  );
}
