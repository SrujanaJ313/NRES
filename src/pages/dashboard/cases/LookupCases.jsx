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
import { caseLookUpValidationSchema } from "../../../helpers/Validation";
import {
  convertISOToMMDDYYYY,
  getMsgsFromErrorCode,
} from "../../../helpers/utils";

import {
  appointmentsLocalOfficeURL,
  appointmentsCaseManagerURL,
  caseStatusURL,
  caseStageURL,
  caseTerminationReasonURL,
  caseLookUpSummaryURL,
} from "../../../helpers/Urls";
import { useSnackbar } from "../../../context/SnackbarContext";

function LookupCases({ setLookUpSummary }) {
  const [errorMessages, setErrorMessages] = useState([]);
  const showSnackbar = useSnackbar();
  const [checkboxStates, setCheckboxStates] = useState({
    officeNumCheckbox: false,
    caseManagerIdCheckbox: false,
    caseStageCheckbox: false,
    caseStatusCheckbox: false,
    rtwDaysRangeCheckbox: false,
    caseScoreRangeCheckbox: false,
    orientationDateCheckbox: false,
    intialAppointmentDateCheckbox: false,
    recentAppointmentDateCheckbox: false,
    terminationReasonCheckbox: false,
    claimantNameCheckbox: false,
    ssnCheckbox: false,
    byeDateCheckbox: false,
  });

  const formik = useFormik({
    initialValues: {
      officeNum: [],
      caseManagerId: "",
      caseStage: [],
      caseStatus: [],
      waitlisted: "N",
      hiPriorityInd: "N",
      rtwDaysMin: "",
      rtwDaysMax: "",
      caseScoreMin: "",
      caseScoreMax: "",
      orientationStartDt: "",
      orientationEndDt: "",
      initialApptStartDt: "",
      initialApptEndDt: "",
      recentApptStartDt: "",
      recentApptEndDt: "",
      terminationReason: [],
      claimantName: "",
      ssn: "",
      clmByeStartDt: "",
      clmByeEndDt: "",
    },
    validationSchema: () => caseLookUpValidationSchema(checkboxStates),
    onSubmit: async (values) => {
      const dateFields = [
        "orientationStartDt",
        "orientationEndDt",
        "initialApptStartDt",
        "initialApptEndDt",
        "recentApptStartDt",
        "recentApptEndDt",
        "clmByeStartDt",
        "clmByeEndDt",
      ];
      const IntegerTypeFields = [
        "rtwDaysMin",
        "rtwDaysMax",
        "caseScoreMin",
        "caseScoreMax",
      ];
      try {
        let payload = {
          pagination: {
            pageNumber: 1,
            pageSize: 10,
            needTotalCount: true,
          },
          sortBy: {
            field: "eventDateTime",
            direction: "ASC",
          },
        };
        for (const key in values) {
          if (
            !values[key] ||
            (Array.isArray(values[key]) && !values[key]?.length) ||
            values[key] === "N"
          ) {
            continue;
          } else if (dateFields.includes(key)) {
            payload[key] = convertISOToMMDDYYYY(values[key]);
          } else if (IntegerTypeFields.includes(key)) {
            payload[key] = Number(values[key]);
          } else {
            payload[key] = values[key];
          }
        }

        if (Object.keys(payload).length === 2) {
          setErrorMessages(["Atleast one field needs to be selected"]);
          return;
        }
        console.log("submited payload-->\n", payload);
        const result = await client.post(caseLookUpSummaryURL, payload);
        setLookUpSummary(result);
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
    caseStageOptions: [],
    caseStatusOptions: [],
    terminationReasonOptions: [],
  });

  const fieldNameUrls = {
    officeNumCheckbox: appointmentsLocalOfficeURL,
    caseManagerIdCheckbox: appointmentsCaseManagerURL,
    caseStageCheckbox: caseStageURL,
    caseStatusCheckbox: caseStatusURL,
    terminationReasonCheckbox: caseTerminationReasonURL,
  };

  const resettableFields = [
    "orientationDate",
    "intialAppointmentDate",
    "recentAppointmentDate",
    "byeDate",
  ];

  const rangeFields = ["caseScoreRange", "rtwDaysRange"];

  const ignoredFields = [
    "orientationDate",
    "intialAppointmentDate",
    "recentAppointmentDate",
    "waitlisted",
    "hiPriorityInd",
    "claimantName",
    "ssn",
    "byeDate",
    "caseScoreRange",
    "rtwDaysRange",
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
          orientationDate: ["orientationStartDt", "orientationEndDt"],
          intialAppointmentDate: ["initialApptStartDt", "initialApptEndDt"],
          recentAppointmentDate: ["recentApptStartDt", "recentApptEndDt"],
          byeDate: ["clmByeStartDt", "clmByeEndDt"],
        };

        dateFieldMap[fieldName]?.forEach((dateField) =>
          formik.setFieldValue(dateField, formik.initialValues[dateField])
        );
        return;
      }

      if (rangeFields.includes(fieldName)) {
        const rangeFieldsMap = {
          rtwDaysRange: ["rtwDaysMin", "rtwDaysMax"],
          caseScoreRange: ["caseScoreMin", "caseScoreMax"],
        };
        rangeFieldsMap[fieldName]?.forEach((rangeField) =>
          formik.setFieldValue(rangeField, formik.initialValues[rangeField])
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

  // console.log("formik errors--->", formik.errors);

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
        Lookup Cases
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={0.5}>
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
            width="87.5%"
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

          <Box
            display="flex"
            marginTop="10px"
            alignItems="center"
            width="87.5%"
          >
            <Checkbox
              checked={checkboxStates.caseStageCheckbox}
              onChange={handleCheckboxChange("caseStage")}
            />
            <TextField
              id="caseStage"
              name="caseStage"
              label="Stage"
              value={formik.values.caseStage}
              onChange={(e) =>
                formik.setFieldValue("caseStage", e.target.value)
              }
              select
              fullWidth
              size="small"
              disabled={!checkboxStates.caseStageCheckbox}
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  selected
                    .map(
                      (caseStageId) =>
                        dropdownOptions.caseStageOptions.find(
                          (cse) => cse.id === caseStageId
                        )?.desc
                    )
                    .join(", "),
              }}
            >
              {dropdownOptions.caseStageOptions.map((cse) => (
                <MenuItem key={cse.id} value={cse.id}>
                  <Checkbox
                    checked={formik.values.caseStage.includes(cse.id)}
                  />
                  <ListItemText primary={cse.desc} />
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {ErrorMessage("caseStage")}

          <Box
            display="flex"
            marginTop="10px"
            alignItems="center"
            width="87.5%"
          >
            <Checkbox
              checked={checkboxStates.caseStatusCheckbox}
              onChange={handleCheckboxChange("caseStatus")}
            />
            <TextField
              id="caseStatus"
              name="caseStatus"
              label="Status"
              value={formik.values.caseStatus}
              onChange={(e) =>
                formik.setFieldValue("caseStatus", e.target.value)
              }
              select
              fullWidth
              size="small"
              disabled={!checkboxStates.caseStatusCheckbox}
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  selected
                    .map(
                      (caseStatusId) =>
                        dropdownOptions.caseStatusOptions.find(
                          (cse) => cse.id === caseStatusId
                        )?.desc
                    )
                    .join(", "),
              }}
            >
              {dropdownOptions.caseStatusOptions.map((cse) => (
                <MenuItem key={cse.id} value={cse.id}>
                  <Checkbox
                    checked={formik.values.caseStatus.includes(cse.id)}
                  />
                  <ListItemText primary={cse.desc} />
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {ErrorMessage("caseStatus")}

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

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={formik.values.waitlisted === "Y"}
              onChange={(event) => {
                formik.setFieldValue(
                  "waitlisted",
                  event.target.checked ? "Y" : "N"
                );
                setErrorMessages([]);
              }}
            />
            <Typography
              sx={{
                color: formik.values.waitlisted === "Y" ? "black" : "gray",
              }}
            >
              Waitlisted
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.rtwDaysRange}
              onChange={handleCheckboxChange("rtwDaysRange")}
            />
            <Stack direction="row" spacing={1} sx={{ width: "80%" }}>
              <TextField
                id="rtwDaysMin"
                name="rtwDaysMin"
                label="RTW days From"
                type="text"
                value={formik.values.rtwDaysMin}
                onChange={(event) => {
                  const newValue = event.target.value;
                  if (/^\d*$/.test(newValue)) {
                    formik.setFieldValue("rtwDaysMin", newValue);
                  }
                }}
                inputProps={{
                  inputMode: "numeric",
                  // maxLength: 4,
                  // "aria-label": "SSN",
                }}
                fullWidth
                size="small"
                sx={{ width: "80%" }}
                disabled={!checkboxStates.rtwDaysRangeCheckbox}
              />

              <TextField
                id="rtwDaysMax"
                name="rtwDaysMax"
                label="RTW days To"
                type="text"
                value={formik.values.rtwDaysMax}
                onChange={(event) => {
                  const newValue = event.target.value;
                  if (/^\d*$/.test(newValue)) {
                    formik.setFieldValue("rtwDaysMax", newValue);
                  }
                }}
                inputProps={{
                  inputMode: "numeric",
                  // maxLength: 4,
                  // "aria-label": "SSN",
                }}
                fullWidth
                size="small"
                sx={{ width: "80%" }}
                disabled={!checkboxStates.rtwDaysRangeCheckbox}
              />
            </Stack>
          </Box>
          {ErrorMessage("rtwDaysMax")}

          {/* <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.caseScoreRange}
              onChange={handleCheckboxChange("caseScoreRange")}
            />
            <Stack direction="row" spacing={1} sx={{ width: "80%" }}>
              <TextField
                id="caseScoreMin"
                name="caseScoreMin"
                label="Score range From"
                type="text"
                value={formik.values.caseScoreMin}
                onChange={(event) => {
                  const newValue = event.target.value;
                  if (/^\d*$/.test(newValue)) {
                    formik.setFieldValue("caseScoreMin", newValue);
                  }
                }}
                inputProps={{
                  inputMode: "numeric",
                  // maxLength: 1,
                  // "aria-label": "SSN",
                }}
                fullWidth
                size="small"
                sx={{ width: "80%" }}
                disabled={!checkboxStates.caseScoreRangeCheckbox}
              />

              <TextField
                id="caseScoreMax"
                name="caseScoreMax"
                label="Score range To"
                type="text"
                value={formik.values.caseScoreMax}
                onChange={(event) => {
                  const newValue = event.target.value;
                  if (/^\d*$/.test(newValue)) {
                    formik.setFieldValue("caseScoreMax", newValue);
                  }
                }}
                inputProps={{
                  inputMode: "numeric",
                  // maxLength: 1,
                  // "aria-label": "SSN",
                }}
                fullWidth
                size="small"
                sx={{ width: "80%" }}
                disabled={!checkboxStates.caseScoreRangeCheckbox}
              />
            </Stack>
          </Box> */}
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.caseScoreRange}
              onChange={handleCheckboxChange("caseScoreRange")}
            />
            <Stack direction="row" spacing={1} sx={{ width: "80%" }}>
              <TextField
                id="caseScoreMin"
                name="caseScoreMin"
                label="Score range From"
                type="text"
                value={formik.values.caseScoreMin}
                onChange={(event) => {
                  const newValue = event.target.value;
                  // Allow empty input to clear the field
                  if (
                    newValue === "" ||
                    /^(0(\.\d{0,10})?|1(\.0{0,10})?)$/.test(newValue)
                  ) {
                    formik.setFieldValue("caseScoreMin", newValue);
                  }
                }}
                inputProps={{
                  inputMode: "decimal",
                }}
                fullWidth
                size="small"
                sx={{ width: "80%" }}
                disabled={!checkboxStates.caseScoreRangeCheckbox}
              />

              <TextField
                id="caseScoreMax"
                name="caseScoreMax"
                label="Score range To"
                type="text"
                value={formik.values.caseScoreMax}
                onChange={(event) => {
                  const newValue = event.target.value;
                  // Allow empty input to clear the field
                  if (
                    newValue === "" ||
                    /^(0(\.\d{0,10})?|1(\.0{0,10})?)$/.test(newValue)
                  ) {
                    formik.setFieldValue("caseScoreMax", newValue);
                  }
                }}
                inputProps={{
                  inputMode: "decimal",
                }}
                fullWidth
                size="small"
                sx={{ width: "80%" }}
                disabled={!checkboxStates.caseScoreRangeCheckbox}
              />
            </Stack>
          </Box>
          {ErrorMessage("caseScoreMin")}

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.orientationDate}
              onChange={handleCheckboxChange("orientationDate")}
            />
            <Stack direction="row" spacing={1} sx={{ width: "80%" }}>
              <TextField
                id="orientationStartDt"
                name="orientationStartDt"
                label="Orientation From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.orientationStartDt}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                disabled={!checkboxStates.orientationDateCheckbox}
              />
              <TextField
                id="orientationEndDt"
                name="orientationEndDt"
                label="Orientation To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.orientationEndDt}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                inputProps={{
                  min: formik.values.orientationStartDt,
                }}
                disabled={
                  !checkboxStates.orientationDateCheckbox ||
                  !formik.values.orientationStartDt
                }
              />
            </Stack>
          </Box>
          {ErrorMessage("orientationStartDt")}

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.intialAppointmentDate}
              onChange={handleCheckboxChange("intialAppointmentDate")}
            />
            <Stack direction="row" spacing={1} sx={{ width: "80%" }}>
              <TextField
                id="initialApptStartDt"
                name="initialApptStartDt"
                label="Init Appt From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.initialApptStartDt}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                disabled={!checkboxStates.intialAppointmentDateCheckbox}
              />
              <TextField
                id="initialApptEndDt"
                name="initialApptEndDt"
                label="Init Appt To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.initialApptEndDt}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                inputProps={{
                  min: formik.values.initialApptStartDt,
                }}
                disabled={
                  !checkboxStates.intialAppointmentDateCheckbox ||
                  !formik.values.initialApptStartDt
                }
              />
            </Stack>
          </Box>
          {ErrorMessage("initialApptStartDt")}

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={checkboxStates.recentAppointmentDate}
              onChange={handleCheckboxChange("recentAppointmentDate")}
            />
            <Stack direction="row" spacing={1} sx={{ width: "80%" }}>
              <TextField
                id="recentApptStartDt"
                name="recentApptStartDt"
                label="Most Recent Appt From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.recentApptStartDt}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                disabled={!checkboxStates.recentAppointmentDateCheckbox}
              />
              <TextField
                id="recentApptEndDt"
                name="recentApptEndDt"
                label="Most Recent Appt To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.recentApptEndDt}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                inputProps={{
                  min: formik.values.recentApptStartDt,
                }}
                disabled={
                  !checkboxStates.recentAppointmentDateCheckbox ||
                  !formik.values.recentApptStartDt
                }
              />
            </Stack>
          </Box>
          {ErrorMessage("recentApptStartDt")}

          <Box
            display="flex"
            marginTop="10px"
            alignItems="center"
            width="87.5%"
          >
            <Checkbox
              checked={checkboxStates.terminationReasonCheckbox}
              onChange={handleCheckboxChange("terminationReason")}
            />
            <TextField
              id="terminationReason"
              name="terminationReason"
              label="Termination Reason"
              value={formik.values.terminationReason}
              onChange={(e) =>
                formik.setFieldValue("terminationReason", e.target.value)
              }
              select
              fullWidth
              size="small"
              disabled={!checkboxStates.terminationReasonCheckbox}
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  selected
                    .map(
                      (terminationId) =>
                        dropdownOptions.terminationReasonOptions.find(
                          (tr) => tr.id === terminationId
                        )?.desc
                    )
                    .join(", "),
              }}
            >
              {dropdownOptions.terminationReasonOptions.map((tr) => (
                <MenuItem key={tr.id} value={tr.id}>
                  <Checkbox
                    checked={formik.values.terminationReason.includes(tr.id)}
                  />
                  <ListItemText primary={tr.desc} />
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {ErrorMessage("terminationReason")}

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

export default LookupCases;

