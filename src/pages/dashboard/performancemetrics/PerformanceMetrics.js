import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  appointmentsLocalOfficeURL,
  appointmentsCaseManagerURL,
  kpiSummaryURL,
} from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import { genericSortOptionsAlphabetically } from "../../../helpers/utils";

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRight: "2px solid #000",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f5f5f5",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const Header = styled(Typography)(({ theme }) => ({
  color: "#183084",
  fontWeight: 600,
}));

const Label = styled(Typography)(({ theme }) => ({
  color: "#183084",
  fontWeight: 600,
  fontSize: "0.8rem",
}));

const Value = styled(Box)(({ theme }) => ({
  fontWeight: "normal",
  color: "#000",
}));

// const Link = styled(Typography)(({ theme }) => ({
//   color: "#183084",
//   cursor: "pointer",
//   textDecoration: "underline",
//   marginTop: theme.spacing(2),
//   "&:hover": {
//     textDecoration: "none",
//   },
// }));

const StatItem = ({ label, value, percentage }) => (
  <Grid container spacing={0.9} alignItems="center">
    <Grid item xs={6}>
      <Label>{label}</Label>
    </Grid>
    <Grid
      item
      xs={!percentage?.toString() ? 0.6 : 3}
      textAlign={!percentage?.toString() ? "right" : "inherit"}
    >
      <Value>{value}</Value>
    </Grid>
    {percentage?.toString() && (
      <Grid item xs={3}>
        <Value>{percentage}%</Value>
      </Grid>
    )}
  </Grid>
);

const PerformanceMetrics = ({ userId }) => {
  const [period, setPeriod] = useState("THREE_MONTHS");
  const [caseManager, setCaseManager] = useState([]);
  const [localOffice, setLocalOffice] = useState([]);
  const [caseManagerId, setCaseManagerId] = useState(userId || "");
  const [localOfficeId, setLocalOfficeId] = useState("");
  const [kpiSummary, setKpiSummary] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const data = {
    caseload: kpiSummary?.caseLoad,
    avgWksOfEmployment: kpiSummary?.avgWksOfEmployment,
    appointments: [
      {
        label: "Completed:",
        value: kpiSummary?.completedApptCount,
        percentage: kpiSummary?.completedApptPercent,
      },
      {
        label: "Completed-RTW:",
        value: kpiSummary?.completedRTWApptCount,
        percentage: kpiSummary?.completedRTWApptPercent,
      },
      // {
      //   label: "Scheduled:",
      //   value: kpiSummary?.scheduledCount,
      //   percentage: kpiSummary?.scheduledPercent,
      // },
    ],
    noShows: [
      {
        label: "RTW:",
        value: kpiSummary?.noShowRTWCount,
        percentage: kpiSummary?.noShowRTWPercent,
      },
      {
        label: "Rescheduled:",
        value: kpiSummary?.noShowRescheduledCount,
        percentage: kpiSummary?.noShowRescheduledPercent,
      },
      {
        label: "Failed:",
        value: kpiSummary?.noShowFailedCount,
        percentage: kpiSummary?.noShowFailedPercent,
      },
      {
        label: "Remote:",
        value: kpiSummary?.remoteApptCount,
        percentage: kpiSummary?.remoteApptPercent,
      },
      {
        label: "In-person:",
        value: kpiSummary?.inPersonApptCount,
        percentage: kpiSummary?.inPersonApptPercent,
      },
    ],
    inadequateWorkSearches: kpiSummary?.noOfInadequateWSCmts,
    jobReferralsMade: kpiSummary?.noOfJobReferralsMade,
    inadequateWSWeeks: kpiSummary?.noOfInadequateWSWeeks
    // trainingReferralsMade: kpiSummary?.noOfJobReferralsMade,
  };

  const onPageLoadFields = {
    CaseManager: {
      url: appointmentsCaseManagerURL,
      setData: setCaseManager,
      propertyName: "name",
    },
    LocalOffice: {
      url: appointmentsLocalOfficeURL,
      setData: setLocalOffice,
      propertyName: "officeName",
    },
  };

  useEffect(() => {
    async function loadData(fieldName) {
      try {
        const { url, setData, propertyName } = onPageLoadFields[fieldName];
        const data = await client.get(url);
        const sortedData = genericSortOptionsAlphabetically(data, propertyName);
        setData(sortedData);
      } catch (errorResponse) {
        console.error("Error in Performance metrics loadData", errorResponse);
      }
    }

    Promise.all(
      Object.keys(onPageLoadFields).map((fieldName) => loadData(fieldName))
    );
  }, []);

  useEffect(() => {
    async function getKPISummary(payload) {
      try {
        const result =
          process.env.REACT_APP_ENV === "mockserver"
            ? await client.get(kpiSummaryURL, payload)
            : await client.post(kpiSummaryURL, payload);
        setKpiSummary(result);
      } catch (errorResponse) {
        console.error("Error in getKPISummary", errorResponse);
      }
    }
    if (!period) {
      return;
    }
    let payload = {
      periodRange: period,
    };
    if (selectedOption === "Agency") {
      payload["agencySelectedInd"] = "Y";
      getKPISummary(payload);
    } else if (selectedOption === "CaseManager" && caseManagerId) {
      payload["caseMgrId"] = caseManagerId;
      getKPISummary(payload);
    } else if (selectedOption === "LocalOffice" && localOfficeId) {
      payload["lofId"] = localOfficeId;
      getKPISummary(payload);
    } else {
      return;
    }
  }, [caseManagerId, localOfficeId, period, selectedOption]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
    setCaseManagerId("");
    setLocalOfficeId("");
  };
  console.log('data?.noOfInadequateWSWeeks-->',data?.noOfInadequateWSWeeks);

  return (
    <Container
      sx={{
        height: "calc(100% - 5.1rem)",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
        },
      }}
    >
      <Header variant="h6">Key Performance Metrics</Header>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <RadioGroup value={selectedOption} onChange={handleRadioChange}>
          <Box display="flex" alignItems="center" mb={1}>
            <FormControlLabel
              value="CaseManager"
              control={<Radio />}
              label=""
              sx={{ marginRight: 0 }}
            />
            <FormControl fullWidth disabled={selectedOption !== "CaseManager"}>
              <InputLabel
                id="caseManagerId"
                sx={{
                  color: "#183084",
                  fontWeight: "bold",
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "10px",
                  pointerEvents: "none",
                  transition: "all 0.2s ease-out",
                  "&.Mui-focused, &.MuiFormLabel-filled": {
                    top: "0",
                    transform: "translateY(1)",
                    fontSize: "10px",
                  },
                }}
              >
                Case Manager
              </InputLabel>
              <Select
                labelId="caseManagerId"
                id="caseManagerId"
                value={caseManagerId}
                label="Case Manager"
                onChange={(e) => {
                  const user = caseManager.find(
                    (s) => s.id === Number(e.target.value)
                  );
                  setCaseManagerId(user.id);
                }}
                sx={{ height: "35px" }}
              >
                {Array.isArray(caseManager) &&
                  caseManager.map((cmr) => (
                    <MenuItem key={cmr.id} value={cmr.id}>
                      {cmr.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" alignItems="center" mb={0.1}>
            <FormControlLabel
              value="LocalOffice"
              control={<Radio />}
              label=""
              sx={{ marginRight: 0 }}
            />
            <FormControl fullWidth disabled={selectedOption !== "LocalOffice"}>
              <InputLabel
                id="localOfficeId"
                sx={{
                  color: "#183084",
                  fontWeight: "bold",
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "10px",
                  pointerEvents: "none",
                  transition: "all 0.2s ease-out",
                  "&.Mui-focused, &.MuiFormLabel-filled": {
                    top: "0",
                    transform: "translateY(1)",
                    fontSize: "10px",
                  },
                }}
              >
                Local Office
              </InputLabel>
              <Select
                labelId="localOfficeId"
                id="localOfficeId"
                value={localOfficeId}
                label="Local Office"
                onChange={(e) => {
                  const office = localOffice.find(
                    (s) => s.officeNum === Number(e.target.value)
                  );
                  setLocalOfficeId(office.officeNum);
                }}
                sx={{ height: "35px" }}
              >
                {Array.isArray(localOffice) &&
                  localOffice.map((ofc) => (
                    <MenuItem key={ofc.officeNum} value={ofc.officeNum}>
                      {ofc.officeName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" alignItems="center">
            <FormControlLabel
              value="Agency"
              control={<Radio />}
              label="Agency"
              sx={{
                ".MuiFormControlLabel-label": {
                  color: "#183084",
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        </RadioGroup>
      </Box>
      <StatItem label="Caseload:" value={data.caseload} />
      <Stack direction="row">
        <Stack width="30%" justifyContent={"center"}>
          <Typography className="label-text">Over the past:</Typography>
        </Stack>
        <Stack width="70%">
          <Select
            size="small"
            value={period}
            onChange={handlePeriodChange}
            fullWidth
          >
            <MenuItem value={"THREE_MONTHS"}>3 Months</MenuItem>
            <MenuItem value={"SIX_MONTHS"}>6 Months</MenuItem>
            <MenuItem value={"ONE_YEAR"}>1 Year</MenuItem>
          </Select>
        </Stack>
      </Stack>

      <StatItem
        label="Avg weeks to employment:"
        value={data.avgWksOfEmployment}
      />
      {/* <Label>Appointments:<span style={{ display:'inline-block', width:"50%", textAlign: 'center', paddingLeft:"5px"}}>{kpiSummary?.totalApptCount}</span></Label> */}
      <Label>Appointments</Label>
      <Box sx={{ display: "flex", flexDirection: "column", px: 1.5, gap: 0.7 }}>
        {data.appointments.map((item) => (
          <StatItem
            key={item.label}
            label={item.label}
            value={item.value}
            percentage={item.percentage}
          />
        ))}
      </Box>

      <Label>No Shows</Label>
      <Box sx={{ display: "flex", flexDirection: "column", px: 1.5, gap: 0.7 }}>
        {data.noShows.map((item) => (
          <StatItem
            key={item.label}
            label={item.label}
            value={item.value}
            percentage={item.percentage}
          />
        ))}
      </Box>

      <StatItem
        label="Inadequate WS-claimant:"
        value={data.inadequateWorkSearches}
      />
      <StatItem
        label="Inadequate WS-Weeks:"
        value={data?.inadequateWSWeeks} //Need to change
      />
      <StatItem label="Job Referrals:" value={data.jobReferralsMade} />
      {/* <StatItem
        label="Training Referrals made:"
        value={data.trainingReferralsMade}
      /> */}
      {/* <Box textAlign={"right"}>
        <Link>
          Graphical View
        </Link>
      </Box> */}
    </Container>
  );
};

export default PerformanceMetrics;

