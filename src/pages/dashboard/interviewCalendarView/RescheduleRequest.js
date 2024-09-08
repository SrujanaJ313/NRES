import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormHelperText,
  RadioGroup,
  Radio,
} from "@mui/material";
import {
  reschedulingReasonsListURL,
  reschedulingToURL,
  rescheduleSaveURL,
} from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import IssueSubIssueType from "../../../components/issueSubIssueType";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { STATES } from "../../../helpers/Constants";
import InputAdornment from "@mui/material/InputAdornment";
import { CookieNames, getCookieItem } from "../../../utils/cookies";
import { rescheduleValidationSchema } from "../../../helpers/Validation";
import { getMsgsFromErrorCode } from "../../../helpers/utils";

import {
  convertISOToMMDDYYYY,
  convertTimeToHoursMinutes,
} from "../../../helpers/utils";

function RescheduleRequest({ onCancel, event }) {
  const [reasons, setReasons] = useState([{}]);
  const [rescheduleReasons, setRescheduleReasons] = useState([{}]);
  const [errors, setErrors] = useState([]);
  const states = STATES;
  let rescheduleReason = "";

  const formik = useFormik({
    initialValues: {
      rescheduleTo: "",
      mode: {
        selectedPrefMtgModeInPerson: false,
        selectedPrefMtgModeVirtual: false,
      },
      reasonForRescheduling: "",
      lateSchedulingReason: "",
      staffNotes: "",
      appointmentDate: null,
      appointmentTime: null,
      entityCity: null,
      entityState: null,
      entityName: "",
      entityTeleNumber: "",
      // tempSuspendedInd: "",
      partFullTimeInd: "",
      jobTitle: "",
      issues: [
        {
          id: uuidv4(),
          issueType: "",
          subIssueType: "",
          issueStartDate: null,
          issueEndDate: null,
        },
      ],
    },
    validationSchema: (rescheduleReasons, rescheduleReason) =>
      rescheduleValidationSchema(rescheduleReasons, rescheduleReason),
    onSubmit: async (values) => {
      const userId = getCookieItem(CookieNames.USER_ID);
      const selectedPrefMtgModeInPerson =
        values?.mode?.selectedPrefMtgModeInPerson;
      const selectedPrefMtgModeVirtual =
        values?.mode?.selectedPrefMtgModeVirtual;
      const appointmentTime = convertTimeToHoursMinutes(
        values?.appointmentTime
      );
      const appointmentDate = convertISOToMMDDYYYY(values?.appointmentDate);
      const issueDTOList = values.issues.map((issue) => ({
        issueId: issue.issueType.issueId,
        startDt: convertISOToMMDDYYYY(issue.issueStartDate),
        endDt: convertISOToMMDDYYYY(issue.issueEndDate),
      }));
      try {
        const payload = {
          userId: userId,
          oldEventId: event.id,
          newEventId: rescheduleReason.newRsicId,
          selectedPrefMtgModeInPerson: selectedPrefMtgModeInPerson ? "I" : "",
          selectedPrefMtgModeVirtual: selectedPrefMtgModeVirtual ? "V" : "",
          reasonForRescheduling: values.reasonForRescheduling,
          staffNotes: values.staffNotes,
          lateSchedulingReason: values.lateSchedulingReason,
          issueDTOList,
          entityCity: [3159, 3160].includes(values.reasonForRescheduling)
            ? values.entityCity
            : "",
          entityState: [3159, 3160].includes(values.reasonForRescheduling)
            ? values.entityState
            : "",
          entityName: [3163].includes(values.reasonForRescheduling)
            ? values.entityName
            : "",
          entityTeleNumber: [3163].includes(values.reasonForRescheduling)
            ? values.entityTeleNumber
            : "",
          jobTitle: [3163].includes(values.reasonForRescheduling)
            ? values.jobTitle
            : "",
          partFullTimeInd: values.partFullTimeInd,
          appointmentTime,
          appointmentDate,
        };

        await client.post(rescheduleSaveURL, payload);
        onCancel();
      } catch (errorResponse) {
        console.log('errorResponse-->', errorResponse);
        const newErrMsgs = getMsgsFromErrorCode(
          `POST:${process.env.REACT_APP_RESCHEDULE_SAVE}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => {
    async function fetchRescheduleReasonsListData() {
      try {
        const data =
          process.env.REACT_APP_ENV === "mockserver"
            ? await client.get(reschedulingReasonsListURL)
            : await client.get(`${reschedulingReasonsListURL}/526`);
        setReasons(
          data?.map((d) => ({ id: d.constId, name: d.constShortDesc }))
        );
      }   catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(`GET:${process.env.REACT_APP_RESCHEDULING_REASONS_LIST}`,errorResponse)
        setErrors(newErrMsgs)
    }}
    fetchRescheduleReasonsListData();
  }, []);

  useEffect(() => {
    async function fetchRescheduleToListData() {
      try {
        const payload = {
          eventId: event.id,
          meetingModeInperson: formik.values.mode.selectedPrefMtgModeInPerson
            ? "I"
            : "",
          meetingModeVirtual: formik.values.mode.selectedPrefMtgModeVirtual
            ? "V"
            : "",
        };
        const data =
          process.env.REACT_APP_ENV === "mockserver"
            ? await client.get(reschedulingToURL)
            : await client.post(reschedulingToURL, payload);
        setRescheduleReasons(data);
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(`POST:${process.env.REACT_APP_RESCHEDULING_TO}`,errorResponse)
        setErrors(newErrMsgs)
    }}
    fetchRescheduleToListData();
  }, [
    event.id,
    formik.values.mode.selectedPrefMtgModeInPerson,
    formik.values.mode.selectedPrefMtgModeVirtual,
  ]);

  const handleCheckboxChange = (event) => {
    const { checked, name } = event.target;
    if (name === "tempSuspendedInd") {
      formik.setFieldValue("tempSuspendedInd", checked === true ? "Y" : "N");
    } else {
      let selectedModes = { ...formik.values.mode };
      selectedModes[name] = checked;
      formik.setFieldValue("mode", selectedModes);
    }
  };

  rescheduleReason = rescheduleReasons?.find(
    (r) => r.newRsicId === formik.values.rescheduleTo
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        <Stack direction={"column"} spacing={2}>
          <Stack direction={"column"} justifyContent={"space-between"}>
            <FormControl
              sx={{ width: "100%", display: "flex", flexDirection: "row" }}
            >
              <Typography
                sx={{
                  width: "20%",
                  alignSelf: "center",
                }}
              >
                *Preferred Meeting Modes:
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={formik.values.selectedPrefMtgModeInPerson}
                      checked={formik.values.selectedPrefMtgModeInPerson}
                      onChange={handleCheckboxChange}
                      onBlur={formik.handleBlur}
                      name="selectedPrefMtgModeInPerson"
                    />
                  }
                  label="In person"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      value={formik.values.mode.selectedPrefMtgModeVirtual}
                      checked={formik.values.selectedPrefMtgModeVirtual}
                      onChange={handleCheckboxChange}
                      onBlur={formik.handleBlur}
                      disabled={event?.usageDesc === "Initial Appointment"}
                      name="selectedPrefMtgModeVirtual"
                    />
                  }
                  label="Virtual"
                />
              </FormGroup>
              <Typography
                sx={{
                  width: "20%",
                  alignSelf: "center",
                }}
              >
                (choose all that apply)
              </Typography>
            </FormControl>
            {formik.errors.mode && (
              <FormHelperText error>{formik.errors.mode}</FormHelperText>
            )}
            <FormControl size="small" fullWidth>
              <InputLabel id="reschedule-request-dropdown">
                *Reschedule to
              </InputLabel>
              <Select
                label="*Reschedule to"
                value={formik.values.rescheduleTo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="rescheduleTo"
                sx={{ width: "50%" }}
              >
                {rescheduleReasons?.map((reason) => {
                  return (
                    <MenuItem
                      key={reason.newRsicId}
                      value={reason.newRsicId}
                      style={{
                        color: reason.nonComplianceInd === "Y" ? "red" : "",
                      }}
                    >
                      {`${reason?.rsicCalEventDate}, ${reason?.rsicCalEventStartTime}, ${reason?.rsicCalEventStartTime}`}
                    </MenuItem>
                  );
                })}
              </Select>
              {formik.errors.rescheduleTo && (
                <FormHelperText error>
                  {formik.errors.rescheduleTo}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Stack direction={"row"}>
            <FormControl size="small" fullWidth>
              <InputLabel
                id="
              -request-dropdown"
              >
                *Reason for rescheduling
              </InputLabel>
              <Select
                label="*Reason for rescheduling"
                value={formik.values.reasonForRescheduling}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="reasonForRescheduling"
                sx={{ width: "45%" }}
              >
                {reasons.map((reason) => (
                  <MenuItem key={reason.id} value={reason.id}>
                    {reason.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.reasonForRescheduling && (
                <FormHelperText error>
                  {formik.errors.reasonForRescheduling}
                </FormHelperText>
              )}
            </FormControl>
            {/* <FormControl sx={{ width: "55%" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={formik.values.tempSuspendedInd}
                    checked={formik.values.tempSuspendedInd === "Y"}
                    onChange={handleCheckboxChange}
                    onBlur={formik.handleBlur}
                    name="tempSuspendedInd"
                  />
                }
                // label="Placeholder Meeting -do not generate Notice"
              />
              {formik.errors.tempSuspendedInd && (
                <FormHelperText error>
                  {formik.errors.tempSuspendedInd}
                </FormHelperText>
              )}
            </FormControl> */}
          </Stack>
        </Stack>

        {[3159, 3160].includes(formik.values.reasonForRescheduling) ? (
          <>
            <Typography className="label-text" marginTop={"8px !important"}>
              Please provide below details:
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <FormControl style={{ width: "12rem", marginLeft: 10 }}>
                  <DatePicker
                    label="Date*"
                    disablePast
                    slotProps={{
                      textField: { size: "small" },
                    }}
                    value={formik.values.appointmentDate}
                    onChange={(value) =>
                      formik.setFieldValue("appointmentDate", value)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        name="appointmentDate"
                      />
                    )}
                  />
                  {formik.errors.appointmentDate && (
                    <FormHelperText error>
                      {formik.errors.appointmentDate}
                    </FormHelperText>
                  )}
                </FormControl>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormControl style={{ width: "12rem", marginLeft: 10 }}>
                  <TimePicker
                    label="Time*"
                    slotProps={{
                      textField: { size: "small" },
                    }}
                    value={
                      formik.values.staffNotes
                        ? dayjs(formik.values.staffNotes)
                        : null
                    }
                    onChange={(value) =>
                      formik.setFieldValue(
                        "appointmentTime",
                        value ? value.toISOString() : ""
                      )
                    }
                    onBlur={formik.handleBlur}
                    name="appointmentTime"
                    inputFormat="HH:mm"
                    minutesStep={15}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                  {formik.errors.appointmentTime && (
                    <FormHelperText error>
                      {formik.errors.appointmentTime}
                    </FormHelperText>
                  )}
                </FormControl>
              </LocalizationProvider>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl style={{ width: "12rem", marginLeft: 10 }}>
                <TextField
                  label="*City"
                  size="small"
                  variant="outlined"
                  name="entityCity"
                  value={formik.values.entityCity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormHelperText error>
                  {formik.errors.entityCity}
                </FormHelperText>
              </FormControl>

              <FormControl style={{ width: "12rem", marginLeft: 10 }}>
                <InputLabel id="state-dropdown">*State</InputLabel>
                <Select
                  label="*State"
                  variant="outlined"
                  labelId="state-dropdown"
                  name="entityState"
                  value={formik.values.entityState}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="small"
                >
                  {states.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.id}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>
                  {formik.errors.entityState}
                </FormHelperText>
              </FormControl>
            </Stack>
          </>
        ) : null}

        {[3163].includes(formik.values.reasonForRescheduling) ? (
          <>
            <Typography className="label-text" marginTop={"8px !important"}>
              Please provide below details:
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <FormControl style={{ width: "12rem", marginLeft: 10 }}>
                  <DatePicker
                    label="Date*"
                    disablePast
                    slotProps={{
                      textField: { size: "small" },
                    }}
                    value={formik.values.appointmentDate}
                    onChange={formik.handleChange}
                    renderInput={(params) => (
                      <TextField {...params} size="small" variant="outlined" />
                    )}
                    name="appointmentDate"
                  />
                  {formik.errors.appointmentDate && (
                    <FormHelperText error>
                      {formik.errors.appointmentDate}
                    </FormHelperText>
                  )}
                </FormControl>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormControl style={{ width: "12rem", marginLeft: 10 }}>
                  <TimePicker
                    label="Time*"
                    slotProps={{
                      textField: { size: "small" },
                    }}
                    value={
                      formik.values.staffNotes
                        ? dayjs(formik.values.staffNotes)
                        : null
                    }
                    onChange={(value) =>
                      formik.setFieldValue(
                        "appointmentTime",
                        value ? value.toISOString() : ""
                      )
                    }
                    onBlur={formik.handleBlur}
                    name="appointmentTime"
                    inputFormat="HH:mm"
                    minutesStep={15}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                  {formik.errors.appointmentTime && (
                    <FormHelperText error>
                      {formik.errors.appointmentTime}
                    </FormHelperText>
                  )}
                </FormControl>
              </LocalizationProvider>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl style={{ width: "12rem", marginLeft: 10 }}>
                <TextField
                  label="*Employer Name"
                  size="small"
                  variant="outlined"
                  name="entityName"
                  value={formik.values.entityName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.entityName && (
                  <FormHelperText error>
                    {formik.errors.entityName}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl style={{ width: "12rem", marginLeft: 10 }}>
                <TextField
                  label="*Contact Number#"
                  size="small"
                  variant="outlined"
                  name="entityTeleNumber"
                  value={formik.values.entityTeleNumber}
                  onChange={(event) => {
                    const { value } = event.target;
                    if (/^\d{0,10}$/.test(value)) {
                      formik.setFieldValue("entityTeleNumber", value);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+1</InputAdornment>
                    ),
                  }}
                />
                {formik.errors.entityTeleNumber && (
                  <FormHelperText error>
                    {formik.errors.entityTeleNumber}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2}>
              <FormControl style={{ width: "12rem", marginLeft: 10 }}>
                <TextField
                  label="*Job Title"
                  size="small"
                  variant="outlined"
                  name="jobTitle"
                  value={formik.values.jobTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.jobTitle && (
                  <FormHelperText error>
                    {formik.errors.jobTitle}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2}>
              <FormControl
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Typography
                  sx={{
                    width: "15%",
                    alignSelf: "center",
                  }}
                >
                  *Work Schedule:
                </Typography>
                <RadioGroup
                  row
                  name="partFullTimeInd"
                  value={formik.values.partFullTimeInd}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="F"
                    control={<Radio />}
                    label="Full time"
                  />
                  <FormControlLabel
                    value="P"
                    control={<Radio />}
                    label="Part time"
                  />
                </RadioGroup>
                {formik.errors.partFullTimeInd && (
                  <FormHelperText error sx={{ alignSelf: "center" }}>
                    {formik.errors.partFullTimeInd}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
          </>
        ) : null}

        {rescheduleReason?.nonComplianceInd === "Y" && (
          <Stack direction={"column"} spacing={2}>
            <TextField
              name="lateSchedulingReason"
              label="*Reason for Scheduling beyond 21 days"
              size="small"
              value={formik.values.lateSchedulingReason}
              onChange={formik.handleChange}
              variant="outlined"
              multiline
              rows={3}
              fullWidth
              error={
                formik.touched.lateSchedulingReason &&
                Boolean(formik.errors.lateSchedulingReason)
              }
              helperText={
                formik.touched.lateSchedulingReason &&
                formik.errors.lateSchedulingReason
              }
            />
          </Stack>
        )}
        <Stack direction={"column"} spacing={2}>
          <TextField
            name="staffNotes"
            label="Staff Notes, if any"
            size="small"
            value={formik.values.staffNotes}
            onChange={formik.handleChange}
            variant="outlined"
            multiline
            rows={3}
            fullWidth
          />
        </Stack>
        <Typography className="label-text" marginTop={"8px !important"}>
          Create issues, if any, based on the information associated with this
          request:
        </Typography>
        <Stack spacing={2}>
          <IssueSubIssueType formik={formik} />
        </Stack>

        {errors?.length && (
          <Stack mt={1} direction="column" useFlexGap flexWrap="wrap">
            {errors.map((x) => (
                <div>
                  <span className="errorMsg">*{x}</span>
                </div>
              ))}
          </Stack>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

export default RescheduleRequest;
