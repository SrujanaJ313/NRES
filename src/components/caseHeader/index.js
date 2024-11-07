import React from "react";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

import MeetingDetails from "../meetingDetails";
import WorkSearch from "./WorkSearch";
import IssuesCreatedData from "./IssuesCreatedData";
import JobReferrals from "./JobReferrals";
import Tooltip from "@mui/material/Tooltip";

function CaseHeader({ caseDetails, event }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack width="100%" spacing={0.75}>
        <Stack direction="row" justifyContent="space-between" spacing={4}>
          <Stack direction={"row"} spacing={1}>
            <Typography className="label-text">Claimant:</Typography>
            <Tooltip title={<>{caseDetails?.phone}<br />{caseDetails?.email}</>} arrow>
              <Typography>{caseDetails.claimant}</Typography>
            </Tooltip>
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <Typography className="label-text">BYE:</Typography>
            <Typography>{caseDetails.clmByDt}</Typography>
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <Typography className="label-text">Weeks filed:</Typography>
            <Typography>{caseDetails.weeksFiled || ""}</Typography>
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <Typography className="label-text">Orientation Date:</Typography>
            <Typography>{`${caseDetails.orientationDt || ""} (${caseDetails.orientatonRschCnt || 0} RSch)`}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={4}>
          {caseDetails.initialAppttDt && (
            <Stack direction={"row"} spacing={1}>
              <Typography className="label-text">
                Initial Appointment Date:
              </Typography>
              <Typography>{`${caseDetails.initialAppttDt} (${caseDetails.initialAppttRschCnt || 0} RSch)`}</Typography>
            </Stack>
          )}
          {caseDetails.firstSubsequentApptDt && (
            <Stack direction={"row"} spacing={1}>
              <Typography className="label-text">
                1st Sub Appt. Date:
              </Typography>
              <Typography>
                {`${caseDetails.firstSubsequentApptDt} (${caseDetails.firstSubsequentApptRschCnt || 0} RSch)`}
              </Typography>
            </Stack>
          )}
          {caseDetails.secondSubsequentApptDt && (
            <Stack direction={"row"} spacing={1}>
              <Typography className="label-text">
                2nd Sub Appt. Date:
              </Typography>
              <Typography>
                {`${caseDetails.secondSubsequentApptDt} (${caseDetails.secondSubsequentApptRschCnt || 0} RSch)`}
              </Typography>
            </Stack>
          )}
        </Stack>
        <MeetingDetails caseDetails={caseDetails} event={event} />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Work Search
          </AccordionSummary>
          <AccordionDetails>
            <WorkSearch data={caseDetails.workSearch || []} />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            Issues Created
          </AccordionSummary>
          <AccordionDetails>
            <IssuesCreatedData data={caseDetails.issues || []} />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            Job Referrals
          </AccordionSummary>
          <AccordionDetails>
            <JobReferrals data={caseDetails.jobReferrals || []} />
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Stack>
  );
}

export default CaseHeader;

