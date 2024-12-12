import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  Typography,
  Link,
  Stack,
  ButtonBase,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import client from "../../../helpers/Api";
import { caseloadMetricsURL } from "../../../helpers/Urls";
import { CookieNames, getCookieItem } from "../../../utils/cookies";
import { appointmentStaffListURL } from "../../../helpers/Urls";
import {
  getMsgsFromErrorCode,
  sortAlphabetically,
} from "../../../helpers/utils";

const STAGES = [
  "Initial Appointment",
  "1st Subsequent Appointment",
  "2nd Subsequent Appointment",
  "followUp",
  "hiPriority",
  "failed",
  "delayed",
  "All",
];
const labels = {
  "Initial Appointment": "Initial Appointment",
  "1st Subsequent Appointment": "1st Subsequent Appointment",
  "2nd Subsequent Appointment": "2nd Subsequent Appointment",
  followUp: <Typography className="label-text">Follow-up required </Typography>,
  hiPriority: (
    <Typography className="label-text"> HI Priority cases</Typography>
  ),
  failed: (
    <Typography className="label-text">Failed last appointment</Typography>
  ),
  delayed: (
    <Typography className="label-text">Beyond 21 days appointments</Typography>
  ),
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  textAlign: "center",
  lineHeight: "10px",
  padding:"10px"
}));

const ContentCell = styled(TableCell)(({ theme }) => ({
  color: "#000000",
  fontWeight: 600,
  textAlign: "center",
  lineHeight: "10px",
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
}));

const CaseloadMetrics = React.memo(
  ({
    showCalendarView,
    onSwitchView,
    onChange,
    userId,
    handleItemsSelection,
    stage,
  }) => {
    // const [selectedStage, setSelectedStage] = useState('All');
    const [caseloadMetrics, setCaseloadMetrics] = useState({});
    const [metricLabels, setMetricLabels] = useState([]);
    const [metricValues, setMetricValues] = useState([]);

    const [appointmentStaffList, setAppointmentStaffList] = useState([]);

    const [errors, setErrors] = useState([]);
    const keyMapping = {
      Initial: "initialInterview",
      "1stSub": "firstSubInterview",
      "2ndSub": "secondSubInterview",
      "Pending Schedule":"pendingSchedule",
      "Follow-up": "followUp",
      "HI Priority": "hiPriority",
      Failed: "failed",
      "Beyond 21 days": "delayed",
    };

    useEffect(() => {
      getCaseloadMetrics();
    }, [userId]);

    const getCaseloadMetrics = async () => {
      try {
        const response =
          process.env.REACT_APP_ENV === "mockserver"
            ? await client.get(caseloadMetricsURL)
            : await client.get(`${caseloadMetricsURL}/${userId}`);
        setCaseloadMetrics(response);
      } catch (err) {
        console.error("Failed to fetch caseload metrics", err);
        setErrors(err);
      }
    };

    useEffect(() => {
      if (caseloadMetrics) {
        setMetricLabels(Object.keys(keyMapping));
        setMetricValues(Object.values(keyMapping));
      }
    }, [caseloadMetrics]);
    useEffect(() => {
      async function fetchAppointmentStaffListData() {
        try {
          const data =
            process.env.REACT_APP_ENV === "mockserver"
              ? await client.get(appointmentStaffListURL)
              : await client.get(appointmentStaffListURL);
          const sortedData = sortAlphabetically(data);
          setAppointmentStaffList(sortedData);
        } catch (errorResponse) {
          const newErrMsgs = getMsgsFromErrorCode(
            `GET:${process.env.REACT_APP_APPOINTMENT_STAFF_LIST}`,
            errorResponse
          );
          setErrors(newErrMsgs);
        }
      }
      fetchAppointmentStaffListData();
    }, []);

    const handleSwitchView = useCallback(
      (event) => {
        event.preventDefault();
        onSwitchView(event);
      },
      [onSwitchView]
    );

    const handleCellClick = (index) => {
      const stage = STAGES[index] || STAGES[0];

      // setSelectedStage(stage);

      onChange(stage);
    };

    return (
      <Box sx={{ paddingBottom: 0, paddingTop: 0.5 }}>
        <Stack direction="row" spacing={2}>
          <Stack
            direction="row"
            style={{ marginTop: "0.5rem", width: "20rem" }}
          >
            <FormControl fullWidth size="small">
              <InputLabel id="select-source-label">
                Items Assigned To
              </InputLabel>
              <Select
                labelId="select-source-label"
                size="small"
                value={userId}
                onChange={(e) => {
                  const userName = appointmentStaffList.find(
                    (s) => s.id === Number(e.target.value)
                  );

                  handleItemsSelection(e, userName);
                }}
                label="Items Assigned To"
              >
                {appointmentStaffList.map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 400 }}
              aria-label="caseload metrics table"
              size="small"
            >
              <TableHead>
                <TableRow>
                  {metricLabels.map((label, index) => (
                    <StyledTableCell key={index}>
                      {label === "1stSub" ? (
                        <>
                          1<sup>st</sup>&nbsp;&nbsp;Sub
                        </>
                      ) : label === "2ndSub" ? (
                        <>
                          2<sup>nd</sup>&nbsp;&nbsp;Sub
                        </>
                      ) : (
                        label
                      )}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {metricValues.map((value, index) => {
                    let cellColor = "inherit";
                    if (index === metricValues.length - 2) {
                      cellColor = "orange";
                    } else if (index === metricValues.length - 1) {
                      cellColor = "red";
                    }

                    return (
                      <ContentCell key={index} sx={{ color: cellColor }}>
                        <ButtonBase onClick={() => handleCellClick(index)}>
                          <StyledBox>{caseloadMetrics[value]}</StyledBox>
                        </ButtonBase>
                      </ContentCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>

        <Box
          sx={{
            mt: "21px",
            position: "absolute",
            right: "24px",
            zIndex: "10",
          }}
        >
          <Link
            href="#"
            underline="always"
            color="#183084"
            onClick={handleSwitchView}
          >
            {showCalendarView
              ? "Switch to Caseload View"
              : "Switch to Calendar View"}
          </Link>
        </Box>
        {!!errors?.length && (
          <Stack mt={1} direction="column" useFlexGap flexWrap="wrap">
            {errors.map((x) => (
              <div>
                <span className="errorMsg">*{x}</span>
              </div>
            ))}
          </Stack>
        )}

        {!showCalendarView && (
          <Stack direction="row" justifyContent="flex-start" spacing={1}>
            {stage !== "All" &&
              [
                "Initial Appointment",
                "1st Subsequent Appointment",
                "2nd Subsequent Appointment",
              ].includes(stage) && (
                <Typography className="label-text">Stage:</Typography>
              )}{" "}
            <Typography>{labels[stage]}</Typography>{" "}
          </Stack>
        )}
      </Box>
    );
  }
);

export default CaseloadMetrics;

