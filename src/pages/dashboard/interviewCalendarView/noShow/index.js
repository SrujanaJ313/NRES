import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { FormControlLabel, Checkbox } from "@mui/material";
import client from "../../../../helpers/Api";
import { appointmentNoShowURL } from "../../../../helpers/Urls";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { getMsgsFromErrorCode } from "../../../../helpers/utils";

function NoShowup({ event, onCancel }) {
  const [checked, setChecked] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  const handleSubmit = async () => {
    const payload = {};
    //   {
    //   usageDesc: event.usageDesc,
    //   eventTypeDesc: event.eventTypeDesc,
    //   eventId: event.eventId,
    // };
    setErrorMessages([]);
    try {
      const response = await client.post(
        appointmentNoShowURL + `/${event.eventId}`,
        payload
      );

      setShowSuccessMsg(true);
      setSuccessMsg("Details updated successfully");
      onCancel();
    } catch (errorResponse) {
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_APPOINTMENT_NO_SHOW}`,
        errorResponse
      );
      setErrorMessages(newErrMsgs);
      // onCancel();
    }
  };

  return (
    <Stack spacing={0.5} noValidate component="form" onSubmit={handleSubmit}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            sx={{ py: 0, pl: 0 }}
            onChange={(event) => {
              const { checked } = event.target;
              setChecked(checked);
            }}
          />
        }
        label="Are you sure the candidate did not show up for the interview?"
      />

      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button variant="contained" disabled={!checked} onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
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

export default NoShowup;
