import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Checkbox,
  Button,
  Typography,
  Stack,
  ListItemText,
} from "@mui/material";
import client from "../../../helpers/Api";

import {
  appointmentsLocalOfficeURL,
  appointmentsCaseManagerURL,
  appointmentsScheduledByURL,
  appointmentsTimeSlotTypeURL,
  appointmentsTimeUsageURL,
  appointmentsMeetingStatusURL,
} from "../../../helpers/Urls";

function LookUpAppointments({ formik }) {
  const [checkboxStates, setCheckboxStates] = useState({
    localOfficeCheckbox: false,
    caseManagerCheckbox: false,
    appointmentDateCheckbox: false,
    timeslotTypeCheckbox: false,
    timeslotUsageCheckbox: false,
    meetingStatusCheckbox: false,
    scheduledByCheckbox: false,
    claimantNameCheckbox: false,
    ssnCheckbox: false,
    byeDateCheckbox: false,
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    localOfficeOptions: [],
    caseManagerOptions: [],
    timeslotTypeOptions: [],
    timeslotUsageOptions: [],
    meetingStatusOptions: [],
    scheduledByOptions: [],
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
    if (
      ![
        "appointmentDate",
        "beyond21Days",
        "hiPriority",
        "claimantName",
        "ssn",
        "byeDate",
      ].includes(field)
    ) {
      handleCheckBoxData(field, event.target.checked);
    }
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
 
  return (
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
        <Stack spacing={1}>
          <Box
            display="flex"
            marginTop="10px"
            alignItems="center"
            width="89.5%"
          >
            <Checkbox
              checked={checkboxStates.localOfficeCheckbox}
              onChange={handleCheckboxChange("localOffice")}
            />
            <TextField
              id="localOffice"
              name="localOffice"
              label="Local Office"
              value={formik.values.localOffice}
              onChange={(e) =>
                formik.setFieldValue("localOffice", e.target.value)
              }
              select
              fullWidth
              size="small"
              disabled={!checkboxStates.localOfficeCheckbox}
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  selected
                    .map(
                      (officeNum) =>
                        dropdownOptions.localOfficeOptions.find(
                          (ofc) => ofc.officeNum === officeNum
                        )?.officeName
                    )
                    .join(", "),
              }}
            >
              {dropdownOptions.localOfficeOptions.map((ofc) => (
                <MenuItem key={ofc.officeNum} value={ofc.officeNum}>
                  <Checkbox
                    checked={formik.values.localOffice.includes(ofc.officeNum)}
                  />
                  <ListItemText primary={ofc.officeName} />
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box display="flex" alignItems="center">
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
              disabled={!checkboxStates.caseManagerCheckbox}
            >
              {dropdownOptions?.caseManagerOptions?.map((caseManager) => (
                <MenuItem key={caseManager?.id} value={caseManager?.id}>
                  {caseManager?.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box display="flex" alignItems="center">
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
                disabled={!checkboxStates.appointmentDateCheckbox}
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
                disabled={!checkboxStates.appointmentDateCheckbox}
              />
            </Stack>
          </Box>

          <Box display="flex" alignItems="center">
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
              size="small"
              sx={{
                width: "80%",
              }}
              disabled={!checkboxStates.timeslotTypeCheckbox}
            >
              {dropdownOptions?.timeslotTypeOptions?.map((timeslotType) => (
                <MenuItem key={timeslotType?.id} value={timeslotType?.id}>
                  {timeslotType?.desc}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box display="flex" alignItems="center">
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
              disabled={!checkboxStates.timeslotUsageCheckbox}
            >
              {dropdownOptions?.timeslotUsageOptions?.map((timeslotUsage) => (
                <MenuItem key={timeslotUsage?.id} value={timeslotUsage?.id}>
                  {timeslotUsage?.desc}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box
            display="flex"
            marginTop="10px"
            alignItems="center"
            width="89.5%"
          >
            <Checkbox
              checked={checkboxStates.meetingStatusCheckbox}
              onChange={handleCheckboxChange("meetingStatus")}
            />
            <TextField
              id="meetingStatus"
              name="meetingStatus"
              label="Meeting Status"
              value={formik.values.meetingStatus}
              onChange={(e) =>
                formik.setFieldValue("meetingStatus", e.target.value)
              }
              select
              fullWidth
              size="small"
              disabled={!checkboxStates.meetingStatusCheckbox}
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  selected
                    .map(
                      (id) =>
                        dropdownOptions.meetingStatusOptions.find(
                          (m) => m.id === id
                        )?.desc
                    )
                    .join(", "),
              }}
            >
              {dropdownOptions?.meetingStatusOptions?.map((meeting) => (
                <MenuItem key={meeting.id} value={meeting.id}>
                  <Checkbox
                    checked={formik.values.meetingStatus.includes(meeting.id)}
                  />
                  <ListItemText primary={meeting.desc} />
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={formik.values.beyond21Days === "Y"}
              onChange={(event) => {
                formik.setFieldValue(
                  "beyond21Days",
                  event.target.checked ? "Y" : "N"
                );
              }}
            />
            <Typography
              sx={{ color: formik.values.beyond21Days === "Y" ? "black" : "gray" }}
            >
              Beyond 21 days
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={formik.values.hiPriority === "Y"}
              onChange={(event) => {
                formik.setFieldValue(
                  "hiPriority",
                  event.target.checked ? "Y" : "N"
                );
              }}
            />
            <Typography sx={{ color: formik.values.hiPriority === "Y" ? "black" : "gray" }}>HI Priority</Typography>
          </Box>

          <Box
            display="flex"
            marginTop="10px"
            alignItems="center"
            width="89.5%"
          >
            <Checkbox
              checked={checkboxStates.scheduledByCheckbox}
              onChange={handleCheckboxChange("scheduledBy")}
            />
            <TextField
              id="scheduledBy"
              name="scheduledBy"
              label="Scheduled by"
              value={formik.values.scheduledBy}
              onChange={(e) =>
                formik.setFieldValue("scheduledBy", e.target.value)
              }
              select
              fullWidth
              size="small"
              disabled={!checkboxStates.scheduledByCheckbox}
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  selected
                    .map(
                      (id) =>
                        dropdownOptions.scheduledByOptions.find(
                          (m) => m.id === id
                        )?.desc
                    )
                    .join(", "),
              }}
            >
              {dropdownOptions?.scheduledByOptions?.map((schedule) => (
                <MenuItem key={schedule.id} value={schedule.id}>
                  <Checkbox
                    checked={formik.values.scheduledBy.includes(schedule.id)}
                  />
                  <ListItemText primary={schedule.desc} />
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box display="flex" alignItems="center">
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
              }}
              disabled={!checkboxStates.claimantNameCheckbox}
            />
          </Box>

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.ssn}
              onChange={handleCheckboxChange("ssn")}
            />
            <TextField
              id="ssn"
              name="ssn"
              label="Last 4 of SSN"
              type="text"
              value={formik.values.ssn}
              onChange={(event) => {
                const newValue = event.target.value;
                if (newValue.length <= 4 && /^\d*$/.test(newValue)) {
                  formik.setFieldValue("ssn", newValue);
                }
              }}
              inputProps={{
                inputMode: "numeric",
                maxLength: 4,
                "aria-label": "SSN",
              }}
              fullWidth
              size="small"
              sx={{ width: "80%" }}
              disabled={!checkboxStates.ssnCheckbox}
            />
          </Box>

          <Box display="flex" alignItems="center">
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
                disabled={!checkboxStates.byeDateCheckbox}
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
                disabled={!checkboxStates.byeDateCheckbox}
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
  );
}

export default LookUpAppointments;

