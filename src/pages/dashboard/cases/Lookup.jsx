import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import LookupSpecialUser from "./LookupSpecialUser";

const StyledTableCell = (props) => (
  <TableCell
    {...props}
    sx={{
      fontWeight: props.variant === "head" ? "bold" : "normal",
      color: props.variant === "head" ? "#fff" : "inherit",
      backgroundColor: props.variant === "head" ? "#183084" : "inherit",
    }}
  />
);

function LookUp() {
  const [lookUpSummary, setLookUpSummary] = useState([]);

  return (
    <Box display="flex" height="100vh">
      {/* Left Panel */}
      <LookupSpecialUser setLookUpSummary={setLookUpSummary} />

      {/* Right Panel */}
      <Box width="65%" bgcolor="#f1f3f8" p={2}>
        <Typography variant="h6" gutterBottom sx={{ color: "#183084" }}>
          Special User Details
        </Typography>

        {lookUpSummary.length > 0 ? (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell variant="head">First Name</StyledTableCell>
                  <StyledTableCell variant="head">Last Name</StyledTableCell>
                  <StyledTableCell variant="head">User Name</StyledTableCell>
                  <StyledTableCell variant="head">User Login Name</StyledTableCell>
                  <StyledTableCell variant="head">Date of Birth</StyledTableCell>
                  <StyledTableCell variant="head">SSN</StyledTableCell>
                  <StyledTableCell variant="head">Email Address</StyledTableCell>
                  <StyledTableCell variant="head">Mobile Phone</StyledTableCell>
                  <StyledTableCell variant="head">Status</StyledTableCell>
                  <StyledTableCell variant="head">Claimant ID</StyledTableCell>
                  <StyledTableCell variant="head">Created Date</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lookUpSummary.map((row) => (
                  <TableRow key={row.id || `${row.userName}-${row.lastName}`} hover>
                    <TableCell>{row.firstName || "-"}</TableCell>
                    <TableCell>{row.lastName || "-"}</TableCell>
                    <TableCell>{row.userName || "-"}</TableCell>
                    <TableCell>{row.userLoginName || "-"}</TableCell>
                    <TableCell>{row.dateOfBirth || "-"}</TableCell>
                    <TableCell>{row.ssn || "-"}</TableCell>
                    <TableCell>{row.emailAddress || "-"}</TableCell>
                    <TableCell>{row.mobilePhone || "-"}</TableCell>
                    <TableCell>{row.status || "-"}</TableCell>
                    <TableCell>{row.claimantId || "-"}</TableCell>
                    <TableCell>{row.createdDate || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" sx={{ marginTop: 2, color: "#666" }}>
            Enter search criteria and click Search to view special user details.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default LookUp;
