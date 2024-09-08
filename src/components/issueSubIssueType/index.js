import React, { useState, useEffect } from "react";
import {
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  TextField,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { v4 as uuidv4 } from "uuid";
import { reschedulingIssueListURL } from "../../helpers/Urls";
import client from "../../helpers/Api";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import IconButton from "@mui/material/IconButton";

const IssueSubIssueType = ({ formik }) => {
  const [issueTypes, setIssueTypes] = useState([]);
  const [subIssueTypes, setSubIssueTypes] = useState([]);
  useEffect(() => {
    const fetchIssueTypes = async () => {
      try {
        const payload = {
          issueId: 0,
          module: "resea",
          page: "reschedule",
        };
        const data =
          process.env.REACT_APP_ENV === "mockserver"
            ? await client.get(reschedulingIssueListURL)
            : await client.post(reschedulingIssueListURL, payload);
        setIssueTypes(data);
      } catch (err) {
        console.error("Error in fetchIssueTypes", err);
      }
    };
    fetchIssueTypes();
  }, []);

  const fetchSubIssueTypes = async (issueId) => {
    try {
      const payload = {
        issueId: issueId,
        module: "resea",
        page: "reschedule",
      };
      const data =
        process.env.REACT_APP_ENV === "mockserver"
          ? await client.get(reschedulingIssueListURL)
          : await client.get(`${reschedulingIssueListURL}${issueId}`);
      setSubIssueTypes(data);
    } catch (err) {
      console.error("Error in fetchSubIssueTypes", err);
    }
  };

  const addIssue = () => {
    formik.setFieldValue("issues", [
      ...formik.values.issues,
      {
        id: uuidv4(),
        issueChecked: false,
        issueType: "",
        subIssueType: "",
        issueStartDate: null,
      },
    ]);
  };

  const handleRemoveClick = (id) => {
    const updatedIssues = formik.values.issues.filter(
      (issue) => issue.id !== id
    );
    formik.setFieldValue("issues", updatedIssues);
  };

  const handleFieldChange = (id, field, value) => {
    const updatedIssues = formik.values.issues.map((issue) =>
      issue.id === id ? { ...issue, [field]: value } : issue
    );
    formik.setFieldValue("issues", updatedIssues);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        {formik.values.issues.map((element) => (
          <Stack
            key={element.id}
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <FormControl variant="outlined" sx={{ minWidth: 200 }} size="small">
              <InputLabel id="IssueType">*Issue Type</InputLabel>
              <Select
                label="Issue Type"
                value={element.issueType.issueDesc}
                onChange={(e) => {
                  const issueType = issueTypes.find(
                    (i) => i.issueDesc === e.target.value
                  );
                  handleFieldChange(element.id, "issueType", issueType);
                  fetchSubIssueTypes(issueType.issueId);
                }}
                required
              >
                {issueTypes?.map((issue) => (
                  <MenuItem key={issue.issueId} value={issue.issueDesc}>
                    {issue.issueDesc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ minWidth: 200 }} size="small">
              <InputLabel id="IssueSubType">*Issue SubType</InputLabel>
              <Select
                label="Issue SubType"
                value={element.subIssueType.issueDesc}
                onChange={(e) => {
                  const subIssueType = subIssueTypes.find(
                    (s) => s.issueDesc === e.target.value
                  );
                  handleFieldChange(element.id, "subIssueType", subIssueType);
                }}
              >
                {subIssueTypes?.map((subIssue) => (
                  <MenuItem key={subIssue.issueId} value={subIssue.issueDesc}>
                    {subIssue.issueDesc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <FormControl style={{ width: "9rem", marginLeft: 10 }}>
                <DatePicker
                  label="*Start Date"
                  disablePast
                  slotProps={{
                    textField: { size: "small" },
                  }}
                  value={element.issueStartDate}
                  onChange={(date) => {
                    handleFieldChange(element.id, "issueStartDate", date);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" variant="outlined" />
                  )}
                />
              </FormControl>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <FormControl style={{ width: "9rem", marginLeft: 10 }}>
                <DatePicker
                  label="*End Date"
                  disablePast
                  slotProps={{
                    textField: { size: "small" },
                  }}
                  value={element.issueEndDate}
                  onChange={(date) => {
                    handleFieldChange(element.id, "issueEndDate", date);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" variant="outlined" />
                  )}
                />
              </FormControl>
            </LocalizationProvider>
            <IconButton
              sx={{ padding: "0px", marginRight: "20px !important" }}
              onClick={() => handleRemoveClick(element.id)}
              disabled={element.id === formik.values.issues[0].id}
            >
              <RemoveCircleIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        {formik?.errors?.issues?.length && (
          <Stack
            mt={1}
            direction="column"
            useFlexGap
            flexWrap="wrap"
            width={"85%"}
          >
            {formik?.errors.issues.map((error) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <FormHelperText error>{error.issueType}</FormHelperText>
                <FormHelperText error>{error.subIssueType}</FormHelperText>
                <FormHelperText error>{error.issueStartDate}</FormHelperText>
                <FormHelperText error>{error.issueEndDate}</FormHelperText>
              </div>
            ))}
          </Stack>
        )}
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="text" type="Button" onClick={addIssue}>
            + Add more
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default IssueSubIssueType;
