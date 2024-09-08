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

const IssuesCreatedData = ({ data }) => {
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
              <StyledHeaderTableCell>Issue</StyledHeaderTableCell>
              <StyledHeaderTableCell>Period</StyledHeaderTableCell>
              <StyledHeaderTableCell>Created on</StyledHeaderTableCell>
              <StyledHeaderTableCell>Created by</StyledHeaderTableCell>
              <StyledHeaderTableCell>Status</StyledHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <StyledRowTableCell>
                  {row.issueType + "/" + row.issueSubType}
                </StyledRowTableCell>
                <StyledRowTableCell>{`${row.startDt} - ${row.endDt || ""}`}</StyledRowTableCell>
                <StyledRowTableCell>{row.createdOn}</StyledRowTableCell>
                <StyledRowTableCell>{row.createdBy}</StyledRowTableCell>
                <StyledRowTableCell>{row.decStatus}</StyledRowTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IssuesCreatedData;
