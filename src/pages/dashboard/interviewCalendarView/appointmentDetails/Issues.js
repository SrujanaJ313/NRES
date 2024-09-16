import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import IconButton from "@mui/material/IconButton";

import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Select,
  MenuItem,
} from "@mui/material";
import { nmiListURL } from "../../../../helpers/Urls";
import client from "../../../../helpers/Api";
import moment from "moment";
import { getMsgsFromErrorCode } from "../../../../helpers/utils";

function Issues({ formik, caseDetails, disableForm }) {
  const { touched, values, errors, setFieldValue } = formik;

  const [issues, setIssues] = useState([]);
  const [subIssues, setSubIssues] = useState({});
  const [errorMessages, setErrorMessages] = useState([]);

  const addNewRow = () => {
    const displayRows = [...values.otherIssues];
    displayRows.push({
      issueType: "",
      issueSubType: "",
      startDt: null,
      endDt: null,
    });
    setFieldValue(`otherIssues`, displayRows);
  };

  useEffect(() => {
    fetchIssueList();
  }, []);

  useEffect(() => {
    if (disableForm) {
      [...values.otherIssues].forEach((issue) => {
        fetchSubIssuesList(issue.issueType);
      });
    }
  }, [disableForm, values.otherIssues]);

  const fetchIssueList = async () => {
    try {
      setErrorMessages([]);
      const body = {
        issueId: 0,
        module: "resea",
        page: "appointmentDetails",
      };
      const response = await client.post(nmiListURL, body);
      setIssues(response);
    } catch (errorResponse) {
      const newErrMsgs = getMsgsFromErrorCode(
        `POST:${process.env.REACT_APP_NMI_LIST}`,
        errorResponse
      );
      setErrorMessages(newErrMsgs);
    }
  };

  const fetchSubIssuesList = async (issueTypeId) => {
    if (!subIssues[issueTypeId]) {
      try {
        setErrorMessages([]);
        const body = {
          issueId: issueTypeId,
          module: "resea",
          page: "appointmentDetails",
        };
        const response = await client.post(nmiListURL, body);
        const subTypes = { ...subIssues };
        subTypes[issueTypeId] = response;
        setSubIssues(subTypes);
      } catch (errorResponse) {
        const newErrMsgs = getMsgsFromErrorCode(
          `POST:${process.env.REACT_APP_NMI_LIST}`,
          errorResponse
        );
        setErrorMessages(newErrMsgs);
      }
    }
  };

  const handleCheckboxChange = (event, index) => {
    const rowData = [...values.otherIssues];
    const { checked } = event.target;
    rowData[index].selected = checked;
    if (!checked) {
      rowData[index].issueType = "";
      rowData[index].issueSubType = "";
      rowData[index].startDt = null;
      rowData[index].endDt = null;
    }
    setFieldValue(`otherIssues`, rowData);
  };

  const handleIssueTypeChange = (value, index) => {
    const rowData = [...values.otherIssues];
    rowData[index].issueType = value;
    rowData[index].issueSubType = "";
    setFieldValue(`otherIssues`, rowData);
    fetchSubIssuesList(value);
  };

  const handleIssueSubTypeChange = (value, index) => {
    const rowData = [...values.otherIssues];
    rowData[index].issueSubType = value;
    setFieldValue(`otherIssues`, rowData);
  };

  const handleDateChange = (value, index, type) => {
    const rowData = [...values.otherIssues];
    rowData[index][type] = value;
    setFieldValue(`otherIssues`, rowData);
  };

  const handleRemoveClick = (index) => {
    const rowData = [...values.otherIssues];
    rowData.splice(index, 1);
    setFieldValue(`otherIssues`, rowData);
  };

  return (
    <Stack>
      <Typography className="label-text">
        Create issues, if any, based on the information you gathered during this
        interview
      </Typography>

      <Stack mt={1.2}>
        {values.otherIssues?.map((row, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="start"
            flex={1}
            // spacing={2}
            sx={{ mb: 1.2 }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ py: 0 }}
                  checked={values.otherIssues[index].selected}
                  onChange={(event) => handleCheckboxChange(event, index)}
                  disabled={disableForm}
                />
              }
              sx={{
                marginRight: 0,
              }}
            />
            <Stack direction="row" alignItems="start" spacing={2}>
              <Stack>
                <FormControl sx={{ width: "13rem" }} size="small">
                  <InputLabel>Issue Type</InputLabel>
                  <Select
                    size="small"
                    label="Issue Type"
                    placeholder="Issue Type"
                    value={row.issueType}
                    onChange={(event) =>
                      handleIssueTypeChange(event.target.value, index)
                    }
                    disabled={
                      !values.otherIssues?.[index].selected || disableForm
                    }
                  >
                    {issues.map((issue) => (
                      <MenuItem key={issue.issueId} value={issue.issueId}>
                        {issue.issueDesc}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {touched.otherIssues?.[index]?.issueType &&
                  errors.otherIssues?.[index]?.issueType && (
                    <FormHelperText style={{ color: "red" }}>
                      {errors.otherIssues?.[index]?.issueType}
                    </FormHelperText>
                  )}
              </Stack>
              <Stack>
                <FormControl sx={{ width: "13rem" }} size="small">
                  <InputLabel>Issue Sub Type</InputLabel>
                  <Select
                    size="small"
                    label="Issue Sub Type"
                    value={row.issueSubType}
                    onChange={(event) =>
                      handleIssueSubTypeChange(event.target.value, index)
                    }
                    disabled={
                      !values.otherIssues?.[index].selected || disableForm
                    }
                  >
                    {subIssues[row.issueType]?.map((subIssue) => (
                      <MenuItem key={subIssue.issueId} value={subIssue.issueId}>
                        {subIssue.issueDesc}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {touched.otherIssues?.[index]?.issueSubType &&
                  errors.otherIssues?.[index]?.issueSubType && (
                    <FormHelperText style={{ color: "red" }}>
                      {errors.otherIssues?.[index]?.issueSubType}
                    </FormHelperText>
                  )}
              </Stack>
              <Stack justifyContent="flex-start" alignItems="baseline">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <FormControl style={{ width: "9rem" }}>
                    <DatePicker
                      name="start"
                      label="Start Date"
                      slotProps={{
                        textField: { size: "small" },
                      }}
                      value={row.startDt ? moment(row.startDt) : null}
                      onChange={(value) => {
                        handleDateChange(value, index, "startDt");
                      }}
                      disabled={
                        !values.otherIssues[index].selected || disableForm
                      }
                      minDate={moment()}
                      maxDate={moment(caseDetails.clmByDt)}
                    />
                  </FormControl>
                </LocalizationProvider>
                {touched.otherIssues?.[index]?.startDt &&
                  errors.otherIssues?.[index]?.startDt && (
                    <FormHelperText style={{ color: "red" }}>
                      {errors.otherIssues?.[index]?.startDt}
                    </FormHelperText>
                  )}
              </Stack>
              <Stack justifyContent="flex-start" alignItems="baseline">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <FormControl style={{ width: "9rem" }}>
                    <DatePicker
                      name="end"
                      slotProps={{
                        textField: { size: "small" },
                      }}
                      label="End Date"
                      value={row.endDt ? moment(row.endDt) : null}
                      onChange={(value) => {
                        handleDateChange(value, index, "endDt");
                      }}
                      disabled={
                        !values.otherIssues[index].selected || disableForm
                      }
                      minDate={moment(row.startDt)}
                    />
                  </FormControl>
                </LocalizationProvider>
                {touched.otherIssues?.[index]?.endDt &&
                  errors.otherIssues?.[index]?.endDt && (
                    <FormHelperText style={{ color: "red" }}>
                      {errors.otherIssues?.[index]?.endDt}
                    </FormHelperText>
                  )}
              </Stack>
              <IconButton
                sx={{ padding: "0px", marginRight: "20px !important" }}
                onClick={() => handleRemoveClick(index)}
                disabled={values.otherIssues.length === 1 || disableForm}
              >
                <RemoveCircleIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        ))}
        <Stack
          direction="row"
          justifyContent="end"
          sx={{ mt: "0px !important" }}
        >
          <Button
            sx={{ paddingY: 0 }}
            onClick={addNewRow}
            disabled={disableForm}
          >
            + Add more
          </Button>
        </Stack>
      </Stack>
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

export default Issues;

