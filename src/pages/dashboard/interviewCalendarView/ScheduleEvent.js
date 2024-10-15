import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import moment from "moment";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RescheduleRequest from "./RescheduleRequest";
import ReturnedToWork from "./ReturnedToWork";
import AppointmentDetails from "./appointmentDetails";
import Switch from "./Switch";

import CaseHeader from "../../../components/caseHeader";
import NoShowup from "./noShow";

import { getIsPastAppointment } from "../../../helpers/utils";

function ScheduleEvent({ caseDetails, event, onSubmitClose }) {
  const [type, setType] = useState("");
  console.log('caseDetails-->', caseDetails.reopenAccess);
  const getTitle = () => {
    switch (type) {
      case "reschedule":
        return "Reschedule Request";
      case "switch":
        return `Switch Meeting Mode to ${
          event?.appointmentType === "I" ? "Virtual" : "In Person"
        }`;
      case "returnToWork":
        return "Details of return to work";
      case "appointmentDetails":
        return "Appointment Details";
      case "noShow":
        return "No Show";

      default:
        return "";
    }
  };

  const getIsFutureAppointment = () => {
    const appointmentDateTime = moment(
      `${event.appointmentDt} ${event.startTime}`
    );
    const adjustedDateTime = appointmentDateTime.subtract(30, "minutes");
    const isFutureAppointment = moment().isBefore(adjustedDateTime);
    return isFutureAppointment;
  };

  // const getIsPastAppointment = () => {
  //   const appointmentDateTime = moment(
  //     `${event.appointmentDt} ${event.startTime}`
  //   );
  //   const adjustedDateTime = appointmentDateTime.subtract(30, "minutes");
  //   const isPastAppointment = moment().isAfter(adjustedDateTime);
  //   return isPastAppointment;
  // };

  const isCurrentAppointment = () => {
    const appointmentStartTime = moment(
      `${event.appointmentDt} ${event.startTime}`
    ).subtract(30, "minutes");
    const appointmentEndTime = moment(
      `${event.appointmentDt} ${event.endTime}`
    ).add(30, "minutes");
    return (
      moment().isAfter(appointmentStartTime) &&
      moment().isBefore(appointmentEndTime)
    );
  };

  return (
    <>
      <DialogContent dividers sx={{ paddingBottom: 1 }}>
        <Stack>
          <CaseHeader caseDetails={caseDetails} event={event} />
          {type && (
            <>
              <Stack mt={2}>
                <Typography fontWeight={600} fontSize={"1rem"} color="primary">
                  {getTitle()}
                </Typography>
              </Stack>
              {type === "reschedule" && (
                <Stack>
                  <RescheduleRequest
                    onSubmitClose={onSubmitClose}
                    onCancel={() => setType("")}
                    event={event}
                  />
                </Stack>
              )}
              {type === "switch" && (
                <Stack>
                  <Switch
                    onSubmitClose={onSubmitClose}
                    onCancel={() => setType("")}
                    event={event}
                  />
                </Stack>
              )}
              {type === "returnToWork" && (
                <Stack>
                  <ReturnedToWork
                    onSubmitClose={onSubmitClose}
                    onCancel={() => setType("")}
                    event={event}
                  />
                </Stack>
              )}
              {type === "appointmentDetails" && (
                <Stack>
                  <AppointmentDetails
                    onSubmitClose={onSubmitClose}
                    event={event}
                    onCancel={() => setType("")}
                    caseDetails={caseDetails}
                  />
                </Stack>
              )}

              {type === "noShow" && (
                <Stack>
                  <NoShowup
                    onSubmitClose={onSubmitClose}
                    onCancel={() => setType("")}
                    event={event}
                  />
                </Stack>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ margin: 1 }}>
        {!type && (
          <>
            <Button
              variant="contained"
              // onClick={() => setType("reopen")}
              size="small"
              disabled={caseDetails.reopenAccess === "N"}
            >
              Reopen
            </Button>

            <Button
              variant="contained"
              onClick={() => setType("reschedule")}
              size="small"
              disabled={!getIsFutureAppointment()}
            >
              Reschedule
            </Button>
            <Button
              variant="contained"
              onClick={() => setType("switch")}
              size="small"
              disabled={!getIsFutureAppointment()}
            >
              Switch Mode
            </Button>
            <Button
              variant="contained"
              onClick={() => setType("returnToWork")}
              size="small"
            >
              Returned to Work
            </Button>

            <Button
              variant="contained"
              sx={{ height: "fit-content" }}
              onClick={() => setType("appointmentDetails")}
              size="small"
              disabled={!getIsPastAppointment(event)}
            >
              Appointment Details
            </Button>
            <Button
              variant="contained"
              sx={{ height: "fit-content" }}
              onClick={() => setType("noShow")}
              size="small"
              disabled={!isCurrentAppointment()}
            >
              No Show
            </Button>
          </>
        )}
      </DialogActions>
    </>
  );
}

export default ScheduleEvent;
