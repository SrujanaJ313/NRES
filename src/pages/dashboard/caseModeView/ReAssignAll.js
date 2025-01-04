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
} from "@mui/material";
import {
  scheduleLocalOfficeURL,
  scheduleCaseManagerAvlURL,
  scheduleSaveURL,
  reassignReasonsURL,
} from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import { useFormik } from "formik";
import { schedulePageValidationSchema } from "../../../helpers/Validation";
import { getMsgsFromErrorCode } from "../../../helpers/utils";
import { isUpdateAccessExist } from "../../../utils/cookies";
import { useSnackbar } from "../../../context/SnackbarContext";

function ReassignAll({ onCancel, selectedRow, event }) {
  const showSnackbar = useSnackbar();
  const [errors, setErrors] = useState([]);
  const [caseMgrAvl, setCaseMgrAvl] = useState([]);
  const [caseOfficeName, setCaseOfficeName] = useState("");
  const [reassignReasons, setReassignReasons] = useState([]);
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
    formik.values.mode,
    formik.values.beyond21DaysInd,
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

  useEffect(() => {
    async function fetchReAssignReasons() {
      try {
        const data =
          process.env.REACT_APP_ENV === "mockserver"
            ? await client.get(reassignReasonsURL)
            : await client.get(`${reassignReasonsURL}886`);
        setReassignReasons(
          data?.map((d) => ({ id: d.constId, name: d.constShortDesc }))
        );
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `GET:${process.env.REACT_APP_REASSIGN_REASONS}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    }
    fetchReAssignReasons();
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
                  width: "40%",
                  alignSelf: "center",
                  color:"#183084"
                }}
              >
                Auto-reassign all cases with appointment dates on or after:
              </Typography>
              <TextField
                id="autoReassignCases"
                name="autoReassignCases"
                // label="Orientation From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.orientationStartDt}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#183084",
                    fontWeight: "bold",
                  },
                  width:"20%"
                }}
              />
            </FormControl>
            {/* {formik.errors.localOffice && (
              <FormHelperText sx={{ color: "red" }}>
                {formik.errors.localOffice}
              </FormHelperText>
            )} */}
          </Stack>

          <Stack>
            <FormControl sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  width: "30%",
                  alignSelf: "self-start",
                  color:"#183084"
                }}
              >
                Auto-reassign to case managers as follows:
              </Typography>
              <FormGroup column sx={{alignItems:"center", width:"80%"}}>
                <RadioGroup
                  name="selectedPrefMtgMode"
                  value={formik.values.mode.selectedPrefMtgMode}
                  onChange={handleCheckboxChange}
                  onBlur={formik.handleBlur}
                >
                  <FormControlLabel
                    control={<Radio />}
                    value="limitTo"
                    label={`Limit to Case Managers within the ${caseOfficeName}`}
                  />
                  <FormControlLabel
                    control={<Radio />}
                    value="extendAll"
                    label={`Extend all Case Managers, while prioritizing Case Managers within the ${caseOfficeName}`}
                    disabled={event?.usageDesc === "Initial Appointment"}
                  />
                </RadioGroup>
              </FormGroup>
            </FormControl>
            {/* {formik.touched.mode && formik.errors.mode && (
              <FormHelperText error>{formik.errors.mode}</FormHelperText>
            )} */}
          </Stack>

          <Stack direction={"column"} justifyContent={"space-between"}>
            <FormControl size="small" fullWidth>
              <InputLabel id="reschedule-request-dropdown">
                *Reason for Reassignment
              </InputLabel>
              <Select
                label="*Reason for Reassignment"
                value={formik.values.reassignReasonCd}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="reassignReasonCd"
                sx={{ width: "50%" }}
              >
                {reassignReasons?.map((reason) => (
                  <MenuItem key={reason.id} value={reason.id}>
                    {reason.name}
                  </MenuItem>
                ))}
              </Select>
              {formik?.errors?.reassignReasonCd && (
                <FormHelperText error>
                  {formik.errors.reassignReasonCd}
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

export default ReassignAll;

