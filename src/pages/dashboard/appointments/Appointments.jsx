import React, { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
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

  const formik = useFormik({
    initialValues: {
      localOffice: [],
      caseManager: "",
      appointmentDateFrom: "",
      appointmentDateTo: "",
      timeslotType: "",
      timeslotUsage: "",
      meetingStatus: [],
      beyond21Days: "N",
      hiPriority: "N",
      scheduledBy: [],
      claimantName: "",
      ssn: "",
      byeFrom: "",
      byeTo: "",
    },
    validationSchema: lookUpAppointmentsValidationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          officeNum: values?.localOffice,
          caseManagerId: values?.caseManager,
          apptStartDt: values?.appointmentDateFrom
            ? convertISOToMMDDYYYY(values?.appointmentDateFrom)
            : null,
          apptEndDt: values?.appointmentDateTo
            ? convertISOToMMDDYYYY(values?.appointmentDateTo)
            : null,
          timeslotTypeCd: values?.timeslotType,
          timeslotUsageCd: values?.timeslotUsage,
          meetingStatusCd: values?.meetingStatus,
          beyond21DaysInd: values?.beyond21Days,
          hiPriorityInd: values?.hiPriority,
          scheduledBy: values?.scheduledBy,
          claimantName: values?.claimantName,
          ssn: values?.ssn?.toString(),
          clmByeStartDt: values?.byeFrom
            ? convertISOToMMDDYYYY(values?.byeFrom)
            : null,
          clmByeEndDt: values?.byeTo
            ? convertISOToMMDDYYYY(values?.byeTo)
            : null,
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

  return (
    <Box display="flex" height="100vh">
      {/* Left Panel */}
      <LookUpAppointments formik={formik} />
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        direction="row"
        useFlexGap
        flexWrap="wrap"
      >
        {errorMessages.map((x) => (
          <div>
            <span className="errorMsg">*{x}</span>
          </div>
        ))}
      </Stack>
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

