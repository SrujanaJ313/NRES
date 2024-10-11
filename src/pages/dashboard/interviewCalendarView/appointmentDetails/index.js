import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { useFormik } from "formik";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import moment from "moment";
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
import {
  appointmentDetailsGetURL,
  appointmentDetailsSubmissionURL,
} from "../../../../helpers/Urls";
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
import { isUpdateAccessExist } from "../../../../utils/cookies";
import { useSnackbar } from "../../../../context/SnackbarContext";
import {
  getIsPastAppointment,
  isCurrentAppointment,
} from "../../../../helpers/utils";

const getInitialData = (event) => {
  let jmsItemsList = [];
  let otherActionsList = [];
  let initialUnfilledValues = {};
  if (event && event.eventTypeDesc === "In Use") {
    if (event.usageDesc === "Initial Appointment") {
      jmsItemsList = JMS_ITEMS_INITIAL;
      otherActionsList = OTHER_ACTIONS_INITIAL;
      initialUnfilledValues = INITIAL_APPOINTMENT_DETAILS_INITIAL_VALUES;
    } else if (event.usageDesc === "1st Subsequent Appointment") {
      jmsItemsList = JMS_ITEMS_FIRST;
      otherActionsList = OTHER_ACTIONS_FIRST;
      initialUnfilledValues = FIRST_APPOINTMENT_DETAILS_INITIAL_VALUES;
    } else if (event.usageDesc === "2nd Subsequent Appointment") {
      jmsItemsList = JMS_ITEMS_SECOND;
      otherActionsList = OTHER_ACTIONS_SECOND;
      initialUnfilledValues = SECOND_APPOINTMENT_DETAILS_INITIAL_VALUES;
    }
  }
  return { jmsItemsList, otherActionsList, initialUnfilledValues };
};

function AppointmentDetails({ event, onCancel, caseDetails, onSubmitClose }) {
  const showSnackbar = useSnackbar();
  const { jmsItemsList, otherActionsList, initialUnfilledValues } =
    getInitialData(event);
  // const [jmsItemsList, setJMSItemsList] = useState([]);
  // const [otherActionsList, setOtherActionsList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    ...initialUnfilledValues,
    workSearchIssuesCount: caseDetails?.workSearch?.length || 0,
  });

  const [errorMessages, setErrorMessages] = useState([]);
  const [disableForm, setDisableForm] = useState(false);
  const [showEmptyAppointmentDetails, setShowEmptyAppointmentDetails] =
    useState(false);
  const [isMetaDataLoaded, setIsMetaDataLoaded] = useState(false);

  useEffect(() => {
    const isPastAppointment = getIsPastAppointment(event);
    const isCurrent = isCurrentAppointment(event);

    if (event.eventSubmitted) {
      fetchAppointmentDetails();
      return;
    }

    if (isCurrent) {
      setIsMetaDataLoaded(true);
      return;
    }

    if (isPastAppointment) {
      fetchAppointmentDetails();
    }
  }, []);

  const fetchAppointmentDetails = async () => {
    try {
      setErrorMessages([]);
      const response = await client.get(
        appointmentDetailsGetURL + `/${event.eventId}`
      );

      /*

      // todo for sitarm to update
      response.jmsItems = response.itemsCompletedInJMS;
      response.workSearchIssues.map((e) => {
        if (e.status == "noIssue") e.status = "noIssues";
      });
      response.jMSJobReferral = response.jmsjobReferral;
      //assignedMrpChap-> Chapter1To4, Chapter5To10
      //based on app stage, pass field name correctly
      response.assignedMrpChap = "Chapter1To4";
      response.reviewedMrpChap = "Chapter1To4";
      // response.empServicesConfirmInd = "Y";
      */

      if (response) {
        setInitialValues(response);
        setDisableForm(true);
      } else {
        setShowEmptyAppointmentDetails(true);
      }
      setIsMetaDataLoaded(true);
    } catch (errorResponse) {
      setDisableForm(true);
      const newErrMsgs = getMsgsFromErrorCode(
        `GET:${process.env.REACT_APP_APPOINTMENT_DETAILS_GET}`,
        errorResponse
      );
      setErrorMessages(newErrMsgs);
    }
  };

  const onSubmit = async (values) => {
    const jmsItems = Object.entries(values.jmsItems)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
    const workSearchIssues = {};
    values.workSearchIssues.forEach((x) => {
      if (x.status === "createIssue") {
        workSearchIssues[x.weekEndingDt] = x.activelySeekingWork;
      } else if (x.status === "noIssues") {
        workSearchIssues[x.weekEndingDt] = 0;
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
      // empServicempServicesConfirmIndInd: "Y",
    };
    if (values.jmsResumeExpDt) {
      payload["jmsResumeExpDt"] = values.jmsResumeExpDt?.format("MM/DD/YYYY");
    }
    if (values.jmsVRExpDt) {
      payload["jmsVRExpDt"] = values.jmsVRExpDt?.format("MM/DD/YYYY");
    }
    if (values.outsideWebReferral?.length > 0) {
      payload["outsideWebReferral"] = values.outsideWebReferral;
    }
    if (values.jMSJobReferral?.length > 0) {
      payload["jMSJobReferral"] = values.jMSJobReferral;
    }
    if (values.assignedMrpChap) {
      payload["assignedMrpChap"] = values.assignedMrpChap;
    }
    if (values.selfSchByDt) {
      payload["selfSchByDt"] = values.selfSchByDt?.format("MM/DD/YYYY");
    }
    if (values.reviewedMrpChap) {
      payload["reviewedMrpChap"] = values.reviewedMrpChap;
    }
    if (values.empServicesConfirmInd) {
      payload["empServicesConfirmInd"] = values.empServicesConfirmInd;
    }

    try {
      setErrorMessages([]);
      await client.post(appointmentDetailsSubmissionURL, payload);
      showSnackbar("Your request has been recorded successfully.", 5000);
      onSubmitClose();
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

  if (!isMetaDataLoaded) {
    return (
      <div>
        <p>Loading appointment details...</p>
        <LinearProgress />
      </div>
    );
  } else if (showEmptyAppointmentDetails) {
    return (
      <Stack spacing={0.5} noValidate component="form" onSubmit={handleSubmit}>
        <p>No Details for this appointment</p>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack spacing={0.5} noValidate component="form" onSubmit={handleSubmit}>
        <JMSItems
          formik={formik}
          jmsItemsList={jmsItemsList}
          disableForm={disableForm}
        />
        <WorkSearchItems
          data={caseDetails.workSearch}
          formik={formik}
          disableForm={disableForm}
        />
        <Issues
          formik={formik}
          caseDetails={caseDetails}
          disableForm={disableForm}
        />

        <OtherActions
          formik={formik}
          otherActionsList={otherActionsList}
          event={event}
          disableForm={disableForm}
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
            disabled={disableForm}
          />
        </Stack>

        <FormControlLabel
          control={
            <Checkbox
              checked={values.empServicesConfirmInd == "Y"}
              sx={{ py: 0, pl: 0 }}
              onChange={(event) => {
                const { checked } = event.target;
                setFieldValue(`empServicesConfirmInd`, checked ? "Y" : "N");
              }}
              disabled={disableForm}
            />
          }
          label="I confirm that I have provided all necessary Employment Services to this claimant"
        />

        {touched.empServicesConfirmInd && errors.empServicesConfirmInd && (
          <FormHelperText style={{ color: "red" }}>
            {errors.empServicesConfirmInd}
          </FormHelperText>
        )}

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            variant="contained"
            type="submit"
            disabled={disableForm || !isUpdateAccessExist()}
          >
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
      </Stack>
    );
  }
}

export default AppointmentDetails;
