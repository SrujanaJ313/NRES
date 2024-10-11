import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  FormHelperText,
} from "@mui/material";
import { switchModeReasonsURL, switchModeSaveURL } from "../../../helpers/Urls";
import client from "../../../helpers/Api";
import { useFormik } from "formik";
import IssueSubIssueType from "../../../components/issueSubIssueType";
import { v4 as uuidv4 } from "uuid";
import {
  CookieNames,
  getCookieItem,
  isUpdateAccessExist,
} from "../../../utils/cookies";
import { convertISOToMMDDYYYY } from "../../../helpers/utils";
import { switchValidationSchema } from "../../../helpers/Validation";
import { getMsgsFromErrorCode } from "../../../helpers/utils";
import { useSnackbar } from "../../../context/SnackbarContext";

function Switch({ onCancel, event, onSubmitClose }) {
  const showSnackbar = useSnackbar();

  const [errors, setErrors] = useState([]);
  const [switchModeReasons, setSwitchReasons] = useState([]);

  useEffect(() => {
    async function fetchSwitchModeReasons() {
      try {
        const data =
          process.env.REACT_APP_ENV === "mockserver"
            ? await client.get(switchModeReasonsURL)
            : await client.get(
                `${switchModeReasonsURL}?currentmeetingmode=${event?.appointmentType}`
              );
        setSwitchReasons(
          data?.map((d) => ({ id: d.constId, name: d.constShortDesc }))
        );
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `GET:${process.env.REACT_APP_SWITCH_MODE}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    }
    fetchSwitchModeReasons();
  }, []);

  const formik = useFormik({
    initialValues: {
      reasonForSwitchMeetingMode: "",
      meetingModeChgReasonTxt: "",
      staffNotes: "",
      issues: [
        {
          id: uuidv4(),
          issueType: {},
          subIssueType: {},
          issueStartDate: null,
          issueEndDate: null,
        },
      ],
    },
    validationSchema: switchValidationSchema,
    onSubmit: async (values) => {
      const issuesDTOList = [];
      const userId = getCookieItem(CookieNames.USER_ID);

      values.issues.forEach((issue) => {
        if (issue?.subIssueType?.issueId) {
          issuesDTOList.push({
            issueId: issue.subIssueType.issueId,
            startDt: convertISOToMMDDYYYY(issue.issueStartDate),
            endDt: issue.issueEndDate
              ? convertISOToMMDDYYYY(issue.issueEndDate)
              : null,
          });
        }
      });

      try {
        let payload = {
          // userId,
          eventId: event?.id,
          currentMeetingMode: event?.appointmentType,
          reasonForSwitchMeetingMode: values?.reasonForSwitchMeetingMode,
          meetingModeChgReasonTxt: values?.meetingModeChgReasonTxt,
          staffNotes: values?.staffNotes,
        };

        if (issuesDTOList?.length) {
          payload = { ...payload, issuesDTOList };
        }

        await client.post(switchModeSaveURL, payload);
        showSnackbar("Your request has been recorded successfully.", 5000);
        onSubmitClose();
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `POST:${process.env.REACT_APP_SWITCH_SAVE}`,
          errorResponse
        );
        setErrors(newErrMsgs);
      }
    },
    validateOnChange: true,
    validateOnBlur: false,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        <Stack direction={"column"} spacing={2}>
          <Stack direction={"column"} justifyContent={"space-between"}>
            <FormControl size="small" fullWidth sx={{ marginTop: "20px" }}>
              <InputLabel id="reschedule-request-dropdown">
                *Reason for switching meeting mode
              </InputLabel>
              <Select
                labelId="reschedule-request-dropdown"
                label="*Reason for switching meeting mode"
                value={formik.values.reasonForSwitchMeetingMode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="reasonForSwitchMeetingMode"
                sx={{ width: "50%" }}
              >
                {switchModeReasons?.map((reason) => (
                  <MenuItem key={reason.id} value={reason.id}>
                    {reason.name}
                  </MenuItem>
                ))}
              </Select>
              {formik?.errors?.reasonForSwitchMeetingMode && (
                <FormHelperText error>
                  {formik.errors.reasonForSwitchMeetingMode}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>

          <Stack direction={"column"} spacing={2}>
            {formik?.values?.reasonForSwitchMeetingMode === 5696 && (
              <TextField
                name="meetingModeChgReasonTxt"
                label="*Additional Details, if any"
                size="small"
                value={formik.values.meetingModeChgReasonTxt}
                onChange={formik.handleChange}
                variant="outlined"
                multiline
                rows={3}
                fullWidth
              />
            )}
            {formik?.errors?.meetingModeChgReasonTxt && (
              <FormHelperText error>
                {formik.errors.meetingModeChgReasonTxt}
              </FormHelperText>
            )}
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
          <Typography className="label-text" marginTop={"8px !important"}>
            Create issues, if any, based on the information associated with this
            request:
          </Typography>
          <Stack spacing={2}>
            <IssueSubIssueType formik={formik} />
          </Stack>

          {!!errors?.length && (
            <Stack mt={1} direction="column" useFlexGap flexWrap="wrap">
              {errors.map((x) => (
                <div>
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

export default Switch;
