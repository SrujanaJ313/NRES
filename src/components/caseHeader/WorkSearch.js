import React, { useEffect, useState } from "react";
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
  TableFooter,
  Button,
} from "@mui/material";

const StyledHeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  textAlign: "center",
  lineHeight: "1rem",
}));
const StyledRowTableCell = styled(TableCell)(({ theme }) => ({
  lineHeight: "1rem",
}));

const WorkSearch = ({ data }) => {
  const [rows, setRows] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (data.length > 3) {
      const displayRows = [...data].slice(0, 3);
      setRows(displayRows);
    } else {
      setRows(data);
    }
  }, [data]);

  const handleRows = () => {
    if (showMore) {
      const displayRows = [...data].slice(0, 3);
      setRows(displayRows);
    } else {
      setRows(data);
    }
    setShowMore(!showMore);
  };

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
              <StyledHeaderTableCell>Week Ending Date</StyledHeaderTableCell>
              <StyledHeaderTableCell># WS Contacts</StyledHeaderTableCell>
              <StyledHeaderTableCell># Gold Activities</StyledHeaderTableCell>
              <StyledHeaderTableCell># Bronze Activities</StyledHeaderTableCell>
              <StyledHeaderTableCell>Min WS Reqd.</StyledHeaderTableCell>
              <StyledHeaderTableCell>Inadequate WS</StyledHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <StyledRowTableCell sx={{ textAlign: "center" }}>
                  {row.weekEndingDt}
                </StyledRowTableCell>
                <StyledRowTableCell sx={{ textAlign: "end" }}>
                  {row.wsContacts}
                </StyledRowTableCell>
                <StyledRowTableCell sx={{ textAlign: "end" }}>
                  {row.goldActivities}
                </StyledRowTableCell>
                <StyledRowTableCell sx={{ textAlign: "end" }}>
                  {row.bronzeActivities}
                </StyledRowTableCell>
                <StyledRowTableCell sx={{ textAlign: "end" }}>
                  {row.minWorkSrchReq}
                </StyledRowTableCell>
                <StyledRowTableCell sx={{ textAlign: "center" }}>
                  {row.inadequateWorkSrch}
                </StyledRowTableCell>
              </TableRow>
            ))}
          </TableBody>
          {data.length > 3 && (
            <TableFooter>
              <TableRow>
                <StyledRowTableCell
                  colSpan={6}
                  sx={{ textAlign: "right", paddingY: 0 }}
                >
                  <Button sx={{ paddingY: 0 }} onClick={handleRows}>
                    {showMore ? "Show Less" : "Show More"}
                  </Button>
                </StyledRowTableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WorkSearch;
