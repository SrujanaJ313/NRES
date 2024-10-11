import React, { useState } from "react";
import {
  TableCell,
  TableRow,
  Radio,
  Stack,
  Typography,
  Tooltip,
  FormControlLabel ,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const StyledTableCell = styled(TableCell)(({ theme, indicator }) => ({
  lineHeight: "1rem",
  color: indicatorColors[indicator] || "inherit",
}));

const indicatorColors = {
  LATE: "#ab0c0c",
  HI: "red",
  WL: "#f36d6d",
};

const CaseModeTableRow = ({ row,selectedRow,setSelectedRow }) => {
  return (
    <TableRow key={row?.caseNum}>
    <StyledTableCell padding="checkbox">
      <FormControlLabel
        value={row?.caseNum}
        control={<Radio />}
        label=""
        checked={row?.caseNum === selectedRow.caseNum}
        onChange={() => {
          // const row = rows?.find((r) => r.caseNum === Number(e.target.value));
          setSelectedRow(row);
        }}
      />
    </StyledTableCell>
      <StyledTableCell>{row.claimantName}</StyledTableCell>
      <StyledTableCell>{row.byeDt}</StyledTableCell>
      <StyledTableCell>{row.stage}</StyledTableCell>
      <StyledTableCell>
        <Stack spacing={1.5} direction="row">
          {row.status}
          &nbsp; &nbsp; &nbsp;
          {row.statusDt || ""}
        </Stack>
      </StyledTableCell>
      <StyledTableCell>{row.ccaWeeks}</StyledTableCell>
      <StyledTableCell>{row.followUpDt}</StyledTableCell>
      <StyledTableCell
        style={{ color: row.indicatorColor }}
        indicator={row.indicator}
      >
        {row.indicator === "LATE"?">21":row.indicator}
      </StyledTableCell>
    </TableRow>
  );
};

export default CaseModeTableRow;
