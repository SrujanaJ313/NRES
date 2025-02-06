import * as React from "react";
import {Button, Stack, Typography} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({
  open,
  handleConfirmSubmit,
  handleCancel,
}) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" sx={{color:"#183084", fontWeight:"bold"}}>{"Confirmation"}</DialogTitle>
        <DialogContent>
          <Stack
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography sx={{fontSize:"15px",color:"#183084", width:"100%"}}>Are you sure, You want to ReAssign all?</Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ margin: 2 }}>
          <Button variant="contained" onClick={() => handleConfirmSubmit()}>
            Confirm
          </Button>
          <Button variant="outlined" onClick={() => handleCancel()}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

