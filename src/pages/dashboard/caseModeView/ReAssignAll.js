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
  // scheduleCaseManagerAvlURL,
  // scheduleSaveURL,
  reassignReasonsURL,
  reassignAllSaveURL,
} from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import { useFormik } from "formik";
import { reassignAllValidationSchema } from "../../../helpers/Validation";
import { getMsgsFromErrorCode } from "../../../helpers/utils";
import { isUpdateAccessExist } from "../../../utils/cookies";
import { useSnackbar } from "../../../context/SnackbarContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AlertDialog from "../../../components/DialogBox";
function ReassignAll({ onCancel, selectedRow, userId }) {
  const showSnackbar = useSnackbar();
  const [errors, setErrors] = useState([]);
  // const [caseMgrAvl, setCaseMgrAvl] = useState([]);
  const [caseOfficeName, setCaseOfficeName] = useState("");
  const [reassignReasons, setReassignReasons] = useState([]);
  const [open, setOpen] = React.useState(false);
  const formik = useFormik({
    initialValues: {
      caseManagerId: "",
      reassignDt: null,
      limitOffice: "",
      reassignReasonCd: "",
      staffNotes: "",
    },
    validationSchema: reassignAllValidationSchema,
    onSubmit: async (values) => {
      try {
        const { limitOffice, reassignReasonCd, reassignDt, staffNotes } =
          values;
        const payload = {
          caseManagerId: userId || "",
          reassignReasonCd,
          reassignDt: moment(reassignDt).format("MM/DD/YYYY"),
          limitOffice,
        };
        if (limitOffice) {
          payload.limitOffice = limitOffice === "limitTo";
        }

        if (staffNotes.length) {
          payload.staffNotes = staffNotes;
        }
        console.log(`ReAssign Save ALL payload`, payload);
        const result = await client.post(reassignAllSaveURL, payload);
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
          `POST:${process.env.REACT_APP_REASSIGN_ALL_SAVE}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    },
    validateOnChange: true,
    validateOnBlur: false,
  });

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

  const handleRadioButtonsChange = (event) => {
    formik.setFieldValue("limitOffice", event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length) {
      const touchedFields = Object.keys(formik.values).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});

      formik.setErrors(errors);
      formik.setTouched(touchedFields);
      return;
    }
    setOpen(true);
  };

  const handleConfirmSubmit = () => {
    setOpen(false);
    formik.handleSubmit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <AlertDialog
        open={open}
        handleConfirmSubmit={handleConfirmSubmit}
        handleCancel={handleCancel}
      />
      {/* <form onSubmit={formik.handleSubmit}> */}
      <form onSubmit={handleFormSubmit}>
        <Stack spacing={2}>
          <Stack direction={"column"} spacing={2}>
            <Stack direction="row">
              <FormControl
                component="fieldset"
                error={
                  formik.touched.localOffice &&
                  Boolean(formik.errors.localOffice)
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
                    color: "#183084",
                  }}
                >
                  Auto-reassign all cases with appointment dates on or after:
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={formik.values.reassignDt}
                    onChange={(newValue) => {
                      if (newValue) {
                        formik.setFieldValue("reassignDt", newValue);
                      } else {
                        formik.setFieldValue("reassignDt", null);
                      }
                    }}
                    slotProps={{
                      textField: { size: "small" },
                    }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="reassignDt"
                        name="reassignDt"
                        size="small"
                        fullWidth
                        sx={{
                          "& .MuiInputLabel-root": {
                            color: "#183084",
                            fontWeight: "bold",
                          },
                          width: "20%",
                          height: "32px",
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </Stack>
            {formik.touched.reassignDt && formik.errors.reassignDt && (
              <FormHelperText
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  color: "red",
                  // backgroundColor: "skyblue",
                }}
              >
                {formik.errors.reassignDt}
              </FormHelperText>
            )}

            <Stack>
              <FormControl sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  sx={{
                    width: "30%",
                    alignSelf: "self-start",
                    color: "#183084",
                  }}
                >
                  Auto-reassign to case managers as follows:
                </Typography>
                <FormGroup column sx={{ alignItems: "center", width: "80%" }}>
                  <RadioGroup
                    name="limitedOffice"
                    value={formik.values.limitOffice}
                    onChange={handleRadioButtonsChange}
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
                      // disabled={event?.usageDesc === "Initial Appointment"}
                    />
                  </RadioGroup>
                </FormGroup>
              </FormControl>
            </Stack>
            {formik.touched.limitOffice && formik.errors.limitOffice && (
              <FormHelperText
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
                error
              >
                {formik.errors.limitOffice}
              </FormHelperText>
            )}

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
              </FormControl>
            </Stack>
            {formik.touched.reassignReasonCd &&
              formik.errors.reassignReasonCd && (
                <FormHelperText
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                  error
                >
                  {formik.errors.reassignReasonCd}
                </FormHelperText>
              )}

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
                // disabled={!isUpdateAccessExist()}
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
    </>
  );
}

export default ReassignAll;

