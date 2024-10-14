import React from "react";
import Stack from "@mui/material/Stack";

import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import moment from "moment";
import {
  FormControlLabel,
  Checkbox,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { OTHER_ACTIONS_SELF_SCHEDULE } from "../../../../helpers/Constants";

function OtherActions({ formik, otherActionsList, event, disableForm }) {
  const { touched, values, errors, setFieldValue } = formik;

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFieldValue(`actionTaken.${name}`, checked);
  };

  const handleRadioChange = (event) => {
    const { name, value } = event.target;

    setFieldValue(name, value);
  };

  const handleDateValueChange = (value, name) => {
    setFieldValue(name, value);
  };

  return (
    <Stack>
      <Typography className="label-text">
        Please indicate other actions taken
      </Typography>

      <Stack direction="row" sx={{ flexWrap: "wrap" }}>
        {otherActionsList?.map((item, index) => (
          <Stack
            sx={{
              width: index % 2 === 0 ? "40%" : "60%",
            }}
          >
            <Stack
              key={item.value + index}
              direction="row"
              spacing={1}
              alignItems="flex-start"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ py: 0, pl: 0 }}
                    checked={values.actionTaken[item.value]}
                    onChange={handleCheckboxChange}
                    name={item.value}
                    disabled={disableForm}
                  />
                }
                label={item.label}
                sx={{
                  marginRight: 0,
                }}
              />
              {item.radio && (
                <RadioGroup
                  aria-labelledby="demo-error-radios"
                  name={item.radioFieldName}
                  value={values[item.radioFieldName]}
                  onChange={handleRadioChange}
                >
                  <Stack direction="row">
                    <FormControlLabel
                      value="Chapter1To4"
                      control={
                        <Radio
                          size="small"
                          checked={
                            values[item.radioFieldName] === "Chapter1To4"
                          }
                          sx={{ py: 0 }}
                          disabled={
                            !values.actionTaken[item.value] || disableForm
                          }
                        />
                      }
                      label="Chapters 1 to 4"
                    />
                    <FormControlLabel
                      value="Chapter5To10"
                      control={
                        <Radio
                          size="small"
                          checked={
                            values[item.radioFieldName] === "Chapter5To10"
                          }
                          sx={{ py: 0 }}
                          disabled={
                            !values.actionTaken[item.value] || disableForm
                          }
                        />
                      }
                      label="Chapters 5 to 10"
                    />
                  </Stack>
                  {touched[item.radioFieldName] &&
                    errors[item.radioFieldName] && (
                      <FormHelperText style={{ color: "red" }}>
                        {errors[item.radioFieldName]}
                      </FormHelperText>
                    )}
                </RadioGroup>
              )}

              {item.date && (
                <Stack justifyContent="flex-start" alignItems="baseline">
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <FormControl style={{ width: "9rem", marginLeft: 10 }}>
                      <DatePicker
                        name={item.value}
                        format="MM/DD/YYYY"
                        slotProps={{
                          textField: { size: "small" },
                        }}
                        value={
                          values[item.dateFieldName]
                            ? moment(values[item.dateFieldName])
                            : values?.selfSchByDt
                        }
                        // value={
                        //   values[item.dateFieldName]
                        //     ? moment(values[item.dateFieldName])
                        //     : null
                        // }
                        onChange={(value) => {
                          handleDateValueChange(value, item.dateFieldName);
                        }}
                        disabled={
                          !values.actionTaken[item.value] || disableForm
                        }
                        minDate={moment()}
                        maxDate={moment(event.appointmentDt).add(
                          OTHER_ACTIONS_SELF_SCHEDULE,
                          "days"
                        )}
                      />
                    </FormControl>
                    {touched[item.dateFieldName] &&
                      errors[item.dateFieldName] && (
                        <FormHelperText style={{ color: "red" }}>
                          {errors[item.dateFieldName]}
                        </FormHelperText>
                      )}
                  </LocalizationProvider>
                </Stack>
              )}
            </Stack>
            {touched.actionTaken?.[item.value] &&
              errors.actionTaken?.[item.value] && (
                <FormHelperText style={{ color: "red" }}>
                  {errors.actionTaken[item.value]}
                </FormHelperText>
              )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default OtherActions;
