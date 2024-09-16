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
} from "@mui/material";
import {
  caseManagerAvailabilityURL,
  reassignReasonsURL,
  reassignCaseOfficeNameURL,
  reassignSaveURL,
} from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import { useFormik } from "formik";
import { reAssignPageValidationSchema } from "../../../helpers/Validation";
import { getMsgsFromErrorCode } from "../../../helpers/utils";
import { isUpdateAccessExist } from "../../../utils/cookies";

function ReAssignCase({ onCancel, event, caseNum }) {
  console.log("CaseNumber", caseNum);
  const [errors, setErrors] = useState([]);
  const [caseMgrAvl, setCaseMgrAvl] = useState([]);
  const [reassignReasons, setReassignReasons] = useState([]);
  const [caseOfficeName, setCaseOfficeName] = useState("");
  // const caseNum = 162;
  const formik = useFormik({
    initialValues: {
      reassignReasonCd: "",
      caseManagerAvl: "",
      localOffice: "",
      staffNotes: "",
    },
    validationSchema: reAssignPageValidationSchema,
    onSubmit: async (values) => {
      try {
        const { reassignReasonCd, staffNotes, localOffice, caseManagerAvl } =
          values;
        const payload = {
          caseId: caseNum,
          eventId: caseManagerAvl,
          reassignReasonCd,
          caseOffice: localOffice,
          staffNotes,
        };
        console.log("Form payload", payload);
        await client.post(reassignSaveURL, payload);
        onCancel();
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
        const data =
          process.env.REACT_APP_ENV === "mockserver"
            ? await client.get(caseManagerAvailabilityURL)
            : await client.get(
                `${caseManagerAvailabilityURL}${caseNum}/${formik.values.localOffice}`
              );
        setCaseMgrAvl(data);
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `GET:${process.env.REACT_APP_REASSIGN_CASE_MANAGER_AVAILABILITY}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    }
    if (formik.values.localOffice) {
      fetchCaseManagerAvailibility();
    }
  }, [formik.values.localOffice]);

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

  useEffect(() => {
    async function fetchCaseOfficeName() {
      try {
        const data =
          process.env.REACT_APP_ENV === "mockserver"
            ? await client.get(reassignCaseOfficeNameURL)
            : await client.get(`${reassignCaseOfficeNameURL}${caseNum}`);
        setCaseOfficeName(data);
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `GET:${process.env.REACT_APP_REASSIGN_CASE_OFFICE_NAME}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    }
    fetchCaseOfficeName();
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        <Stack direction={"column"} spacing={2}>
          <Stack
            direction="row"
            sx={{ display: "flex", flexDirection: "column" }}
          >
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
                />
              </RadioGroup>
              <Typography
                sx={{
                  alignSelf: "center",
                  color: "orange",
                  marginLeft: 1,
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
              >
                {caseMgrAvl?.map((reason) => (
                  <MenuItem key={reason.id} value={reason.id}>
                    {reason.name}
                  </MenuItem>
                ))}
              </Select>
              {formik?.errors?.caseManagerAvl && (
                <FormHelperText error>
                  {formik.errors.caseManagerAvl}
                </FormHelperText>
              )}
            </FormControl>
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

export default ReAssignCase;
