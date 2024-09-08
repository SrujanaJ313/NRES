import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import JMSItems from "./JMSItems";
import WorkSearchItems from "./WorkSearchItems";
import Issues from "./Issues";
import OtherActions from "./OtherActions";
import client from "../../../../helpers/Api";
import {
  initialAppointmentDetailsSchema,
  firstAppointmentDetailsSchema,
  secondAppointmentDetailsSchema,
} from "../../../../helpers/Validation";
import { appointmentDetailsSubmissionURL } from "../../../../helpers/Urls";
import {
  JMS_ITEMS_INITIAL,
  OTHER_ACTIONS_INITIAL,
  JMS_ITEMS_FIRST,
  JMS_ITEMS_SECOND,
  OTHER_ACTIONS_FIRST,
  OTHER_ACTIONS_SECOND,
  INITIAL_APPOINTMENT_DETAILS_INITIAL_VALUES,
  FIRST_APPOINTMENT_DETAILS_INITIAL_VALUES,
  SECOND_APPOINTMENT_DETAILS_INITIAL_VALUES,
} from "../../../../helpers/Constants";
import { getMsgsFromErrorCode } from "../../../../helpers/utils";

function AppointmentDetails({ event, onCancel, caseDetails }) {
  const [jmsItemsList, setJMSItemsList] = useState([]);
  const [otherActionsList, setOtherActionsList] = useState([]);
  const [initialValues, setInitialValues] = useState(
    INITIAL_APPOINTMENT_DETAILS_INITIAL_VALUES
  );

  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    if (event && event.eventTypeDesc === "In Use") {
      if (event.usageDesc === "Initial Appointment") {
        setJMSItemsList(JMS_ITEMS_INITIAL);
        setOtherActionsList(OTHER_ACTIONS_INITIAL);
        setInitialValues(INITIAL_APPOINTMENT_DETAILS_INITIAL_VALUES);
      } else if (event.usageDesc === "1st Subsequent Appointment") {
        setJMSItemsList(JMS_ITEMS_FIRST);
        setOtherActionsList(OTHER_ACTIONS_FIRST);
        setInitialValues(FIRST_APPOINTMENT_DETAILS_INITIAL_VALUES);
      } else if (event.usageDesc === "2nd Subsequent Appointment") {
        setJMSItemsList(JMS_ITEMS_SECOND);
        setOtherActionsList(OTHER_ACTIONS_SECOND);
        setInitialValues(SECOND_APPOINTMENT_DETAILS_INITIAL_VALUES);
      }
    }
  }, [event]);

  const onSubmit = async (values) => {
    const jmsItems = Object.entries(values.jmsItems)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
    const workSearchIssues = {};
    values.workSearchIssues.forEach((x) => {
      if (x.status === "createIssue") {
        workSearchIssues[x.weekEndingDt] = x.activelySeekingWork;
      }
    });

    const otherIssues = values.otherIssues
      .filter((item) => item.selected)
      .map((x) => {
        return {
          issueId: x.issueSubType,
          startDt: x.startDt?.format("MM/DD/YYYY"),
          endDt: x.endDt?.format("MM/DD/YYYY"),
        };
      });

    const actionTaken = Object.entries(values.actionTaken)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);

    const payload = {
      eventId: event.eventId,
      itemsCompletedInJMS: jmsItems,
      workSearchIssues: workSearchIssues,
      otherIssues: otherIssues,
      actionTaken: actionTaken,
      staffNotes: values.staffNotes,
      empServicesConfirmInd: "Y",
    };
    if (values.rsidJmsResumeExpDt) {
      payload["jmsResumeExpDt"] =
        values.rsidJmsResumeExpDt?.format("MM/DD/YYYY");
    }
    if (values.rsidJmsVRecrtExpDt) {
      payload["jmsVRExpDt"] = values.rsidJmsVRecrtExpDt?.format("MM/DD/YYYY");
    }
    if (values.outsideWebReferral?.length > 0) {
      payload["outsideWebReferral"] = values.outsideWebReferral;
    }
    if (values.jMSJobReferral?.length > 0) {
      payload["jMSJobReferral"] = values.jMSJobReferral;
    }
    if (values.rsidMrpAssgnd) {
      payload["assignedMrpChap"] = values.rsidMrpAssgnd;
    }
    if (values.rsidSlfSchByDt) {
      payload["selfSchByDt"] = values.rsidSlfSchByDt?.format("MM/DD/YYYY");
    }
    if (values.rsidMrpRvwd) {
      payload["reviewedMrpChap"] = values.rsidMrpRvwd;
    }
    if (values.esConfirm) {
      payload["esConfirm"] = values.esConfirm;
    }

    console.log(payload);

    try {
      setErrorMessages([]);
      await client.post(appointmentDetailsSubmissionURL, payload);
      onCancel();
      setShowSuccessMsg(true);
      setSuccessMsg("Appointment Details updated successfully");
    } catch (errorResponse) {
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_APPOINTMENT_DETAILS_SUBMISSION}`,
        errorResponse
      );
      setErrorMessages(newErrMsgs);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema:
      event.usageDesc === "Initial Appointment"
        ? initialAppointmentDetailsSchema
        : event.usageDesc === "1st Subsequent Appointment"
          ? firstAppointmentDetailsSchema
          : secondAppointmentDetailsSchema,
    enableReinitialize: true,
    onSubmit: onSubmit,
  });

  const {
    touched,
    values,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = formik;

  return (
    <Stack spacing={0.5} noValidate component="form" onSubmit={handleSubmit}>
      <JMSItems formik={formik} jmsItemsList={jmsItemsList} />
      <WorkSearchItems data={caseDetails.workSearch} formik={formik} />
      <Issues formik={formik} caseDetails={caseDetails} />

      <OtherActions
        formik={formik}
        otherActionsList={otherActionsList}
        event={event}
      />

      <Stack direction="column" spacing={1} style={{ marginTop: "0.7rem" }}>
        <TextField
          label="Staff Notes, if any"
          size="small"
          value={values.staffNotes}
          name="staffNotes"
          onBlur={handleBlur}
          onChange={handleChange}
          variant="outlined"
          multiline
          rows={2}
          sx={{ width: "100%" }}
        />
      </Stack>

      <FormControlLabel
        control={
          <Checkbox
            checked={values.esConfirm}
            sx={{ py: 0, pl: 0 }}
            onChange={(event) => {
              const { checked } = event.target;
              setFieldValue(`esConfirm`, checked ? "Y" : "N");
            }}
          />
        }
        label="I confirm that I have provided all necessary Employment Services to this claimant"
      />

      {touched.esConfirm && errors.esConfirm && (
        <FormHelperText style={{ color: "red" }}>
          {errors.esConfirm}
        </FormHelperText>
      )}

      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button variant="contained" type="submit">
          Submit
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Stack>

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

      <Snackbar
        open={showSuccessMsg}
        autoHideDuration={5000}
        onClose={() => setShowSuccessMsg(false)}
        message={successMsg}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setShowSuccessMsg(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMsg}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default AppointmentDetails;
