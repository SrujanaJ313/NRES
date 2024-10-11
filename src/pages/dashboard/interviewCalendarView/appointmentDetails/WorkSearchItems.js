import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import {
  FormControlLabel,
  Checkbox,
  Button,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import client from "../../../../helpers/Api";
import { nmiListURL } from "../../../../helpers/Urls";
import { getMsgsFromErrorCode } from "../../../../helpers/utils";

function WorkSearchItems({ data, formik, disableForm }) {
  const { touched, values, errors, setFieldValue } = formik;

  const [rows, setRows] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [issues, setIssues] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    if (data.length > 3) {
      const displayRows = [...data].slice(0, 3);
      setRows(displayRows);
    } else {
      setRows(data);
    }
  }, [data]);

  useEffect(() => {
    fetchIssueList();
  }, []);

  const fetchIssueList = async () => {
    try {
      setErrorMessages([]);
      const body = {
        issueId: 2,
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

  const handleRows = () => {
    if (showMore) {
      const displayRows = [...data].slice(0, 3);
      setRows(displayRows);
    } else {
      setRows(data);
    }
    setShowMore(!showMore);
  };

  const handleCheckboxChange = (event, index) => {
    const items = [...values.workSearchIssues];
    const { name, checked } = event.target;
    if (checked) {
      items.push({
        recent: index <= 2,
        weekEndingDt: name,
        status: "",
        activelySeekingWork: "",
        recentItemsCount: rows.length <= 2 ? rows.length : 3,
      });
    } else {
      const index = items.findIndex((x) => x.weekEndingDt === name);
      items.splice(index, 1);
    }
    setFieldValue(`workSearchIssues`, [...items]);
  };

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    const items = [...values.workSearchIssues];
    const index = items.findIndex((x) => x.weekEndingDt === name);

    items[index] = {
      recent: items[index].recent,
      weekEndingDt: name,
      status: value,
      activelySeekingWork: "",
      recentItemsCount: rows.length <= 2 ? rows.length : 3,
    };
    setFieldValue(`workSearchIssues`, [...items]);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    const items = [...values.workSearchIssues];
    const index = items.findIndex((x) => x.weekEndingDt === name);

    items[index] = {
      recent: items[index].recent,
      weekEndingDt: name,
      status: "createIssue",
      activelySeekingWork: value,
      recentItemsCount: rows.length <= 2 ? rows.length : 3,
    };
    setFieldValue(`workSearchIssues`, [...items]);
  };

  const getSelectedRadioOption = (key) => {
    const item = [...values.workSearchIssues].find(
      (x) => x.weekEndingDt === key
    );

    return item?.status || "";
  };

  const getSelectedDropdownOption = (key) => {
    const item = [...values.workSearchIssues].find(
      (x) => x.weekEndingDt === key
    );

    return item?.activelySeekingWork || "";
  };

  const isChecked = (key) => {
    const index = [...values.workSearchIssues].findIndex(
      (x) => x.weekEndingDt === key
    );
    return index >= 0;
  };

  const isCheckedIndex = (key) => {
    const index = [...values.workSearchIssues].findIndex(
      (x) => x.weekEndingDt === key
    );
    return index;
  };

  const checkSelectDisabled = (key) => {
    const item = [...values.workSearchIssues].find(
      (x) => x.weekEndingDt === key
    );
    return item && item.status === "createIssue";
  };

  return (
    <Stack>
      <Typography className="label-text">
        Please indicate the status of your review of the claimants work search
      </Typography>

      <Stack>
        {rows.map((row, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="flex-start"
            flex={1}
            spacing={2}
            sx={{ mb: 0.5 }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked(row.weekEndingDt)}
                  onChange={(event) => handleCheckboxChange(event, index)}
                  name={row.weekEndingDt}
                  sx={{ py: 0, pl: 0 }}
                  disabled={disableForm}
                />
              }
              label={`Week ending ${row.weekEndingDt}:`}
            />
            <RadioGroup
              aria-labelledby="demo-error-radios"
              name={row.weekEndingDt}
              value={getSelectedRadioOption(row.weekEndingDt)}
              onChange={handleRadioChange}
            >
              <Stack direction="row" alignItems="flex-start">
                <FormControlLabel
                  value="noIssues"
                  control={
                    <Radio
                      size="small"
                      checked={
                        getSelectedRadioOption(row.weekEndingDt) === "noIssues"
                      }
                      sx={{ py: 0 }}
                      disabled={!isChecked(row.weekEndingDt) || disableForm}
                    />
                  }
                  label="No Issues"
                />
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <FormControlLabel
                    value="createIssue"
                    control={
                      <Radio
                        size="small"
                        checked={
                          getSelectedRadioOption(row.weekEndingDt) ===
                          "createIssue"
                        }
                        sx={{ py: 0 }}
                        disabled={!isChecked(row.weekEndingDt) || disableForm}
                      />
                    }
                    label="Create Issue: Actively Seeking Work -"
                  />
                  <FormControl sx={{ width: 150 }} size="small">
                    <Select
                      size="small"
                      disabled={
                        !checkSelectDisabled(row.weekEndingDt) || disableForm
                      }
                      value={getSelectedDropdownOption(row.weekEndingDt)}
                      onChange={handleSelectChange}
                      name={row.weekEndingDt}
                    >
                      {issues.map((issue) => (
                        <MenuItem key={issue.issueId} value={issue.issueId}>
                          {issue.issueDesc}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.workSearchIssues?.[
                      isCheckedIndex(row.weekEndingDt)
                    ]?.activelySeekingWork &&
                      errors.workSearchIssues?.[
                        isCheckedIndex(row.weekEndingDt)
                      ]?.activelySeekingWork && (
                        <FormHelperText style={{ color: "red" }}>
                          {
                            errors.workSearchIssues?.[
                              isCheckedIndex(row.weekEndingDt)
                            ]?.activelySeekingWork
                          }
                        </FormHelperText>
                      )}
                  </FormControl>
                </Stack>
              </Stack>
              {touched.workSearchIssues?.[isCheckedIndex(row.weekEndingDt)]
                ?.status &&
                errors.workSearchIssues?.[isCheckedIndex(row.weekEndingDt)]
                  ?.status && (
                  <FormHelperText style={{ color: "red" }}>
                    {
                      errors.workSearchIssues?.[
                        isCheckedIndex(row.weekEndingDt)
                      ]?.status
                    }
                  </FormHelperText>
                )}
            </RadioGroup>
          </Stack>
        ))}
        {touched.workSearchIssues &&
          errors.workSearchIssues &&
          typeof errors.workSearchIssues === "string" && (
            <FormHelperText style={{ color: "red" }}>
              {errors.workSearchIssues}
            </FormHelperText>
          )}
        <Stack
          direction="row"
          justifyContent="end"
          sx={{ mt: "0px !important" }}
        >
          <Button
            disabled={disableForm}
            sx={{ paddingY: 0 }}
            onClick={handleRows}
          >
            {showMore ? "- Add less" : "+ Add more"}
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

export default WorkSearchItems;
