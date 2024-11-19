import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Checkbox,
  Button,
  Typography,
  Stack,
  FormHelperText,
} from "@mui/material";
import client from "../../../helpers/Api";
import { useFormik } from "formik";
import { appointmentsLookUpSummaryURL } from "../../../helpers/Urls";
// import { lookUpAppointmentsValidationSchema } from "../../../helpers/Validation";
import {
  convertISOToMMDDYYYY,
  getMsgsFromErrorCode,
  genericSortOptionsAlphabetically,
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
import ExpandableTableRow from "./ExpandableTableRow";

function LookUpAppointments({ setLookUpSummary }) {
  const showSnackbar = useSnackbar();
  const [errorMessages, setErrorMessages] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState({
    officeNumOptions: [],
    caseManagerIdOptions: [],
    timeslotTypeCdOptions: [],
    timeslotUsageCdOptions: [],
    meetingStatusCdOptions: [],
    scheduledByOptions: [],
  });
  const onLoadPageFields = {
    officeNum: { url: appointmentsLocalOfficeURL, propertyName: "officeName" },
    caseManagerId: {
      url: appointmentsCaseManagerURL,
      propertyName: "name",
    },
    timeslotTypeCd: {
      url: appointmentsTimeSlotTypeURL,
      propertyName: "desc",
    },
    timeslotUsageCd: {
      url: appointmentsTimeUsageURL,
      propertyName: "desc",
    },
    meetingStatusCd: {
      url: appointmentsMeetingStatusURL,
      propertyName: "desc",
    },
    scheduledBy: { url: appointmentsScheduledByURL, propertyName: "desc" },
  };

  useEffect(() => {
    async function loadData(fieldName) {
      try {
        const { url, propertyName } = onLoadPageFields[fieldName];
        const data = await client.get(url);
        const sortedData = genericSortOptionsAlphabetically(data, propertyName);
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
    // validationSchema: () => lookUpAppointmentsValidationSchema(checkboxStates),
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
        return;
        const result = await client.post(appointmentsLookUpSummaryURL, payload);
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

  // const ErrorMessage = (fieldName) => {
  //   return (
  //     <>
  //       {formik.touched[fieldName] && formik.errors[fieldName] && (
  //         <span style={{ marginLeft: "10%" }}>
  //           <FormHelperText
  //             sx={{
  //               color: "red",
  //               display: "flex",
  //               justifyContent: "flex-start",
  //               width: "60%",
  //             }}
  //           >
  //             {formik.errors[fieldName]}
  //           </FormHelperText>
  //         </span>
  //       )}
  //     </>
  //   );
  // };

  const onHandleChange = (e) => {
    formik.handleChange(e);
    setErrorMessages([]);
  };

  return (
    <Box width="35%" bgcolor="#FFFFFF" borderRight="2px solid #3b5998">
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
        <Stack
          spacing={1.2}
          sx={{
            height: "80vh",
            overflowY: "auto",
          }}
        >
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
            justifyContent="center"
          >
            <ExpandableTableRow
              accordianLabelName={"Local Office"}
              options={dropdownOptions.officeNumOptions}
              formik={formik}
              fieldName={"officeNum"}
              setErrorMessages={setErrorMessages}
            />
          </Box>
          {/* {ErrorMessage("officeNum")} */}

          <Box display="flex" justifyContent="center">
            <TextField
              id="caseManagerId"
              name="caseManagerId"
              label="Case Manager"
              value={formik.values.caseManagerId}
              onChange={onHandleChange}
              select
              fullWidth
              size="small"
              sx={{
                width: "90%",
                "& .MuiInputLabel-root": {
                  color: "#183084",
                },
              }}
            >
              {dropdownOptions?.caseManagerIdOptions?.map((cm) => (
                <MenuItem key={cm?.id} value={cm?.id}>
                  {cm?.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {/* {ErrorMessage("caseManagerId")} */}

          <Box display="flex" justifyContent="center">
            <Stack direction="row" spacing={1} sx={{ width: "90%" }}>
              <TextField
                id="apptStartDt"
                name="apptStartDt"
                label="Appointment Date From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.apptStartDt}
                onChange={onHandleChange}
                size="small"
                fullWidth
                
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#183084",
                  },
                }}
              />
              <TextField
                id="apptEndDt"
                name="apptEndDt"
                label="Appointment Date To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.apptEndDt}
                onChange={onHandleChange}
                size="small"
                fullWidth
                inputProps={{
                  min: formik.values.apptStartDt,
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: formik.values.apptStartDt ? "#183084" : "gray",
                  },
                }}
                disabled={!formik.values.apptStartDt}
              />
            </Stack>
          </Box>
          {/* {ErrorMessage("apptStartDt")} */}

          <Box display="flex" justifyContent="center">
            <TextField
              id="timeslotTypeCd"
              name="timeslotTypeCd"
              label="Timeslot Type"
              value={formik.values.timeslotTypeCd}
              onChange={onHandleChange}
              select
              size="small"
              sx={{
                width: "90%",
                "& .MuiInputLabel-root": {
                  color: "#183084",
                },
              }}
            >
              {dropdownOptions?.timeslotTypeCdOptions?.map((tst) => (
                <MenuItem key={tst?.id} value={tst?.id}>
                  {tst?.desc}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {/* {ErrorMessage("timeslotTypeCd")} */}

          <Box display="flex" justifyContent="center">
            <TextField
              id="timeslotUsageCd"
              name="timeslotUsageCd"
              label="Timeslot Usage"
              value={formik.values.timeslotUsageCd}
              onChange={onHandleChange}
              select
              fullWidth
              size="small"
              sx={{
                width: "90%",
                "& .MuiInputLabel-root": {
                  color: "#183084",
                },
              }}
            >
              {dropdownOptions?.timeslotUsageCdOptions?.map((tsu) => (
                <MenuItem key={tsu?.id} value={tsu?.id}>
                  {tsu?.desc}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {/* {ErrorMessage("timeslotUsageCd")} */}

          <Box display="flex" alignItems="center" justifyContent={"center"}>
            <ExpandableTableRow
              accordianLabelName={"Meeting Status"}
              options={dropdownOptions.meetingStatusCdOptions}
              formik={formik}
              fieldName={"meetingStatusCd"}
              setErrorMessages={setErrorMessages}
            />
          </Box>
          {/* {ErrorMessage("meetingStatusCd")} */}

          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Checkbox
              sx={{ marginLeft: "10px" }}
              checked={formik.values.beyond21DaysInd === "Y"}
              onChange={(event) => {
                formik.setFieldValue(
                  "beyond21DaysInd",
                  event.target.checked ? "Y" : "N"
                );
                setErrorMessages([]);
              }}
            />
            <Typography sx={{ color: "#183084" }}>Beyond 21 days</Typography>
          </Box>

          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Checkbox
              sx={{ marginLeft: "10px" }}
              checked={formik.values.hiPriorityInd === "Y"}
              onChange={(event) => {
                formik.setFieldValue(
                  "hiPriorityInd",
                  event.target.checked ? "Y" : "N"
                );
                setErrorMessages([]);
              }}
            />
            <Typography sx={{ color: "#183084" }}>HI Priority</Typography>
          </Box>

          <Box display="flex" alignItems="center" justifyContent={"center"}>
            <ExpandableTableRow
              accordianLabelName={"Scheduled by"}
              options={dropdownOptions.scheduledByOptions}
              formik={formik}
              fieldName={"scheduledBy"}
              setErrorMessages={setErrorMessages}
            />
          </Box>
          {/* {ErrorMessage("scheduledBy")} */}

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
                width: "90%",
                "& .MuiInputLabel-root": {
                  color: "#183084",
                },
              }}
            />
          </Box>
          {/* {ErrorMessage("claimantName")} */}

          <Box display="flex" justifyContent="center">
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
              sx={{
                width: "90%",
                "& .MuiInputLabel-root": {
                  color: "#183084",
                },
              }}
            />
          </Box>
          {/* {ErrorMessage("ssn")} */}

          <Box display="flex" justifyContent="center">
            <Stack direction="row" spacing={1} sx={{ width: "90%" }}>
              <TextField
                id="clmByeStartDt"
                name="clmByeStartDt"
                label="BYE From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.clmByeStartDt}
                onChange={onHandleChange}
                size="small"
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#183084",
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
          {/* {ErrorMessage("clmByeStartDt")} */}
        </Stack>
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          width={"88%"}
          padding={"10px 0px"}
        >
          <Button
            color="primary"
            variant="contained"
            type="submit"
            sx={{ alignSelf: "center", width: "30%" }}
          >
            Search
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default LookUpAppointments;

