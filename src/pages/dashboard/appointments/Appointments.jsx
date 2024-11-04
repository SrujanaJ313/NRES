import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import LookUpAppointments from "./LookUpAppointments";
import client from "../../../helpers/Api";
import { appointmentsLookUpSummaryURL } from "../../../helpers/Urls";
import { lookUpAppointmentsValidationSchema } from "../../../helpers/Validation";
import {
  convertISOToMMDDYYYY,
  getMsgsFromErrorCode,
} from "../../../helpers/utils";
import { useSnackbar } from "../../../context/SnackbarContext";

function Appointments() {
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
        let payload = {
          // pagination: {
          //   pageNumber: 1,
          //   pageSize: 10,
          //   needTotalCount: true,
          // },
          // sortBy: {
          //   field: "eventDateTime",
          //   direction: "ASC",
          // },
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

  return (
    <Box display="flex" height="100vh">
      {/* Left Panel */}
      <LookUpAppointments
        formik={formik}
        checkboxStates={checkboxStates}
        errorMessages={errorMessages}
        setCheckboxStates={setCheckboxStates}
        setErrorMessages={setErrorMessages}
      />

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

