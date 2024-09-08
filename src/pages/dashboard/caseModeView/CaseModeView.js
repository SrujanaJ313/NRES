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
  Stack,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import cloneDeep from "lodash/cloneDeep";

import CaseModeTableRow from "./CaseModeTableRow";
import { caseLoadSummaryURL } from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import { getMsgsFromErrorCode } from "../../../helpers/utils";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  // textAlign: "center",
  lineHeight: "1rem",
}));

const COLUMNS = [
  {
    id: "claimantName",
    label: "Claimant",
  },
  {
    id: "byeDt",
    label: "BYE",
  },
  {
    id: "stage",
    label: "Stage",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "ccaWeeks",
    label: "# Wks",
  },
  {
    id: "followUpDt",
    label: "Follow-up",
  },
  {
    id: "indicator",
    label: "Indicators",
  },
];

const CaseModeView = ({ selectedStage, userId }) => {
  const [rows, setRows] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    needTotalCount: true,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState({
    field: "caseNum",
    direction: "asc",
  });

  useEffect(() => {
    const payload = {
      metric: selectedStage,
      userId: userId,

      pagination: pagination,
      sortBy: sortBy,
    };
    if (selectedStage && userId) {
      getCaseLoadSummaryData(payload);
    }
  }, [selectedStage, userId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);

    const paginationPayload = {
      pageNumber: newPage + 1,
      pageSize: pagination.pageSize,
      needTotalCount: true,
    };
    setPagination(paginationPayload);

    const payload = {
      metric: selectedStage,
      userId: userId,

      pagination: paginationPayload,
      sortBy: sortBy,
    };

    getCaseLoadSummaryData(payload);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);

    const paginationPayload = {
      pageNumber: 1,
      pageSize: event.target.value,
      needTotalCount: true,
    };
    setPagination(paginationPayload);

    const payload = {
      metric: selectedStage,
      userId: userId,

      pagination: paginationPayload,
      sortBy: sortBy,
    };
    getCaseLoadSummaryData(payload);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = sortBy.field === property && sortBy.direction === "asc";

    const sort = {
      field: property,
      direction: isAsc ? "desc" : "asc",
    };
    setSortBy(sort);

    const payload = {
      metric: selectedStage,
      userId: userId,

      pagination: pagination,
      sortBy: sort,
    };
    getCaseLoadSummaryData(payload);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const getCaseLoadSummaryData = async (payload) => {
    try {
      setErrorMessages([]);
      const response = await client.post(caseLoadSummaryURL, payload);
      setRows(cloneDeep(response.caseLoadSummaryList));
      setTotalCount(response.pagination.totalItemCount);
    } catch (errorResponse) {
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_CASELOAD_SUMMARY}`,
        errorResponse
      );
      setErrorMessages(newErrMsgs);
    }
  };

  return (
    <Box sx={{ paddingTop: 3, paddingBottom: 2 }}>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 750 }}
          size="small"
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              {COLUMNS.map((column) => (
                <StyledTableCell key={column.id}>
                  {" "}
                  <TableSortLabel
                    active={sortBy.field === column.id}
                    direction={
                      sortBy.field === column.id ? sortBy.direction : "asc"
                    }
                    onClick={createSortHandler(column.id)}
                  >
                    {column.label}
                    {sortBy.field === column.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {sortBy.direction === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <CaseModeTableRow key={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        direction="row"
        useFlexGap
        flexWrap="wrap"
      >
        {errorMessages.map((x) => (
          <div>
            <span className="errorMsg">*{x}</span>
          </div>
        ))}
      </Stack>
    </Box>
  );
};

export default CaseModeView;
