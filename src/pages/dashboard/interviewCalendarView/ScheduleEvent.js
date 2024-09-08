import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RescheduleRequest from "./RescheduleRequest";
import ReturnedToWork from "./ReturnedToWork";
import AppointmentDetails from "./appointmentDetails";
import Switch from "./Switch";

import CaseHeader from "../../../components/caseHeader";
import NoShowup from "./noShow";

function ScheduleEvent({ caseDetails, event, onClose }) {
  const [type, setType] = useState("");

  const handleSubmit = () => {
    onClose();
  };

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
                    onCancel={() => setType("")}
                    event={event}
                  />
                </Stack>
              )}
              {type === "switch" && (
                <Stack>
                  <Switch onCancel={() => setType("")} event={event} />
                </Stack>
              )}
              {type === "returnToWork" && (
                <Stack>
                  <ReturnedToWork onCancel={() => setType("")} event={event} />
                </Stack>
              )}
              {type === "appointmentDetails" && (
                <Stack>
                  <AppointmentDetails
                    event={event}
                    onCancel={() => setType("")}
                    caseDetails={caseDetails}
                  />
                </Stack>
              )}

              {type === "noShow" && (
                <Stack>
                  <NoShowup onCancel={() => setType("")} event={event} />
                </Stack>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ margin: 1 }}>
        <Button
          variant="contained"
          onClick={() => setType("reschedule")}
          size="small"
        >
          Reschedule
        </Button>
        <Button
          variant="contained"
          onClick={() => setType("switch")}
          size="small"
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
        >
          Appointment Details
        </Button>
        <Button
          variant="contained"
          sx={{ height: "fit-content" }}
          onClick={() => setType("noShow")}
          size="small"
        >
          No Show
        </Button>
      </DialogActions>
    </>
  );
}

export default ScheduleEvent;
