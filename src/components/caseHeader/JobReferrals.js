import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
} from "@mui/material";

const StyledHeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  // textAlign: "center",
  lineHeight: "1rem",
}));
const StyledRowTableCell = styled(TableCell)(({ theme }) => ({
  lineHeight: "1rem",
}));

const JobReferrals = ({ data }) => {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 750 }}
          size="small"
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledHeaderTableCell>Employer Name</StyledHeaderTableCell>
              <StyledHeaderTableCell>Job Title</StyledHeaderTableCell>
              <StyledHeaderTableCell>Effective Period</StyledHeaderTableCell>
              <StyledHeaderTableCell>Created by</StyledHeaderTableCell>
              <StyledHeaderTableCell>Source</StyledHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <StyledRowTableCell>{row.employer}</StyledRowTableCell>
                <StyledRowTableCell>{row.title}</StyledRowTableCell>
                <StyledRowTableCell>{`${row.startDt} - ${row.endDt || ""}`}</StyledRowTableCell>
                <StyledRowTableCell>{row.createdBy || "-"}</StyledRowTableCell>
                <StyledRowTableCell>{row.source}</StyledRowTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default JobReferrals;
