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
  FormHelperText,
} from "@mui/material";
import client from "../../../helpers/Api";
import { useFormik } from "formik";
import { appointmentsLookUpSummaryURL } from "../../../helpers/Urls";
import { lookUpAppointmentsValidationSchema } from "../../../helpers/Validation";
import {
  convertISOToMMDDYYYY,
  getMsgsFromErrorCode,
} from "../../../helpers/utils";

import {
  appointmentsLocalOfficeURL,
  appointmentsCaseManagerURL,
  appointmentsScheduledByURL,
  appointmentsTimeSlotTypeURL,
  appointmentsTimeUsageURL,
  appointmentsMeetingStatusURL,
} from "../../../helpers/Urls";
import { useSnackbar } from "../../../context/SnackbarContext";

function LookUpAppointments() {
  const [errorMessages, setErrorMessages] = useState([]);
  const showSnackbar = useSnackbar();
  const [checkboxStates, setCheckboxStates] = useState({
    officeNumCheckbox: false,
    caseManagerIdCheckbox: false,
    appointmentDateCheckbox: false,
    timeslotTypeCdCheckbox: false,
    timeslotUsageCdCheckbox: false,
    meetingStatusCdCheckbox: false,
    scheduledByCheckbox: false,
    claimantNameCheckbox: false,
    ssnCheckbox: false,
    byeDateCheckbox: false,
  });

  const formik = useFormik({
    initialValues: {
      officeNum: [],
      caseManagerId: "",
      apptStartDt: "",
      apptEndDt: "",
      timeslotTypeCd: "",
      timeslotUsageCd: "",
      meetingStatusCd: [],
      beyond21DaysInd: "N",
      hiPriorityInd: "N",
      scheduledBy: [],
      claimantName: "",
      ssn: "",
      clmByeStartDt: "",
      clmByeEndDt: "",
    },
    validationSchema: () => lookUpAppointmentsValidationSchema(checkboxStates),
    onSubmit: async (values) => {
      const dateFields = [
        "apptStartDt",
        "apptEndDt",
        "clmByeStartDt",
        "clmByeEndDt",
      ];
      try {
        let payload = {};
        for (const key in values) {
          if (
            !values[key] ||
            (Array.isArray(values[key]) && !values[key]?.length) ||
            values[key] === "N"
          ) {
            continue;
          } else if (dateFields.includes(key)) {
            payload[key] = convertISOToMMDDYYYY(values[key]);
          } else {
            payload[key] = values[key];
          }
        }

        if (!Object.keys(payload).length) {
          setErrorMessages(["Atleast one field needs to be selected"]);
          return;
        }
        console.log("submited payload-->\n", payload);
        await client.post(appointmentsLookUpSummaryURL, payload);
        showSnackbar("Request has been submitted successfully.", 5000);
      } catch (errorResponse) {
        console.log("errorResponse-->\n", errorResponse);
        const newErrMsgs = getMsgsFromErrorCode(
          `POST:${process.env.REACT_APP_APPOINTMENTS_LOOK_UP_SUMMARY}`,
          errorResponse
        );
        setErrorMessages(newErrMsgs);
      }
    },
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    officeNumOptions: [],
    caseManagerIdOptions: [],
    timeslotTypeCdOptions: [],
    timeslotUsageCdOptions: [],
    meetingStatusCdOptions: [],
    scheduledByOptions: [],
  });

  const fieldNameUrls = {
    officeNumCheckbox: appointmentsLocalOfficeURL,
    caseManagerIdCheckbox: appointmentsCaseManagerURL,
    timeslotTypeCdCheckbox: appointmentsTimeSlotTypeURL,
    timeslotUsageCdCheckbox: appointmentsTimeUsageURL,
    meetingStatusCdCheckbox: appointmentsMeetingStatusURL,
    scheduledByCheckbox: appointmentsScheduledByURL,
  };

  const resettableFields = ["appointmentDate", "byeDate"];

  const ignoredFields = [
    "appointmentDate",
    "beyond21DaysInd",
    "hiPriorityInd",
    "claimantName",
    "ssn",
    "byeDate",
  ];

  const handleCheckboxChange = (field) => (event) => {
    handleCheckBoxData(field, event.target.checked);
    setCheckboxStates({
      ...checkboxStates,
      [`${field}Checkbox`]: event.target.checked,
    });
  };

  async function handleCheckBoxData(fieldName, fieldValue) {
    if (!fieldValue) {
      if (resettableFields.includes(fieldName)) {
        const dateFieldMap = {
          appointmentDate: ["apptStartDt", "apptEndDt"],
          byeDate: ["clmByeStartDt", "clmByeEndDt"],
        };

        dateFieldMap[fieldName]?.forEach((dateField) =>
          formik.setFieldValue(dateField, formik.initialValues[dateField])
        );
        return;
      }
      if (`${fieldName}Options` in dropdownOptions) {
        setDropdownOptions({ ...dropdownOptions, [`${fieldName}Options`]: [] });
      }

      formik.setFieldValue(fieldName, formik.initialValues[fieldName]);
      formik.setFieldTouched(fieldName, false);
      return;
    }

    setErrorMessages([]);
    if (ignoredFields.includes(fieldName)) {
      return;
    }
    try {
      const data = await client.get(fieldNameUrls[`${fieldName}Checkbox`]);
      setDropdownOptions({ ...dropdownOptions, [`${fieldName}Options`]: data });
    } catch (errorResponse) {
      console.error("Error in handleCheckBoxData", errorResponse);
    }
  }

  const ErrorMessage = (fieldName) => {
    return (
      <>
        {formik.touched[fieldName] && formik.errors[fieldName] && (
          <span style={{ marginLeft: "10%", marginTop: "0" }}>
            <FormHelperText
              sx={{
                color: "red",
                display: "flex",
                justifyContent: "flex-start",
                width: "60%",
                // backgroundColor: "pink",
              }}
            >
              {formik.errors[fieldName]}
            </FormHelperText>
          </span>
        )}
      </>
    );
  };

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
          <Box display="flex" justifyContent="center">
            {errorMessages.map((x) => (
              <div key={x}>
                <span className="errorMsg">*{x}</span>
              </div>
            ))}
          </Box>
          <Box
            display="flex"
            marginTop="10px"
            alignItems="center"
            width="89.5%"
          >
            <Checkbox
              checked={checkboxStates.officeNumCheckbox}
              onChange={handleCheckboxChange("officeNum")}
            />
            <TextField
              id="officeNum"
              name="officeNum"
              label="Local Office"
              value={formik.values.officeNum}
              onChange={(e) =>
                formik.setFieldValue("officeNum", e.target.value)
              }
              select
              fullWidth
              size="small"
              disabled={!checkboxStates.officeNumCheckbox}
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  selected
                    .map(
                      (officeNum) =>
                        dropdownOptions.officeNumOptions.find(
                          (ofc) => ofc.officeNum === officeNum
                        )?.officeName
                    )
                    .join(", "),
              }}
            >
              {dropdownOptions.officeNumOptions.map((ofc) => (
                <MenuItem key={ofc.officeNum} value={ofc.officeNum}>
                  <Checkbox
                    checked={formik.values.officeNum.includes(ofc.officeNum)}
                  />
                  <ListItemText primary={ofc.officeName} />
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {ErrorMessage("officeNum")}

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.caseManagerIdCheckbox}
              onChange={handleCheckboxChange("caseManagerId")}
            />
            <TextField
              id="caseManagerId"
              name="caseManagerId"
              label="Case Manager"
              value={formik.values.caseManagerId}
              onChange={formik.handleChange}
              select
              fullWidth
              size="small"
              sx={{
                width: "80%",
              }}
              disabled={!checkboxStates.caseManagerIdCheckbox}
            >
              {dropdownOptions?.caseManagerIdOptions?.map((cm) => (
                <MenuItem key={cm?.id} value={cm?.id}>
                  {cm?.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {ErrorMessage("caseManagerId")}

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.appointmentDate}
              onChange={handleCheckboxChange("appointmentDate")}
            />
            <Stack direction="row" spacing={1} sx={{ width: "80%" }}>
              <TextField
                id="apptStartDt"
                name="apptStartDt"
                label="Appointment Date From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.apptStartDt}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                disabled={!checkboxStates.appointmentDateCheckbox}
              />
              <TextField
                id="apptEndDt"
                name="apptEndDt"
                label="Appointment Date To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.apptEndDt}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                inputProps={{
                  min: formik.values.apptStartDt,
                }}
                disabled={
                  !checkboxStates.appointmentDateCheckbox ||
                  !formik.values.apptStartDt
                }
              />
            </Stack>
          </Box>
          {ErrorMessage("apptStartDt")}

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.timeslotTypeCdCheckbox}
              onChange={handleCheckboxChange("timeslotTypeCd")}
            />
            <TextField
              id="timeslotTypeCd"
              name="timeslotTypeCd"
              label="Timeslot Type"
              value={formik.values.timeslotTypeCd}
              onChange={formik.handleChange}
              select
              size="small"
              sx={{
                width: "80%",
              }}
              disabled={!checkboxStates.timeslotTypeCdCheckbox}
            >
              {dropdownOptions?.timeslotTypeCdOptions?.map((tst) => (
                <MenuItem key={tst?.id} value={tst?.id}>
                  {tst?.desc}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {ErrorMessage("timeslotTypeCd")}

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.timeslotUsageCdCheckbox}
              onChange={handleCheckboxChange("timeslotUsageCd")}
            />
            <TextField
              id="timeslotUsageCd"
              name="timeslotUsageCd"
              label="Timeslot Usage"
              value={formik.values.timeslotUsageCd}
              onChange={formik.handleChange}
              select
              fullWidth
              size="small"
              sx={{
                width: "80%",
              }}
              disabled={!checkboxStates.timeslotUsageCdCheckbox}
            >
              {dropdownOptions?.timeslotUsageCdOptions?.map((tsu) => (
                <MenuItem key={tsu?.id} value={tsu?.id}>
                  {tsu?.desc}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {ErrorMessage("timeslotUsageCd")}

          <Box
            display="flex"
            marginTop="10px"
            alignItems="center"
            width="89.5%"
          >
            <Checkbox
              checked={checkboxStates.meetingStatusCdCheckbox}
              onChange={handleCheckboxChange("meetingStatusCd")}
            />
            <TextField
              id="meetingStatusCd"
              name="meetingStatusCd"
              label="Meeting Status"
              value={formik.values.meetingStatusCd}
              onChange={(e) =>
                formik.setFieldValue("meetingStatusCd", e.target.value)
              }
              select
              fullWidth
              size="small"
              disabled={!checkboxStates.meetingStatusCdCheckbox}
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  selected
                    .map(
                      (id) =>
                        dropdownOptions.meetingStatusCdOptions.find(
                          (m) => m.id === id
                        )?.desc
                    )
                    .join(", "),
              }}
            >
              {dropdownOptions?.meetingStatusCdOptions?.map((meeting) => (
                <MenuItem key={meeting.id} value={meeting.id}>
                  <Checkbox
                    checked={formik.values.meetingStatusCd.includes(meeting.id)}
                  />
                  <ListItemText primary={meeting.desc} />
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {ErrorMessage("meetingStatusCd")}

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={formik.values.beyond21DaysInd === "Y"}
              onChange={(event) => {
                formik.setFieldValue(
                  "beyond21DaysInd",
                  event.target.checked ? "Y" : "N"
                );
                setErrorMessages([]);
              }}
            />
            <Typography
              sx={{
                color: formik.values.beyond21DaysInd === "Y" ? "black" : "gray",
              }}
            >
              Beyond 21 days
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={formik.values.hiPriorityInd === "Y"}
              onChange={(event) => {
                formik.setFieldValue(
                  "hiPriorityInd",
                  event.target.checked ? "Y" : "N"
                );
                setErrorMessages([]);
              }}
            />
            <Typography
              sx={{
                color: formik.values.hiPriorityInd === "Y" ? "black" : "gray",
              }}
            >
              HI Priority
            </Typography>
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
          {ErrorMessage("scheduledBy")}

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
          {ErrorMessage("claimantName")}

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
          {ErrorMessage("ssn")}

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.byeDate}
              onChange={handleCheckboxChange("byeDate")}
            />
            <Stack direction="row" spacing={1} sx={{ width: "80%" }}>
              <TextField
                id="clmByeStartDt"
                name="clmByeStartDt"
                label="BYE From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.clmByeStartDt}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                disabled={!checkboxStates.byeDateCheckbox}
              />
              <TextField
                id="clmByeEndDt"
                name="clmByeEndDt"
                label="BYE To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.clmByeEndDt}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                inputProps={{
                  min: formik.values.clmByeStartDt,
                }}
                disabled={
                  !checkboxStates.byeDateCheckbox ||
                  !formik.values.clmByeStartDt
                }
              />
            </Stack>
          </Box>
          {ErrorMessage("clmByeStartDt")}
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

