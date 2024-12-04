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
  gap: theme.spacing(2),
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

const Link = styled(Typography)(({ theme }) => ({
  color: "#183084",
  cursor: "pointer",
  textDecoration: "underline",
  marginTop: theme.spacing(2),
  "&:hover": {
    textDecoration: "none",
  },
}));

const StatItem = ({ label, value, percentage }) => (
  <Grid container spacing={1} alignItems="center">
    <Grid item xs={6}>
      <Label>{label}</Label>
    </Grid>
    <Grid
      item
      xs={!percentage ? 6 : 3}
      textAlign={!percentage ? "right" : "inherit"}
    >
      <Value>{value}</Value>
    </Grid>
    {percentage && (
      <Grid item xs={3}>
        <Value>%</Value>
      </Grid>
    )}
  </Grid>
);

const PerformanceMetrics = ({ userId }) => {
  const data = {
    caseload: "#",
    avgWeeksToEmployment: "#",
    appointments: [
      { label: "Completed:", value: "#", percentage: "#" },
      { label: "Completed-RTW:", value: "#", percentage: "#" },
      { label: "No Shows:", value: "#", percentage: "#" },
      { label: "RTW:", value: "#", percentage: "#" },
      { label: "Rescheduled:", value: "#", percentage: "#" },
      { label: "Failed:", value: "#", percentage: "#" },
      { label: "Remote:", value: "#", percentage: "#" },
      { label: "In-person:", value: "#", percentage: "#" },
    ],
    inadequateWorkSearches: "#",
    jobReferralsMade: "#",
    trainingReferralsMade: "#",
  };
  const [period, setPeriod] = useState(30);
  const [caseManager, setCaseManager] = useState([]);
  const [localOffice, setLocalOffice] = useState([]);
  const [caseManagerId, setCaseManagerId] = useState(userId || "");
  const [localOfficeId, setLocalOfficeId] = useState("");
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
        console.log(fieldName, { url, setData });
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

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  // const handleForChange = (event) => {
  //   console.log('e val--->', event.target.value);
  //   setCaseManager(event.target.value);
  // };

  return (
    <Container
      sx={{
        height: "calc(100% - 8.2rem)",
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <FormControl fullWidth>
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

        <FormControl fullWidth>
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
                <MenuItem value={ofc.officeNum}>{ofc.officeName}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControlLabel
          value="agency"
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
            <MenuItem value={30}>30 days</MenuItem>
            <MenuItem value={60}>60 days</MenuItem>
            <MenuItem value={90}>90 days</MenuItem>
          </Select>
        </Stack>
      </Stack>

      <StatItem
        label="Avg weeks to employment:"
        value={data.avgWeeksToEmployment}
      />
      <Label>Appointments</Label>
      <Box sx={{ display: "flex", flexDirection: "column", px: 2, gap: 1 }}>
        {data.appointments.map((item) => (
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
        value={data?.inadequateWorkSearchesWeeks} //Need to change
      />
      <StatItem label="Job Referrals:" value={data.jobReferralsMade} />
      {/* <StatItem
        label="Training Referrals made:"
        value={data.trainingReferralsMade}
      /> */}
      <Box textAlign={"right"}>
        <Link>Graphical View</Link>
      </Box>
    </Container>
  );
};

export default PerformanceMetrics;

