import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { MEETING_INVITE_SHOW_BUFFER_DURATION } from "../../helpers/Constants";
import moment from "moment";
import GroupIcon from "@mui/icons-material/Group";
function MeetingDetails({ caseDetails, event }) {
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);

  useEffect(() => {
    if (caseDetails.meetingUrl) {
      const minutes = moment
        .duration(moment(event.start).diff(moment()))
        .asMinutes();
      if (
        minutes > -MEETING_INVITE_SHOW_BUFFER_DURATION &&
        minutes < MEETING_INVITE_SHOW_BUFFER_DURATION
      ) {
        setShowMeetingDetails(true);
      }
    }
  }, [caseDetails, event]);

  return (
    <>
      {showMeetingDetails && (
        <Stack
          sx={{
            fontWeight: 600,
            border: "1px solid",
            borderColor: "grey.300",
            padding: 0.5,
          }}
        >
          <Stack direction="row" spacing={1}>
            <GroupIcon style={{ position: "relative", bottom: "4px" }} />
            <Link
              href={caseDetails.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {caseDetails.meetingUrl}
            </Link>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography className="label-text">Meeting ID:</Typography>
              <Typography>{caseDetails.meetingId}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography className="label-text">Passcode:</Typography>
              <Typography>{caseDetails.passcode}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography className="label-text">Dial:</Typography>
              <Typography>{caseDetails.telephoneNum1}</Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default MeetingDetails;
