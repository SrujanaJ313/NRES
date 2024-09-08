import React, { Fragment, useEffect, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import moment from "moment";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function EventDialog({ open, event, claimants, onClose, onSubmit }) {
  const [claimant, setClaimant] = useState("");
  const [notes, setNotes] = useState("");
  const [checked, setChecked] = useState(false);
  const [convertedFormat, setConvertedFormat] = useState("");

  const handleSubmit = () => {
    const formData = {
      claimant,
      notes,
      checked,
    };
    onSubmit(formData);
    onClose();
  };

  useEffect(() => {
    const startDate = moment(event.start).format("M/D/YYYY [at] h:mm a");
    const endDate = moment(event.end).format("h:mm a");

    setConvertedFormat(`${startDate} to ${endDate}`);
  }, [event]);

  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Event Details
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography variant="h4" gutterBottom>
          {event.title}
        </Typography>
        {event && event.title.toLowerCase() === "available" ? (
          <Fragment>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div>Case Manager: Mary Peters</div>
              <div>Initial Appointment Timeslot: {convertedFormat}</div>
            </div>
            <div>
              <FormControl fullWidth>
                <InputLabel id="claimant-select-label">
                  Claimant to be scheduled:
                </InputLabel>
                <Select
                  size="small"
                  labelId="claimant-select-label"
                  value={claimant}
                  label="Claimant to be scheduled:"
                  onChange={(e) => setClaimant(e.target.value)}
                >
                  {claimants.map((claimant) => (
                    <MenuItem key={claimant.id} value={claimant.id}>
                      {claimant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                }
                label="Claimant has been asked to check Claimant portal for details of this last minute schedule"
              />
              <TextField
                label="Notes, if any:"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={3}
                size="small"
                variant="outlined"
                fullWidth
                style={{ marginTop: "20px" }}
              />
            </div>
          </Fragment>
        ) : (
          <Typography gutterBottom>{event.desc}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        {event && event.title.toLowerCase() === "available" ? (
          <Fragment>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
            <Button onClick={onClose} variant="contained">
              Cancel
            </Button>
          </Fragment>
        ) : (
          <Button autoFocus onClick={onClose} variant="contained">
            Attend Meeting
          </Button>
        )}
      </DialogActions>
    </BootstrapDialog>
  );
}

export default EventDialog;
