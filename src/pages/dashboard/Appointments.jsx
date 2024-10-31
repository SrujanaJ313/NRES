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
  Select,
  ListItemText,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import client from "../../helpers/Api";
import {
  appointmentsLocalOfficeURL,
  appointmentsCaseManagerURL,
  appointmentsScheduledByURL,
  appointmentsTimeSlotTypeURL,
  appointmentsTimeUsageURL,
  appointmentsMeetingStatusURL,
} from "../../helpers/Urls";

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
      localOffice: [],
      caseManager: [],
      appointmentDateFrom: null,
      appointmentDateTo: null,
      timeslotType: [],
      timeslotUsage: [],
      meetingStatus: [],
      beyond21Days: false,
      hiPriority: false,
      scheduledBy: [],
      claimantName: "",
      ssn: "",
      byeFrom: null,
      byeTo: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const [checkboxStates, setCheckboxStates] = useState({
    localOfficeCheckbox: false,
    caseManagerCheckbox: false,
    appointmentDateCheckbox: false,
    timeslotTypeCheckbox: false,
    timeslotUsageCheckbox: false,
    meetingStatusCheckbox: false,
    beyond21DaysCheckbox: false,
    hiPriorityCheckbox: false,
    scheduledByCheckbox: false,
    claimantNameCheckbox: false,
    ssnCheckbox: false,
    byeDateCheckbox: false,
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    localOfficeOptions: [],
    caseManagerOptions: [],
    // appointmentDateCheckbox: false,
    // timeslotTypeCheckbox: false,
    // timeslotUsageCheckbox: false,
    meetingStatusOptions: [],
    // beyond21DaysCheckbox: false,
    // hiPriorityCheckbox: false,
    scheduledByOptions: [],
    // claimantNameCheckbox: false,
    // ssnCheckbox: false,
    // byeDateCheckbox: false,
  });

  const fieldNameUrls = {
    localOfficeCheckbox: appointmentsLocalOfficeURL,
    caseManagerCheckbox: appointmentsCaseManagerURL,
    timeslotTypeCheckbox: appointmentsTimeSlotTypeURL,
    timeslotUsageCheckbox: appointmentsTimeUsageURL,
    meetingStatusCheckbox: appointmentsMeetingStatusURL,
    scheduledByCheckbox: appointmentsScheduledByURL,
  };

  const handleCheckboxChange = (field) => (event) => {
    handleCheckBoxData(field, event.target.checked);
    setCheckboxStates({
      ...checkboxStates,
      [`${field}Checkbox`]: event.target.checked,
    });
  };

  async function handleCheckBoxData(fieldName, fieldValue) {
    if (!fieldValue) {
      setDropdownOptions({ ...dropdownOptions, [`${fieldName}Options`]: [] });
      return;
    }
    try {
      const data =
        process.env.REACT_APP_ENV === "mockserver"
          ? await client.get(fieldNameUrls[`${fieldName}Checkbox`])
          : await client.get(fieldNameUrls[`${fieldName}Checkbox`]);
      setDropdownOptions({ ...dropdownOptions, [`${fieldName}Options`]: data });
    } catch (errorResponse) {
      console.error("Error in fetchIssueTypes", errorResponse);
    }
  }
  console.log('formik?.values?.caseManagerOptions',dropdownOptions);

  return (
    <Box display="flex" height="100vh">
      <Box width="35%" bgcolor="#FFFFFF" p={0} borderRight="2px solid #3b5998">
        <Typography
          sx={{
            backgroundColor: "#183084",
            color: "#FFFFFF",
            padding: "10px",
            marginTop: "10px",
          }}
          variant="h6"
          gutterBottom
        >
          Lookup Appointments
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={0.5}>
            <FormControl>
              <Box
                display="flex"
                marginTop="10px"
                alignItems="center"
                gap={0}
                width="89.5%"
              >
                <Checkbox
                  checked={checkboxStates.localOfficeCheckbox}
                  onChange={handleCheckboxChange("localOffice")}
                />
                <InputLabel
                  sx={{ marginLeft: "50px", marginTop: "5px" }}
                  id="localOffice-label"
                >
                  Local Office
                </InputLabel>
                <Select
                  labelId="localOffice-label"
                  id="localOffice"
                  name="localOffice"
                  multiple
                  value={formik.values.localOffice}
                  onChange={(e) =>
                    formik.setFieldValue("localOffice", e.target.value)
                  }
                  input={<OutlinedInput label="Local Office" />}
                  renderValue={(selected) =>
                    selected
                      .map(
                        (officeNum) =>
                          dropdownOptions.localOfficeOptions.find(
                            (ofc) => ofc.officeNum === officeNum
                          )?.officeName
                      )
                      .join(", ")
                  }
                  fullWidth
                  displayEmpty
                  disabled={!checkboxStates.localOfficeCheckbox}
                  sx={{ height: "35px" }}
                >
                  {dropdownOptions.localOfficeOptions.map((ofc) => (
                    <MenuItem key={ofc.officeNum} value={ofc.officeNum}>
                      <Checkbox
                        checked={formik.values.localOffice.includes(
                          ofc.officeNum
                        )}
                      />
                      <ListItemText primary={ofc.officeName} />
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </FormControl>

            <Box display="flex" alignItems="center" gap={0} width={"100%"}>
              <Checkbox
                checked={checkboxStates.caseManagerCheckbox}
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
                }}
                // disabled={!checkboxStates.caseManagerCheckbox}
              >
                {dropdownOptions?.caseManagerOptions?.map((caseManager) => (
                  <MenuItem key={caseManager?.id} value={caseManager?.id}>
                    {caseManager?.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box display="flex" alignItems="center" gap={0}>
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
                  // disabled={!checkboxStates.appointmentDate}
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
                  inputProps={{
                    min: formik.values.appointmentDateFrom,
                  }}
                  // disabled={!checkboxStates.appointmentDate}
                />
              </Stack>
            </Box>

            <Box display="flex" alignItems="center" gap={0}>
              <Checkbox
                checked={checkboxStates.timeslotTypeCheckbox}
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
                }}
                //disabled={!checkboxStates.timeslotType}
              >
                {dropdownOptions?.timeslotTypeOptions?.map((timeslotType) => (
                  <MenuItem key={timeslotType?.id} value={timeslotType?.id}>
                    {timeslotType?.desc}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box display="flex" alignItems="center" gap={0}>
              <Checkbox
                checked={checkboxStates.timeslotUsageCheckbox}
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
                }}
                //disabled={!checkboxStates.timeslotUsage}
              >
                {dropdownOptions?.timeslotUsageOptions?.map((timeslotUsage) => (
                  <MenuItem key={timeslotUsage?.id} value={timeslotUsage?.id}>
                    {timeslotUsage?.desc}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <FormControl>
              <Box
                display="flex"
                marginTop={"10px"}
                alignItems="center"
                gap={0}
                width={"89.5%"}
              >
                <Checkbox
                  checked={checkboxStates.meetingStatusCheckbox}
                  onChange={handleCheckboxChange("meetingStatus")}
                />
                <InputLabel
                  sx={{ marginLeft: "50px", marginTop: "5px" }}
                  id="meetingStatus-label"
                >
                  Meeting Status
                </InputLabel>
                <Select
                  labelId="meetingStatus-label"
                  id="meetingStatus"
                  name="meetingStatus"
                  multiple
                  value={formik.values.meetingStatus}
                  onChange={(e) =>
                    formik.setFieldValue("meetingStatus", e.target.value)
                  }
                  input={<OutlinedInput label="Meeting Status" />}
                  renderValue={(selected) =>
                    selected
                      .map(
                        (id) =>
                          dropdownOptions.meetingStatusOptions.find(
                            (m) => m.id === id
                          )?.desc
                      )
                      .join(", ")
                  }
                  fullWidth
                  displayEmpty
                  disabled={!checkboxStates.meetingStatusCheckbox}
                  sx={{ height: "35px" }}
                >
                  {dropdownOptions?.meetingStatusOptions?.map((meeting) => (
                    <MenuItem key={meeting.id} value={meeting.id}>
                      <Checkbox
                        checked={formik.values.meetingStatus.includes(
                          meeting.id
                        )}
                      />
                      <ListItemText primary={meeting.desc} />
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </FormControl>

            <Box display="flex" alignItems="center" gap={0}>
              <Checkbox
                checked={checkboxStates.beyond21Days}
                onChange={handleCheckboxChange("beyond21Days")}
              />
              <Typography>Beyond 21 days</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={0}>
              <Checkbox
                checked={checkboxStates.hiPriority}
                onChange={handleCheckboxChange("hiPriority")}
              />
              <Typography>HI Priority</Typography>
            </Box>

            <FormControl>
              <Box
                display="flex"
                marginTop={"10px"}
                alignItems="center"
                gap={0}
                width={"89.5%"}
              >
                <Checkbox
                  checked={checkboxStates.scheduledByCheckbox}
                  onChange={handleCheckboxChange("scheduledBy")}
                />
                <InputLabel
                  sx={{ marginLeft: "50px", marginTop: "5px" }}
                  id="scheduledBy-label"
                >
                  Scheduled by
                </InputLabel>
                <Select
                  labelId="scheduledBy-label"
                  id="scheduledBy"
                  name="scheduledBy"
                  multiple
                  value={formik.values.scheduledBy}
                  onChange={(e) =>
                    formik.setFieldValue("scheduledBy", e.target.value)
                  }
                  input={<OutlinedInput label="Scheduled by" />}
                  renderValue={(selected) =>
                    selected
                      .map(
                        (id) =>
                          dropdownOptions.scheduledByOptions.find(
                            (m) => m.id === id
                          )?.desc
                      )
                      .join(", ")
                  }
                  fullWidth
                  displayEmpty
                  disabled={!checkboxStates.scheduledByCheckbox}
                  sx={{ height: "35px" }}
                >
                  {dropdownOptions?.scheduledByOptions?.map((schedule) => (
                    <MenuItem key={schedule.id} value={schedule.id}>
                      <Checkbox
                        checked={formik.values.scheduledBy.includes(
                          schedule.id
                        )}
                      />
                      <ListItemText primary={schedule.desc} />
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </FormControl>

            <Box display="flex" alignItems="center" gap={0}>
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

            <Box display="flex" alignItems="center" gap={0}>
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

            <Box display="flex" alignItems="center" gap={0}>
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
                  inputProps={{
                    min: formik.values.byeFrom,
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

