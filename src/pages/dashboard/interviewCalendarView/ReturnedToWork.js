import React, { useState } from "react";
import { useFormik } from "formik";
import {
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  FormHelperText,
  InputLabel,
  FormControl,
  Typography,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { STATES } from "../../../helpers/Constants";
import { returnedToWorkSaveURL } from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import {
  CookieNames,
  getCookieItem,
  isUpdateAccessExist,
} from "../../../utils/cookies";
import {
  returnToWorkValidationsSchema,
  isDateValid,
} from "../../../helpers/Validation";
import { convertISOToMMDDYYYY } from "../../../helpers/utils";
import { getMsgsFromErrorCode } from "../../../helpers/utils";

function ReturnedToWork({ onCancel, event, onSubmitClose }) {
  const [errors, setErrors] = useState([]);
  const states = STATES;

  const formik = useFormik({
    initialValues: {
      employmentStartDt: "",
      empName: "",
      exactJobTitle: "",
      partFullTimeInd: "",
      hourlyPayRate: "",
      empWorkLocState: "",
      empWorkLocCity: "",
      workMode: "",
      staffNotes: "",
      jms890Ind: "N",
      jmsReferralInd: "N",
      jmsCloseGoalsInd: "N",
      jmsCloseIEPInd: "N",
      jmsCaseNotesInd: "N",
      jmsResumeOffInd: "N",
      epChecklistUploadInd: "N",
    },
    validate: (values) => returnToWorkValidationsSchema(values),
    onSubmit: async (values) => {
      let payload = {};
      const isFutureDate = isDateValid(values.employmentStartDt);
      const defaultCheckboxValues = {
        jms890Ind: "N",
        jmsCaseNotesInd: "N",
        jmsCloseGoalsInd: "N",
        jmsCloseIEPInd: "N",
        jmsReferralInd: "N",
        jmsResumeOffInd: "N",
      };
      const employmentStartDt = convertISOToMMDDYYYY(values.employmentStartDt);
      const userId = getCookieItem(CookieNames.USER_ID);

      if (!isFutureDate) {
        payload = {
          ...values,
          employmentStartDt,
          eventId: event.id,
          ...defaultCheckboxValues,
          userId: Number(userId),
          workMode: Number(values.workMode),
        };
      } else {
        payload = {
          ...values,
          employmentStartDt,
          eventId: event.id,
          userId: Number(userId),
          workMode: Number(values.workMode),
        };
      }

      try {
        await client.post(returnedToWorkSaveURL, payload);
        onSubmitClose();
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `POST:${process.env.REACT_APP_RETURNED_TO_WORK_SAVE}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="*Company"
              size="small"
              variant="outlined"
              sx={{ width: "49%" }}
              name="empName"
              value={formik.values.empName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.empName && Boolean(formik.errors.empName)}
              helperText={formik.touched.empName && formik.errors.empName}
            />
            <DatePicker
              label="*Start Date"
              className="return-to-work-start-date"
              sx={{ width: "160px" }}
              value={formik.values.employmentStartDt}
              onChange={(date) =>
                formik.setFieldValue("employmentStartDt", date)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  variant="outlined"
                  error={
                    formik.touched.employmentStartDt &&
                    Boolean(formik.errors.employmentStartDt)
                  }
                  helperText={
                    formik.touched.employmentStartDt &&
                    formik.errors.employmentStartDt
                  }
                />
              )}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="*City"
              size="small"
              variant="outlined"
              name="empWorkLocCity"
              value={formik.values.empWorkLocCity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.empWorkLocCity &&
                Boolean(formik.errors.empWorkLocCity)
              }
              helperText={
                formik.touched.empWorkLocCity && formik.errors.empWorkLocCity
              }
              fullWidth
            />
            <FormControl
              size="small"
              fullWidth
              error={
                formik.touched.empWorkLocState &&
                Boolean(formik.errors.empWorkLocState)
              }
            >
              <InputLabel id="state-dropdown">*State</InputLabel>
              <Select
                label="*State"
                variant="outlined"
                labelId="state-dropdown"
                name="empWorkLocState"
                value={formik.values.empWorkLocState}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                sx={{ width: "160px" }}
              >
                {states.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.id}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.empWorkLocState &&
                formik.errors.empWorkLocState && (
                  <FormHelperText>
                    {formik.errors.empWorkLocState}
                  </FormHelperText>
                )}
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="*Job Title"
              size="small"
              variant="outlined"
              name="exactJobTitle"
              value={formik.values.exactJobTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.exactJobTitle &&
                Boolean(formik.errors.exactJobTitle)
              }
              helperText={
                formik.touched.exactJobTitle && formik.errors.exactJobTitle
              }
              sx={{ width: "49%" }}
            />
            <TextField
              label="*Hourly Pay Rate"
              size="small"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              name="hourlyPayRate"
              value={formik.values.hourlyPayRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.hourlyPayRate &&
                Boolean(formik.errors.hourlyPayRate)
              }
              helperText={
                formik.touched.hourlyPayRate && formik.errors.hourlyPayRate
              }
            />
          </Stack>
          <Stack
            direction="row"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <FormControl
              component="fieldset"
              error={
                formik.touched.partFullTimeInd &&
                Boolean(formik.errors.partFullTimeInd)
              }
              sx={{
                width: "49%",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Typography
                sx={{
                  width: "30%",
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
              {formik.touched.partFullTimeInd &&
                formik.errors.partFullTimeInd && (
                  <FormHelperText>
                    {formik.errors.partFullTimeInd}
                  </FormHelperText>
                )}
            </FormControl>

            <FormControl
              component="fieldset"
              error={formik.touched.workMode && Boolean(formik.errors.workMode)}
              sx={{
                width: "49%",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Typography
                sx={{
                  width: "30%",
                  alignSelf: "center",
                }}
              >
                *Work Mode:
              </Typography>
              <RadioGroup
                row
                name="workMode"
                value={formik.values.workMode}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Onsite"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Remote"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio />}
                  label="Hybrid"
                />
              </RadioGroup>
              {formik.touched.workMode && formik.errors.workMode && (
                <FormHelperText>{formik.errors.workMode}</FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography sx={{ width: "15%" }}>Staff notes, if any:</Typography>
            <TextField
              label="Staff Notes"
              size="small"
              variant="outlined"
              name="staffNotes"
              value={formik.values.staffNotes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              multiline
              rows={4}
            />
          </Stack>
          {isDateValid(formik.values.employmentStartDt) && (
            <Stack
              sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
            >
              <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                <Stack sx={{ width: "50%" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.jms890Ind === "Y"}
                        onChange={() =>
                          formik.setFieldValue(
                            "jms890Ind",
                            formik.values.jms890Ind === "N" ? "Y" : "N"
                          )
                        }
                      />
                    }
                    label="A non-direct placement recorded in JMS"
                  />
                  {formik.errors.jms890Ind && (
                    <FormHelperText error>
                      {formik.errors.jms890Ind}
                    </FormHelperText>
                  )}
                </Stack>
                <Stack sx={{ width: "50%" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.jmsReferralInd === "Y"}
                        onChange={() =>
                          formik.setFieldValue(
                            "jmsReferralInd",
                            formik.values.jmsReferralInd === "N" ? "Y" : "N"
                          )
                        }
                      />
                    }
                    label="JMS referral was recorded in JMS"
                  />
                  {formik.errors.jmsReferralInd && (
                    <FormHelperText error>
                      {formik.errors.jmsReferralInd}
                    </FormHelperText>
                  )}
                </Stack>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                <Stack sx={{ width: "50%" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.jmsCloseGoalsInd === "Y"}
                        onChange={() =>
                          formik.setFieldValue(
                            "jmsCloseGoalsInd",
                            formik.values.jmsCloseGoalsInd === "N" ? "Y" : "N"
                          )
                        }
                      />
                    }
                    label="Goals have been closed in JMS"
                  />
                  {formik.errors.jmsCloseGoalsInd && (
                    <FormHelperText error>
                      {formik.errors.jmsCloseGoalsInd}
                    </FormHelperText>
                  )}
                </Stack>
                <Stack sx={{ width: "50%" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.jmsCloseIEPInd === "Y"}
                        onChange={() =>
                          formik.setFieldValue(
                            "jmsCloseIEPInd",
                            formik.values.jmsCloseIEPInd === "N" ? "Y" : "N"
                          )
                        }
                      />
                    }
                    label="IEP has been closed in JMS"
                  />
                  {formik.errors.jmsCloseIEPInd && (
                    <FormHelperText error>
                      {formik.errors.jmsCloseIEPInd}
                    </FormHelperText>
                  )}
                </Stack>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                <Stack sx={{ width: "50%" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.jmsCaseNotesInd === "Y"}
                        onChange={() =>
                          formik.setFieldValue(
                            "jmsCaseNotesInd",
                            formik.values.jmsCaseNotesInd === "N" ? "Y" : "N"
                          )
                        }
                      />
                    }
                    label="Case notes recorded in JMS"
                  />
                  {formik.errors.jmsCaseNotesInd && (
                    <FormHelperText error>
                      {formik.errors.jmsCaseNotesInd}
                    </FormHelperText>
                  )}
                </Stack>
                <Stack sx={{ width: "50%" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.jmsResumeOffInd === "Y"}
                        onChange={() =>
                          formik.setFieldValue(
                            "jmsResumeOffInd",
                            formik.values.jmsResumeOffInd === "N" ? "Y" : "N"
                          )
                        }
                      />
                    }
                    label="Claimant's resume has been taken offline in JMS"
                  />
                  {formik.errors.jmsResumeOffInd && (
                    <FormHelperText error>
                      {formik.errors.jmsResumeOffInd}
                    </FormHelperText>
                  )}
                </Stack>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                <Stack sx={{ width: "50%" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.epChecklistUploadInd === "Y"}
                        onChange={() =>
                          formik.setFieldValue(
                            "epChecklistUploadInd",
                            formik.values.epChecklistUploadInd === "N"
                              ? "Y"
                              : "N"
                          )
                        }
                      />
                    }
                    label="Copy of EP and Checklist uploaded into JMS"
                  />
                  {formik.errors.epChecklistUploadInd && (
                    <FormHelperText error>
                      {formik.errors.epChecklistUploadInd}
                    </FormHelperText>
                  )}
                </Stack>
              </Stack>
            </Stack>
          )}

          {!!errors?.length && (
            <Stack mt={1} direction="column" useFlexGap flexWrap="wrap">
              {errors.map((x) => (
                <div>
                  <span className="errorMsg">*{x}</span>
                </div>
              ))}
            </Stack>
          )}
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isUpdateAccessExist()}
            >
              Submit
            </Button>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </LocalizationProvider>
  );
}

export default ReturnedToWork;
