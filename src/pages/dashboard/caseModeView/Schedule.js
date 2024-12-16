import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  InputLabel,
  FormControl,
  Typography,
  Button,
  Stack,
  FormGroup,
  Checkbox,
  Box,
} from "@mui/material";
import {
  scheduleLocalOfficeURL,
  scheduleCaseManagerAvlURL,
  scheduleSaveURL,
} from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import { useFormik } from "formik";
import { schedulePageValidationSchema } from "../../../helpers/Validation";
import { getMsgsFromErrorCode } from "../../../helpers/utils";
import { isUpdateAccessExist } from "../../../utils/cookies";
import { useSnackbar } from "../../../context/SnackbarContext";

function Schedule({ onCancel, selectedRow, event }) {
  const showSnackbar = useSnackbar();
  const [errors, setErrors] = useState([]);
  const [caseMgrAvl, setCaseMgrAvl] = useState([]);
  const [caseOfficeName, setCaseOfficeName] = useState("");
  const formik = useFormik({
    initialValues: {
      reassignReasonCd: "",
      caseManagerAvl: "",
      localOffice: "",
      staffNotes: "",
      mode: {
        selectedPrefMtgModeInPerson:
          event?.usageDesc === "Initial Appointment" ? true : false,
        selectedPrefMtgModeVirtual: false,
      },
      beyond21DaysInd: "",
    },
    validationSchema: schedulePageValidationSchema,
    onSubmit: async (values) => {
      try {
        const { staffNotes, caseManagerAvl } = values;
        const payload = {
          eventId: caseManagerAvl.toString() || "38539",
          claimId: selectedRow.clmId || "7151668",
        };
        if (staffNotes.length) {
          payload.staffNotes = staffNotes;
        }
        const result = await client.post(scheduleSaveURL, payload);
        if (result?.status === 400) {
          const errorMsg = result?.errorDetails
            .map((err) => err?.errorCode)
            .map((err) => err);
          setErrors(errorMsg);
        } else {
          showSnackbar("Your request has been recorded successfully.", 5000);
          onCancel();
        }
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `POST:${process.env.REACT_APP_REASSIGN_SAVE}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    },
    validateOnChange: true,
    validateOnBlur: false,
  });

  useEffect(() => {
    async function fetchCaseManagerAvailibility() {
      try {
        const payload = {
          clmId: selectedRow?.clmId || 7142098,
          clmLofInd: formik.values.localOffice,
          showBeyondReseaDeadlineInd: formik.values.beyond21DaysInd,
          meetingModeInperson: formik.values.mode.selectedPrefMtgModeInPerson
            ? "I"
            : "",
          meetingModeVirtual: formik.values.mode.selectedPrefMtgModeVirtual
            ? "V"
            : "",
        };
        const data =
          process.env.REACT_APP_ENV === "mockserver"
            ? await client.get(scheduleCaseManagerAvlURL)
            : await client.post(scheduleCaseManagerAvlURL, payload);

        const result = data.map((item) => {
          const [name, office, dateTime, caseLoad] = item.name.split(" - ");
          return { ...item, nameList: { name, office, dateTime, caseLoad } };
        });
        setCaseMgrAvl(result);
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `GET:${process.env.REACT_APP_CASE_SCHEDULE_CASE_MANAGER_AVL_LIST}`, //Need to add in Error Constants
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    }
    if (
      formik.values.mode.selectedPrefMtgModeInPerson ||
      formik.values.mode.selectedPrefMtgModeVirtual
    ) {
      fetchCaseManagerAvailibility();
    }
  }, [
    formik.values.localOffice,
    formik.values.localOffice,
    formik.values.mode,
  ]);

  useEffect(() => {
    async function fetchCaseOfficeName() {
      try {
        const data = await client.get(
          `${scheduleLocalOfficeURL}${selectedRow.clmId || ""}`
        );
        setCaseOfficeName(data);
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `GET:${process.env.REACT_APP_CASE_SCHEDULE_LOCAL_OFFICE}`, //Need to add in Error Constants
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    }
    fetchCaseOfficeName();
  }, []);

  const handleCheckboxChange = (event) => {
    const { checked, name } = event.target;
    if (name === "tempSuspendedInd") {
      formik.setFieldValue("tempSuspendedInd", checked === true ? "Y" : "N");
    } else {
      let selectedModes = { ...formik.values.mode };
      selectedModes[name] = checked;
      formik.setFieldValue("mode", selectedModes);
    }
  };
  
  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        <Stack direction={"column"} spacing={2}>
          <Stack direction="row">
            <FormControl
              component="fieldset"
              error={
                formik.touched.localOffice && Boolean(formik.errors.localOffice)
              }
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Typography
                sx={{
                  width: "27%",
                  alignSelf: "center",
                }}
              >
                *Lookup Case Manager Availability for:
              </Typography>
              <RadioGroup
                row
                name="localOffice"
                value={formik.values.localOffice}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio />}
                  label={caseOfficeName || `<LOF_NAME> Local Office`}
                />
                <FormControlLabel
                  value="N"
                  control={<Radio />}
                  label="All other local offices"
                  // sx={{ backgroundColor:"pink"}}
                />
              </RadioGroup>
              <Typography
                sx={{
                  alignSelf: "center",
                  color: "#ab0c0c",
                  marginLeft: "-15px",
                }}
              >
                (as virtual meetings only)
              </Typography>
            </FormControl>
            {formik.errors.localOffice && (
              <FormHelperText sx={{ color: "red" }}>
                {formik.errors.localOffice}
              </FormHelperText>
            )}
          </Stack>

          <Stack>
            <FormControl sx={{ display: "flex", flexDirection: "row" }}>
              <Typography
                sx={{
                  width: "20%",
                  alignSelf: "center",
                }}
              >
                *Preferred Meeting Modes:
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={formik.values.mode.selectedPrefMtgModeInPerson}
                      checked={formik.values.mode.selectedPrefMtgModeInPerson}
                      onChange={handleCheckboxChange}
                      onBlur={formik.handleBlur}
                      name="selectedPrefMtgModeInPerson"
                    />
                  }
                  label="In person"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      value={formik.values.mode.selectedPrefMtgModeVirtual}
                      checked={formik.values.mode.selectedPrefMtgModeVirtual}
                      onChange={handleCheckboxChange}
                      onBlur={formik.handleBlur}
                      disabled={event?.usageDesc === "Initial Appointment"}
                      name="selectedPrefMtgModeVirtual"
                    />
                  }
                  label="Virtual"
                />
              </FormGroup>
              <Typography
                sx={{
                  width: "20%",
                  alignSelf: "center",
                }}
              >
                (choose all that apply)
              </Typography>
            </FormControl>
            {formik.touched.mode && formik.errors.mode && (
              <FormHelperText error>{formik.errors.mode}</FormHelperText>
            )}
          </Stack>

          <Stack>
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <Checkbox
                checked={formik.values.beyond21DaysInd === "Y"}
                onChange={(event) => {
                  formik.setFieldValue(
                    "beyond21DaysInd",
                    event.target.checked ? "Y" : ""
                  );
                  setErrors([]);
                }}
                sx={{ padding: "0px" }}
              />
              <Typography sx={{ alignSelf: "center", paddingLeft: "10px" }}>
                Include appointments that are beyond 21 days after the prior
                appointment
              </Typography>
            </FormControl>
          </Stack>

          <Stack direction={"column"} justifyContent={"space-between"}>
            <FormControl size="small" fullWidth>
              <InputLabel id="reschedule-request-dropdown">
                *Case Manager Availability
              </InputLabel>
              <Select
                label="*Case Manager Availability"
                value={formik.values.caseManagerAvl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="caseManagerAvl"
                sx={{ width: "70%" }}
                renderValue={(selected) => {
                  const selectedReason = caseMgrAvl.find(
                    (reason) => reason.id === selected
                  );
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <span style={{ width: "20ch", textAlign: "left" }}>
                        {selectedReason?.nameList.name}
                      </span>
                      <span style={{ width: "25ch", textAlign: "left" }}>
                        {selectedReason?.nameList.office}
                      </span>
                      <span style={{ width: "25ch", textAlign: "left" }}>
                        {selectedReason?.nameList.dateTime}
                      </span>

                      <span style={{ width: "20ch", textAlign: "left" }}>
                        {selectedReason?.nameList.caseLoad}
                      </span>
                      {selectedReason?.beyondReseaDeadline === "Y" && (
                        <span style={{ color: "blue", marginLeft: "auto" }}>
                          {/* <MoreTimeIcon
                            style={{ color: "#364da2", fontSize: "small" }}
                          /> */}{" "}
                          &gt;21
                        </span>
                      )}
                    </Box>
                  );
                }}
              >
                {caseMgrAvl?.map((reason) => (
                  <MenuItem
                    key={reason.id}
                    value={reason.id}
                    style={{
                      color: reason.beyondReseaDeadline === "Y" ? "red" : "",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        width: "20ch",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {reason.nameList.name}
                    </span>
                    <span
                      style={{
                        width: "25ch",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {reason.nameList.office}
                    </span>
                    <span
                      style={{
                        width: "25ch",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {reason.nameList.dateTime}
                    </span>
                    <span
                      style={{
                        width: "20ch",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {reason.nameList.caseLoad}
                    </span>

                    {reason.beyondReseaDeadline === "Y" && (
                      <span style={{ color: "blue", marginLeft: "auto" }}>
                        {/* <MoreTimeIcon
                          style={{ color: "#364da2", fontSize: "small" }}
                        /> */}{" "}
                        &gt;21
                      </span>
                    )}
                  </MenuItem>
                ))}
              </Select>
              {formik?.touched?.caseManagerAvl && formik?.errors?.caseManagerAvl && (
                <FormHelperText error>
                  {formik.errors.caseManagerAvl}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>

          <Stack direction={"column"} spacing={2}>
            <TextField
              name="staffNotes"
              label="Staff Notes, if any"
              size="small"
              value={formik.values.staffNotes}
              onChange={formik.handleChange}
              variant="outlined"
              multiline
              rows={3}
              fullWidth
            />
          </Stack>

          {!!errors?.length && (
            <Stack mt={1} direction="column" useFlexGap flexWrap="wrap">
              {errors.map((x) => (
                <div key={x}>
                  <span className="errorMsg">*{x}</span>
                </div>
              ))}
            </Stack>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isUpdateAccessExist()}
            >
              Submit
            </Button>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
}

export default Schedule;

