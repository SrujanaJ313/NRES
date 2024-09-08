import React from "react";
import {
  TableCell,
  TableRow,
  Radio,
  Stack,
  Typography,
  Tooltip,
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

const CaseModeTableRow = ({ row }) => {
  return (
    <TableRow>
      <StyledTableCell padding="checkbox" sx={{ width: "10px", padding: 0 }}>
        <Radio size="small" />
      </StyledTableCell>
      <StyledTableCell>
        <Stack spacing={1.5} direction="row">
          <Typography>{`${row.claimantName}`}</Typography>
          {row.partailSsn && (
            <Tooltip title={row.partailSsn} placement="right-start">
              <MoreHorizIcon />
            </Tooltip>
          )}
        </Stack>
      </StyledTableCell>
      <StyledTableCell>{row.byeDt}</StyledTableCell>
      <StyledTableCell>{row.stage}</StyledTableCell>
      <StyledTableCell>
        <Stack spacing={1.5} direction="row">
          {`${row.status}`}
        </Stack>
      </StyledTableCell>
      <StyledTableCell>{row.ccaWeeks}</StyledTableCell>
      <StyledTableCell>{row.followUpDt}</StyledTableCell>
      <StyledTableCell
        style={{ color: row.indicatorColor }}
        indicator={row.indicator}
      >
        {row.indicator}
      </StyledTableCell>
    </TableRow>
  );
};

export default CaseModeTableRow;
