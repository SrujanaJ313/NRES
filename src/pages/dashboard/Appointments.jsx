import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  TextField,
  MenuItem,
  Checkbox,
  Button,
  Typography,
  Stack,
  FormControlLabel,
} from "@mui/material";

const validationSchema = Yup.object().shape({
  localOffice: Yup.string(),
  caseManager: Yup.string(),
  appointmentDateFrom: Yup.date(),
  appointmentDateTo: Yup.date(),
  timeslotType: Yup.string(),
  timeslotUsage: Yup.string(),
  meetingStatus: Yup.string(),
  beyond21Days: Yup.boolean(),
  hiPriority: Yup.boolean(),
  scheduledBy: Yup.string(),
  claimantName: Yup.string(),
  ssn: Yup.string(),
  byeFrom: Yup.date(),
  byeTo: Yup.date(),
});

function Appointments() {
  const formik = useFormik({
    initialValues: {
      localOffice: "",
      caseManager: "",
      appointmentDateFrom: "",
      appointmentDateTo: "",
      timeslotType: "",
      timeslotUsage: "",
      meetingStatus: "",
      beyond21Days: false,
      hiPriority: false,
      scheduledBy: "",
      claimantName: "",
      ssn: "",
      byeFrom: "",
      byeTo: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Box display="flex" height="100vh">
      {/* Left Panel */}
      <Box width="35%" bgcolor="#e9f0fb" p={2}>
        <Typography color="primary" variant="h6" gutterBottom>
          Look Up Appointments
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              id="localOffice"
              name="localOffice"
              label="Local Office"
              value={formik.values.localOffice}
              onChange={formik.handleChange}
              error={
                formik.touched.localOffice && Boolean(formik.errors.localOffice)
              }
              helperText={
                formik.touched.localOffice && formik.errors.localOffice
              }
              select
              fullWidth
              size="small"
            >
              <MenuItem value="Office1">Office1</MenuItem>
              <MenuItem value="Office2">Office2</MenuItem>
            </TextField>

            <TextField
              id="caseManager"
              name="caseManager"
              label="Case Manager"
              value={formik.values.caseManager}
              onChange={formik.handleChange}
              error={
                formik.touched.caseManager && Boolean(formik.errors.caseManager)
              }
              helperText={
                formik.touched.caseManager && formik.errors.caseManager
              }
              select
              fullWidth
              size="small"
            >
              <MenuItem value="Manager1">Manager1</MenuItem>
              <MenuItem value="Manager2">Manager2</MenuItem>
            </TextField>

            <TextField
              id="appointmentDateFrom"
              name="appointmentDateFrom"
              label="Appointment Date From"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formik.values.appointmentDateFrom}
              onChange={formik.handleChange}
              fullWidth
              size="small"
            />

            <TextField
              id="appointmentDateTo"
              name="appointmentDateTo"
              label="Appointment Date To"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formik.values.appointmentDateTo}
              onChange={formik.handleChange}
              fullWidth
              size="small"
            />

            <TextField
              id="timeslotType"
              name="timeslotType"
              label="TimeSlot Type"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={formik.values.timeslotType}
              onChange={formik.handleChange}
              fullWidth
              size="small"
            />
            <TextField
              id="timeslotUsage"
              name="timeslotUsage"
              label="TimeSlot Usage"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={formik.values.timeslotUsage}
              onChange={formik.handleChange}
              fullWidth
              size="small"
            />
            <TextField
              id="meetingStatus"
              name="meetingStatus"
              label="Meeting Status"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formik.values.meetingStatus}
              onChange={formik.handleChange}
              fullWidth
              size="small"
            />

            <FormControlLabel
              control={
                <Checkbox
                  id="beyond21Days"
                  name="beyond21Days"
                  checked={formik.values.beyond21Days}
                  onChange={formik.handleChange}
                />
              }
              label="Beyond 21 days"
            />

            <FormControlLabel
              control={
                <Checkbox
                  id="hiPriority"
                  name="hiPriority"
                  checked={formik.values.hiPriority}
                  onChange={formik.handleChange}
                />
              }
              label="High Priority"
            />

<TextField
              id="scheduledBy"
              name="scheduledBy"
              label="Scheduled By"
              value={formik.values.scheduledBy}
              onChange={formik.handleChange}
              error={
                formik.touched.scheduledBy && Boolean(formik.errors.scheduledBy)
              }
              helperText={
                formik.touched.scheduledBy && formik.errors.scheduledBy
              }
              select
              fullWidth
              size="small"
            >
              <MenuItem value="Scheduler1">Scheduler1</MenuItem>
              <MenuItem value="Scheduler2">Scheduler1</MenuItem>
            </TextField>

            <TextField
              id="claimantName"
              name="claimantName"
              label="Claimant Name"
              value={formik.values.claimantName}
              onChange={formik.handleChange}
              fullWidth
              size="small"
            />

            <TextField
              id="ssn"
              name="ssn"
              label="Last 4 of SSN"
              value={formik.values.ssn}
              onChange={formik.handleChange}
              fullWidth
              size="small"
            />

            <Stack direction="row" spacing={2}>
              <TextField
                id="byeFrom"
                name="byeFrom"
                label="BYE From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.byeFrom}
                onChange={formik.handleChange}
                fullWidth
                size="small"
              />
              <TextField
                id="byeTo"
                name="byeTo"
                label="BYE To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.byeTo}
                onChange={formik.handleChange}
                fullWidth
                size="small"
              />
            </Stack>

            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ alignSelf: "flex-end", width: "50%" }}
            >
              Search
            </Button>
          </Stack>
        </form>
      </Box>

      {/* Right Panel */}
      <Box width="65%" bgcolor="#f1f3f8" p={2}>
        <Typography variant="h6" gutterBottom>
          Appointment Details
        </Typography>
        <Stack spacing={2}>
          <Typography>
            Local Office | Case Manager | Event Date & Time | Type | Usage |
            Status | Claimant | BYE | Indicators
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export default Appointments;

