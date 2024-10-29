import React, { useState } from "react";
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
  CircularProgress,
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

  const [checkboxStates, setCheckboxStates] = useState({
    localOffice: false,
    caseManager: false,
    appointmentDate: false,
    timeslotType: false,
    timeslotUsage: false,
    meetingStatus: false,
    beyond21Days: false,
    hiPriority: false,
    scheduledBy: false,
    claimantName: false,
    ssn: false,
    byeDate: false,
  });

  const handleCheckboxChange = (field) => (event) => {
    setCheckboxStates({ ...checkboxStates, [field]: event.target.checked });
  };

  return (
    <Box display="flex" height="100vh">
      <Box width="35%" bgcolor="#FFFFFF" p={0} borderRight="2px solid #3b5998">
        <Typography sx={{backgroundColor:"#183084", color:"#FFFFFF", padding:"10px"}} variant="h6" gutterBottom>
          Lookup Appointments
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.localOffice}
                onChange={handleCheckboxChange("localOffice")}
              />
              <TextField
                id="localOffice"
                name="localOffice"
                label="Local Office"
                value={formik.values.localOffice}
                onChange={formik.handleChange}
                select
                fullWidth
                size="small"
                sx={{
                  width: "80%",
                  // backgroundColor: checkboxStates.localOffice
                  //   ? "white"
                  //   : "lightgrey",
                }}
                //disabled={!checkboxStates.localOffice}
              >
                <MenuItem value="Office1">Office1</MenuItem>
                <MenuItem value="Office2">Office2</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.caseManager}
                onChange={handleCheckboxChange("caseManager")}
              />
              <TextField
                id="caseManager"
                name="caseManager"
                label="Case Manager"
                value={formik.values.caseManager}
                onChange={formik.handleChange}
                select
                fullWidth
                size="small"
                sx={{
                  width: "80%",
                  // backgroundColor: checkboxStates.caseManager
                  //   ? "white"
                  //   : "lightgrey",
                }}
                //disabled={!checkboxStates.caseManager}
              >
                <MenuItem value="Manager1">Manager1</MenuItem>
                <MenuItem value="Manager2">Manager2</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.appointmentDate}
                onChange={handleCheckboxChange("appointmentDate")}
              />
              <Stack direction="row" spacing={1} sx={{ width: "80%" }}>
                <TextField
                  id="appointmentDateFrom"
                  name="appointmentDateFrom"
                  label="Appointment Date From"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.appointmentDateFrom}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                  sx={{
                    // backgroundColor: checkboxStates.appointmentDate
                    //   ? "white"
                    //   : "lightgrey",
                  }}
                  //disabled={!checkboxStates.appointmentDate}
                />
                <TextField
                  id="appointmentDateTo"
                  name="appointmentDateTo"
                  label="Appointment Date To"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.appointmentDateTo}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                  sx={{
                    // backgroundColor: checkboxStates.appointmentDate
                    //   ? "white"
                    //   : "lightgrey",
                  }}
                  //disabled={!checkboxStates.appointmentDate}
                />
              </Stack>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.timeslotType}
                onChange={handleCheckboxChange("timeslotType")}
              />
              <TextField
                id="timeslotType"
                name="timeslotType"
                label="Timeslot Type"
                value={formik.values.timeslotType}
                onChange={formik.handleChange}
                select
                fullWidth
                size="small"
                sx={{
                  width: "80%",
                  // backgroundColor: checkboxStates.timeslotType
                  //   ? "white"
                  //   : "lightgrey",
                }}
                //disabled={!checkboxStates.timeslotType}
              >
                <MenuItem value="Type1">Type1</MenuItem>
                <MenuItem value="Type2">Type2</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.timeslotUsage}
                onChange={handleCheckboxChange("timeslotUsage")}
              />
              <TextField
                id="timeslotUsage"
                name="timeslotUsage"
                label="Timeslot Usage"
                value={formik.values.timeslotUsage}
                onChange={formik.handleChange}
                select
                fullWidth
                size="small"
                sx={{
                  width: "80%",
                  // backgroundColor: checkboxStates.timeslotUsage
                  //   ? "white"
                  //   : "lightgrey",
                }}
                //disabled={!checkboxStates.timeslotUsage}
              >
                <MenuItem value="Type1">Type1</MenuItem>
                <MenuItem value="Type2">Type2</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.meetingStatus}
                onChange={handleCheckboxChange("meetingStatus")}
              />
              <TextField
                id="meetingStatus"
                name="meetingStatus"
                label="Meeting Status"
                value={formik.values.meetingStatus}
                onChange={formik.handleChange}
                select
                fullWidth
                size="small"
                sx={{
                  width: "80%",
                  // backgroundColor: checkboxStates.meetingStatus
                  //   ? "white"
                  //   : "lightgrey",
                }}
                //disabled={!checkboxStates.meetingStatus}
              >
                <MenuItem value="Type1">Type1</MenuItem>
                <MenuItem value="Type2">Type2</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.beyond21Days}
                onChange={handleCheckboxChange("beyond21Days")}
              />
              <Typography>Beyond 21 days</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.hiPriority}
                onChange={handleCheckboxChange("hiPriority")}
              />
              <Typography>HI Priority</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.scheduledBy}
                onChange={handleCheckboxChange("scheduledBy")}
              />
              <TextField
                id="scheduledBy"
                name="scheduledBy"
                label="Scheduled by "
                value={formik.values.scheduledBy}
                onChange={formik.handleChange}
                select
                fullWidth
                size="small"
                sx={{
                  width: "80%",
                  // backgroundColor: checkboxStates.scheduledBy
                  //   ? "white"
                  //   : "lightgrey",
                }}
                //disabled={!checkboxStates.scheduledBy}
              >
                <MenuItem value="Type1">Type1</MenuItem>
                <MenuItem value="Type2">Type2</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.claimantName}
                onChange={handleCheckboxChange("claimantName")}
              />
              <TextField
                id="claimantName"
                name="claimantName"
                label="Claimant name"
                value={formik.values.claimantName}
                onChange={formik.handleChange}
                fullWidth
                size="small"
                sx={{
                  width: "80%",
                  // backgroundColor: checkboxStates.claimantName
                  //   ? "white"
                  //   : "lightgrey",
                }}
                //disabled={!checkboxStates.claimantName}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.ssn}
                onChange={handleCheckboxChange("claimantName")}
              />
              <TextField
                id="ssn"
                name="ssn"
                label="Last 4 of SSN"
                value={formik.values.ssn}
                onChange={formik.handleChange}
                fullWidth
                size="small"
                sx={{
                  width: "80%",
                  // backgroundColor: checkboxStates.ssn ? "white" : "lightgrey",
                }}
                //disabled={!checkboxStates.ssn}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                checked={checkboxStates.byeDate}
                onChange={handleCheckboxChange("byeDate")}
              />
              <Stack direction="row" spacing={1} sx={{ width: "80%" }}>
                <TextField
                  id="byeFrom"
                  name="byeFrom"
                  label="BYE From"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.byeFrom}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                  sx={{
                    // backgroundColor: checkboxStates.byeDate
                    //   ? "white"
                    //   : "lightgrey",
                  }}
                  //disabled={!checkboxStates.byeDate}
                />
                <TextField
                  id="byeTo"
                  name="byeTo"
                  label="BYE To"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.byeTo}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                  sx={{
                    // backgroundColor: checkboxStates.byeDate
                    //   ? "white"
                    //   : "lightgrey",
                  }}
                  //disabled={!checkboxStates.byeDate}
                />
              </Stack>
            </Box>
            
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ alignSelf: "center", width: "50%" }}
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
        {/* Content for the right panel */}
      </Box>
    </Box>
  );
}

export default Appointments;

