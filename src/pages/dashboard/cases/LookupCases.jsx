import React, { useState, useEffect } from "react";
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
  genericSortOptionsAlphabetically
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
import ExpandableTableRow from "../appointments/ExpandableTableRow";

function LookupCases({ setLookUpSummary }) {
  const [errorMessages, setErrorMessages] = useState([]);

  const showSnackbar = useSnackbar();

  const onHandleChange = (e) => {
    formik.handleChange(e);
    setErrorMessages([]);
  };

  const formik = useFormik({
    initialValues: {
      officeNum: [],
      caseManagerId: [],
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
    validationSchema: () => caseLookUpValidationSchema(),
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
          setErrorMessages(["At least one field needs to be selected"]);
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
    validateOnChange: false,
    validateOnBlur: false,
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    officeNumOptions: [],
    caseManagerIdOptions: [],
    caseStageOptions: [],
    caseStatusOptions: [],
    terminationReasonOptions: [],
  });

  const onLoadPageFields = {
    officeNum: { url: appointmentsLocalOfficeURL, propertyName: "officeName" },
    caseManagerId: {
      url: appointmentsCaseManagerURL,
      propertyName: "name",
    },
    caseStage: {
      url: caseStageURL,
      propertyName: "desc",
    },
    caseStatus: {
      url: caseStatusURL,
      propertyName: "desc",
    },
    terminationReason: {
      url: caseTerminationReasonURL,
      propertyName: "desc",
    },
  };

  useEffect(() => {
    async function loadData(fieldName) {
      try {
        const { url, propertyName } = onLoadPageFields[fieldName];
        const data = await client.get(url);
        const sortedData =
          fieldName === "caseStage"
            ? data
            : genericSortOptionsAlphabetically(data, propertyName);
        setDropdownOptions((prevOptions) => ({
          ...prevOptions,
          [`${fieldName}Options`]: sortedData,
        }));
      } catch (errorResponse) {
        console.error("Error in loadData for onLoadPage Fields", errorResponse);
      }
    }

    Promise.all(
      Object.keys(onLoadPageFields).map((fieldName) => loadData(fieldName))
    );
  }, []);


  console.log("formik errors--->", formik.errors);

  // console.log('Touched state:', formik.touched);


  const ErrorMessage = (fieldName, styleProps) => {
    return (
      <>
        {formik.touched[fieldName] && formik.errors[fieldName] && (
          <span style={styleProps}>
            <FormHelperText
              sx={{
                color: "red",
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
      <form
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
        style={{ height: "100%" }}
      >
        <Stack
          spacing={0.8}
          sx={{
            height: "calc(100% - 3.2rem)",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
          }}
        >
          <Typography
            sx={{
              color: "#183084",
              marginLeft: "0",
              fontWeight: "bold",
              width: "94%",
              paddingLeft:'15px'
            }}
            variant="h6"
            gutterBottom
          >
            Lookup Cases
          </Typography>

          <Box display="flex" justifyContent="center">
            {errorMessages.map((x) => (
              <div key={x}>
                <span className="errorMsg">*{x}</span>
              </div>
            ))}
          </Box>

          <Box display="flex" justifyContent="center">
            <ExpandableTableRow
              labelName={"Local Office"}
              options={dropdownOptions.officeNumOptions}
              formik={formik}
              fieldName={"officeNum"}
              setErrorMessages={setErrorMessages}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <ExpandableTableRow
              labelName={"Case Manager"}
              options={dropdownOptions.caseManagerIdOptions}
              formik={formik}
              fieldName={"caseManagerId"}
              setErrorMessages={setErrorMessages}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <ExpandableTableRow
              labelName={"Stage"}
              options={dropdownOptions.caseStageOptions}
              formik={formik}
              fieldName={"caseStage"}
              setErrorMessages={setErrorMessages}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <ExpandableTableRow
              labelName={"Status"}
              options={dropdownOptions.caseStatusOptions}
              formik={formik}
              fieldName={"caseStatus"}
              setErrorMessages={setErrorMessages}
            />
          </Box>

          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Checkbox
              sx={{ marginLeft: "0.8rem", padding: "0" }}
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
              sx={{ color: "#183084", fontWeight: "bold", paddingLeft: "5px" }}
            >
              HI Priority
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Checkbox
              sx={{ marginLeft: "0.8rem", padding: "0"  }}
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
              sx={{ color: "#183084", fontWeight: "bold", paddingLeft: "5px" }}
            >
              Waitlisted
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            style={{ marginTop: "10px" }}
          >
            <Stack direction="row" spacing={1} sx={{ width: "94%" }}>
              <TextField
                id="rtwDaysMin"
                name="rtwDaysMin"
                label="RTW days From"
                type="text"
                value={formik.values.rtwDaysMin}
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  let newValue = event.target.value;
                  if (/^\d{1,3}$/.test(newValue) && parseInt(newValue) <= 365) {
                    formik.setFieldValue("rtwDaysMin", newValue);
                  } else if (newValue === "") {
                    formik.setFieldValue("rtwDaysMin", "");
                  }
                }}
                inputProps={{
                  inputMode: "numeric",
                  maxLength: 3,
                }}
                fullWidth
                size="small"
                sx={{
                  width: "80%",
                  "& .MuiInputLabel-root": {
                    color: "#183084",
                    fontWeight: "bold",
                  },
                }}
              />

              <TextField
                id="rtwDaysMax"
                name="rtwDaysMax"
                label="RTW days To"
                type="text"
                value={formik.values.rtwDaysMax}
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  let newValue = event.target.value;
                  if (/^\d{1,3}$/.test(newValue) && parseInt(newValue) <= 365) {
                    formik.setFieldValue("rtwDaysMax", newValue);
                  } else if (newValue === "") {
                    formik.setFieldValue("rtwDaysMax", "");
                  }
                }}
                inputProps={{
                  inputMode: "numeric",
                  maxLength: 3,
                }}
                fullWidth
                size="small"
                sx={{
                  width: "80%",
                  "& .MuiInputLabel-root": {
                    color: "#183084",
                    fontWeight: "bold",
                  },
                }}
              />
            </Stack>
          </Box>
          {ErrorMessage("rtwDaysMax", {
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "5px",
          })}

          <Box
            display="flex"
            justifyContent="center"
            style={{ marginTop: "10px" }}
          >
            <Stack direction="row" spacing={1} sx={{ width: "94%" }}>
              <TextField
                id="caseScoreMin"
                name="caseScoreMin"
                label="Score range From"
                type="text"
                value={formik.values.caseScoreMin}
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  const newValue = event.target.value;
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
                sx={{
                  width: "80%",
                  "& .MuiInputLabel-root": {
                    color: "#183084",
                    fontWeight: "bold",
                  },
                }}
              />

              <TextField
                id="caseScoreMax"
                name="caseScoreMax"
                label="Score range To"
                type="text"
                value={formik.values.caseScoreMax}
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  const newValue = event.target.value;
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
                sx={{
                  width: "80%",
                  "& .MuiInputLabel-root": {
                    color: "#183084",
                    fontWeight: "bold",
                  },
                }}
              />
            </Stack>
          </Box>
          {ErrorMessage("caseScoreMax",{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "5px",
          })}

          <Box
            display="flex"
            justifyContent="center"
            style={{ marginTop: "10px" }}
          >
            <Stack direction="row" spacing={1} sx={{ width: "94%" }}>
              <TextField
                id="orientationStartDt"
                name="orientationStartDt"
                label="Orientation From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.orientationStartDt}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#183084",
                    fontWeight: "bold",
                  },
                }}
              />
              <TextField
                id="orientationEndDt"
                name="orientationEndDt"
                label="Orientation To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.orientationEndDt}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                inputProps={{
                  min: formik.values.orientationStartDt,
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: formik.values.orientationStartDt ? "#183084" : "gray",
                    fontWeight: "bold",
                  },
                }}
                disabled={!formik.values.orientationStartDt}
              />
            </Stack>
          </Box>
          {ErrorMessage("orientationEndDt", {
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "5px",
          })}

          <Box
            display="flex"
            justifyContent="center"
            style={{ marginTop: "10px" }}
          >
            <Stack direction="row" spacing={1} sx={{ width: "94%" }}>
              <TextField
                id="initialApptStartDt"
                name="initialApptStartDt"
                label="Init Appt From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.initialApptStartDt}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#183084",
                    fontWeight: "bold",
                  },
                }}
              />
              <TextField
                id="initialApptEndDt"
                name="initialApptEndDt"
                label="Init Appt To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.initialApptEndDt}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                inputProps={{
                  min: formik.values.initialApptStartDt,
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: formik.values.initialApptStartDt ? "#183084" : "gray",
                    fontWeight: "bold",
                  },
                }}
                disabled={!formik.values.initialApptStartDt}
              />
            </Stack>
          </Box>
          {ErrorMessage("initialApptEndDt", {
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "5px",
          })}

          <Box
            display="flex"
            justifyContent="center"
            style={{ marginTop: "10px" }}
          >
            <Stack direction="row" spacing={1} sx={{ width: "94%" }}>
              <TextField
                id="recentApptStartDt"
                name="recentApptStartDt"
                label="Most Recent Appt From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.recentApptStartDt}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#183084",
                    fontWeight: "bold",
                  },
                }}
              />
              <TextField
                id="recentApptEndDt"
                name="recentApptEndDt"
                label="Most Recent Appt To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.recentApptEndDt}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                inputProps={{
                  min: formik.values.recentApptStartDt,
                }}
                disabled={!formik.values.recentApptStartDt}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: formik.values.recentApptStartDt ? "#183084" : "gray",
                    fontWeight: 'bold'
                  },
                }}
              />
            </Stack>
          </Box>
          {ErrorMessage("recentApptEndDt", {
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "5px",
          })}

          <Box display="flex" justifyContent="center">
            <ExpandableTableRow
              labelName={"Termination Reason"}
              options={dropdownOptions.terminationReasonOptions}
              formik={formik}
              fieldName={"terminationReason"}
              setErrorMessages={setErrorMessages}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <TextField
              id="claimantName"
              name="claimantName"
              label="Claimant name"
              value={formik.values.claimantName}
              onChange={onHandleChange}
              fullWidth
              size="small"
              sx={{
                width: "94%",
                "& .MuiInputLabel-root": {
                  color: "#183084",
                  fontWeight: "bold",
                },
              }}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <TextField
              id="ssn"
              name="ssn"
              label="Last 4 of SSN"
              type="text"
              value={formik.values.ssn}
              onBlur={formik.handleBlur}
              onChange={(event) => {
                const newValue = event.target.value;
                if (newValue.length <= 4 && /^\d*$/.test(newValue)) {
                  formik.setFieldValue("ssn", newValue);
                }
                setErrorMessages([]);
              }}
              inputProps={{
                inputMode: "numeric",
                maxLength: 4,
                "aria-label": "SSN",
              }}
              fullWidth
              size="small"
              sx={{
                width: "94%",
                "& .MuiInputLabel-root": {
                  color: "#183084",
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
          {ErrorMessage("ssn", { marginLeft: "5%" })}
          <Box display="flex" justifyContent="center">
            <Stack direction="row" spacing={1.5} sx={{ width: "94%" }}>
              <TextField
                id="clmByeStartDt"
                name="clmByeStartDt"
                label="BYE From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.clmByeStartDt}
                onChange={onHandleChange}
                onBlur={formik.handleBlur}
                size="small"
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#183084",
                    fontWeight: "bold",
                  },
                }}
              />
              <TextField
                id="clmByeEndDt"
                name="clmByeEndDt"
                label="BYE To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.clmByeEndDt}
                onBlur={formik.handleBlur}
                onChange={onHandleChange}
                size="small"
                fullWidth
                inputProps={{
                  min: formik.values.clmByeStartDt,
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: formik.values.clmByeStartDt ? "#183084" : "gray",
                  },
                }}
                disabled={!formik.values.clmByeStartDt}
              />
            </Stack>
          </Box>
          {ErrorMessage("clmByeEndDt", {
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "5px",
          })}
        </Stack>
        <Stack display={"flex"} flexDirection={"row-reverse"}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            width={"50%"}
            padding={"10px 0px"}
          >
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ alignSelf: "center", width: "15%" }}
            >
              Search
            </Button>
          </Box>

          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            width={"50%"}
            padding={"10px 0px"}
          >
            <Button
              color="primary"
              variant="contained"
              sx={{ alignSelf: "center", width: "15%" }}
              type="reset"
            >
              Clear
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}

export default LookupCases;

