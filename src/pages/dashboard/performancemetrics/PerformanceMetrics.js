import React, { useState } from "react";
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

const PerformanceMetrics = () => {
  const data = {
    caseload: "#",
    avgWeeksToEmployment: "#",
    appointments: [
      { label: "Completed:", value: "#", percentage: "#" },
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
  const [selectedFor, setSelectedFor] = useState("mary");
  const [localOffice, setLocalOffice] = useState("LO");

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const handleForChange = (event) => {
    setSelectedFor(event.target.value);
  };

  return (
    <Container>
      <Header variant="h6">Key Performance Metrics</Header>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <FormControl fullWidth>
          <InputLabel
            id="caseManagerId"
            sx={{ color: "#183084", fontWeight: "bold" }}
          >
            Case Manager
          </InputLabel>
          <Select
            labelId="caseManagerId"
            id="caseManager"
            value={selectedFor}
            label="Case Manager"
            onChange={(e) => setSelectedFor(e.target.value)}
            sx={{ height: "45px" }}
          >
            <MenuItem value={"mary"}>Mary</MenuItem>
            <MenuItem value={"john"}>John</MenuItem>
            <MenuItem value={"ryan"}>Ryan</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel
            id="localOfficeId"
            sx={{ color: "#183084", fontWeight: "bold" }}
          >
            Local Office
          </InputLabel>
          <Select
            labelId="localOfficeId"
            id="localOffice"
            value={localOffice}
            label="Local Office"
            onChange={(e) => setLocalOffice(e.target.value)}
            sx={{ height: "45px" }}
          >
            <MenuItem value={"LO"}>LO</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel value="agency" control={<Radio />} label="Agency" sx={{
          ".MuiFormControlLabel-label":{
            color: "#183084", fontWeight: "bold"
          }
        }} />
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
        label="Inadequate Work Searches:"
        value={data.inadequateWorkSearches}
      />
      <StatItem label="Job Referrals made:" value={data.jobReferralsMade} />
      <StatItem
        label="Training Referrals made:"
        value={data.trainingReferralsMade}
      />
      <Box textAlign={"right"}>
        <Link>Graphical View</Link>
      </Box>
    </Container>
  );
};

export default PerformanceMetrics;

