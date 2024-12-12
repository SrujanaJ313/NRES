import React, { useState, useEffect } from "react";
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
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { STATES } from "../../../helpers/Constants";
import { returnedToWorkSaveURL } from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import { Label } from "@mui/icons-material";
import { useSnackbar } from "../../../context/SnackbarContext";
import { returnToWorkEditModeURL } from "../../../helpers/Urls";
import dayjs from "dayjs";


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
  const showSnackbar = useSnackbar();

  const [errors, setErrors] = useState([]);
  const states = STATES;
  const [initialValues, setInitialValues] = useState({
    employmentStartDt: null,
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
  });
  const [isViewMode, setIsViewMode] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    validate: (values) => returnToWorkValidationsSchema(values),
    enableReinitialize: true,
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
      return;
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
        showSnackbar("Your request has been recorded successfully.", 5000);
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

  useEffect(() => {
    async function fetchReturnToWorkEditModeData() {
      try {
        const data =
          process.env.REACT_APP_ENV === "mockserver"
            ? await client.get(returnToWorkEditModeURL)
            : await client.get(`${returnToWorkEditModeURL}${event.id}`);
        if(data.rtwMode === "View"){
          setInitialValues({
            empName: data.empName || "",
            employmentStartDt:dayjs(data.employmentStartDt),
            exactJobTitle: data.exactJobTitle || "",
            partFullTimeInd: data.partFullTimeInd || "",
            hourlyPayRate: data.hourlyPayRate || "",
            empWorkLocState: data.empWorkLocState || "",
            empWorkLocCity: data.empWorkLocCity || "",
            workMode: data.workMode || "",
            jms890Ind: data.jms890Ind || "",
            jmsReferralInd: data.jmsReferralInd || "",
            jmsCloseGoalsInd: data.jmsCloseGoalsInd || "",
            jmsCloseIEPInd: data.jmsCloseIEPInd || "",
            jmsCaseNotesInd: data.jmsCaseNotesInd || "",
            jmsResumeOffInd: data.jmsResumeOffInd || "",
            epChecklistUploadInd: data.epChecklistUploadInd || "",
          });
        }
        setIsViewMode(data.rtwMode !== "View");
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `GET:${process.env.REACT_APP_RETURN_TO_WORK_GET}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    }
    fetchReturnToWorkEditModeData();
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2} sx={{ marginTop: "20px" }}>
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
            disabled={isViewMode}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl>
              <DatePicker
                label="*Start Date"
                className="return-to-work-start-date"
                sx={{ width: "160px" }}
                slotProps={{
                  textField: { size: "small" },
                }}
                value={formik.values.employmentStartDt}
                onChange={(date) =>
                  formik.setFieldValue("employmentStartDt", date)
                }
                disabled={isViewMode}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      size="small"
                      variant="outlined"
                      name="employmentStartDt"
                      // error={
                      //   formik.touched.employmentStartDt &&
                      //   Boolean(formik.errors.employmentStartDt)
                      // }
                      // helperText={
                      //   formik.touched.employmentStartDt &&
                      //   formik.errors.employmentStartDt
                      // }
                    />
                  );
                }}
              />
              {formik.touched.employmentStartDt &&
                formik.errors.employmentStartDt && (
                  <FormHelperText error>
                    {formik.errors.employmentStartDt}
                  </FormHelperText>
                )}
            </FormControl>
          </LocalizationProvider>
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
            disabled={isViewMode}
          />
          <FormControl
            fullWidth
            error={
              formik.touched.empWorkLocState &&
              Boolean(formik.errors.empWorkLocState)
            }
          >
            <Autocomplete
              size="small"
              id="state-autocomplete"
              options={states}
              getOptionLabel={(option) => option.id}
              filterOptions={(options, { inputValue }) =>
                options.filter((option) =>
                  option.id.toLowerCase().startsWith(inputValue.toLowerCase())
                )
              }
              value={
                states.find(
                  (option) => option.id === formik.values.empWorkLocState
                ) || null
              }
              onChange={(event, newValue) => {
                formik.setFieldValue(
                  "empWorkLocState",
                  newValue ? newValue.id : ""
                );
              }}
              onBlur={formik.handleBlur}
              sx={{ width: "160px" }}
              onKeyDown={(event) => {
                if (event.key === "Tab") {
                  event.key = "Enter";
                }
              }}
              autoHighlight={true}
              disabled={isViewMode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="*State"
                  variant="outlined"
                  name="empWorkLocState"
                  error={Boolean(
                    formik.touched.empWorkLocState &&
                      formik.errors.empWorkLocState
                  )}
                  helperText={
                    formik.touched.empWorkLocState &&
                    formik.errors.empWorkLocState
                  }
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      color: "black",
                    },
                  }}
                />
              )}
            />

            {formik.touched.empWorkLocState &&
              formik.errors.empWorkLocState && (
                <FormHelperText>{formik.errors.empWorkLocState}</FormHelperText>
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
            disabled={isViewMode}
          />
          <TextField
            label="*Hourly Pay Rate"
            size="small"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{  color:isViewMode?'gray':'' }}>$</Typography>
                </InputAdornment>
              ),
            }}
            sx={{ width: "160px" }}
            name="hourlyPayRate"
            value={formik.values.hourlyPayRate}
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isViewMode}
            // error={
            //   formik.touched.hourlyPayRate &&
            //   Boolean(formik.errors.hourlyPayRate)
            // }
            // helperText={
            //   formik.touched.hourlyPayRate && formik.errors.hourlyPayRate
            // }
          />
          {formik.touched.hourlyPayRate && formik.errors.hourlyPayRate && (
            <FormHelperText error>{formik.errors.hourlyPayRate}</FormHelperText>
          )}
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
                color:isViewMode?'gray':''
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
                disabled={isViewMode}
              />
              <FormControlLabel
                value="P"
                control={<Radio />}
                label="Part time"
                disabled={isViewMode}
              />
            </RadioGroup>
          </FormControl>
          {formik.touched.partFullTimeInd && formik.errors.partFullTimeInd && (
            <FormHelperText error>
              {formik.errors.partFullTimeInd}
            </FormHelperText>
          )}

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
                color:isViewMode?'gray':''
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
                value="5650"
                control={<Radio />}
                label="Onsite"
                disabled={isViewMode}
              />
              <FormControlLabel
                value="5649"
                control={<Radio />}
                label="Remote"
                disabled={isViewMode}
              />
              <FormControlLabel
                value="5651"
                control={<Radio />}
                label="Hybrid"
                disabled={isViewMode}
              />
            </RadioGroup>
          </FormControl>
          {formik.touched.workMode && formik.errors.workMode && (
            <FormHelperText error>{formik.errors.workMode}</FormHelperText>
          )}
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography sx={{ width: "15%", color:isViewMode?'gray':'' }}>Staff notes, if any:</Typography>
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
            disabled={isViewMode}
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
                      disabled={isViewMode}
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
                      disabled={isViewMode}
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
                      disabled={isViewMode}
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
                      disabled={isViewMode}
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
                      disabled={isViewMode}
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
                      disabled={isViewMode}
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
                      disabled={isViewMode}
                      checked={formik.values.epChecklistUploadInd === "Y"}
                      onChange={() =>
                        formik.setFieldValue(
                          "epChecklistUploadInd",
                          formik.values.epChecklistUploadInd === "N" ? "Y" : "N"
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
            // disabled={!isUpdateAccessExist() || isViewMode}
          >
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

export default ReturnedToWork;