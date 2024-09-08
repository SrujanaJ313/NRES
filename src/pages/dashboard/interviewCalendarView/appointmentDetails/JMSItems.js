import React from "react";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import IconButton from "@mui/material/IconButton";
import {
  FormControlLabel,
  FormHelperText,
  Checkbox,
  FormControl,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";

function JMSItems({ formik, jmsItemsList }) {
  const { touched, values, errors, handleBlur, setFieldValue } = formik;

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFieldValue(`jmsItems.${name}`, checked);
    if (name === "OutsideWebReferral") {
      setFieldValue("outsideWebReferral", []);
    }
    if (name === "JMSJobReferral") {
      setFieldValue("jMSJobReferral", []);
    }
    if (name === "ActiveVirtualRecuiter" && !checked) {
      setFieldValue("rsidJmsVRecrtExpDt", null);
    }
    if (name === "ActiveResume" && !checked) {
      setFieldValue("rsidJmsResumeExpDt", null);
    }

    if (name === "JMSRegComplete") {
      setFieldValue("jmsItems.JMSRegIncomplete", false);
    }
    if (name === "JMSRegIncomplete") {
      setFieldValue("jmsItems.JMSRegComplete", false);
    }
  };

  const handleDateValueChange = (value, name) => {
    setFieldValue(name, value);
  };

  const handleShowEditChange = (name) => {
    const valueExists = values[name]?.length > 0;

    const value = valueExists
      ? []
      : [
          {
            jobTitle: "",
            employerName: "",
          },
        ];
    setFieldValue(name, value);
  };

  const handleNewAddRow = (name) => {
    const rows = values[name];
    rows.push({
      jobTitle: "",
      employerName: "",
    });
    setFieldValue(name, rows);
  };

  const handleRemoveRow = (index, name) => {
    const rows = values[name];
    rows.splice(index, 1);
    setFieldValue(name, rows);
  };

  const handleTextChange = (event, index, key) => {
    const rows = values[key];
    const { name, value } = event.target;
    rows[index][name] = value;
    setFieldValue(key, rows);
  };

  return (
    <Stack>
      <Typography className="label-text">
        Please check off each of the items listed below that you have completed
        in JMS
      </Typography>

      <Stack direction="row" sx={{ flexWrap: "wrap" }}>
        {jmsItemsList?.map((item, index) => (
          <>
            <Stack
              key={item.value}
              // sx={{
              //   width: index % 3 === 0 ? "50%" : index > 12 ? "50%" : "25%",
              // }}
              sx={{
                width: "33%",
              }}
            >
              <Stack direction={item.date ? "column" : "row"}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ py: 0 }}
                      checked={values.jmsItems[item.value]}
                      onChange={handleCheckboxChange}
                      name={item.value}
                    />
                  }
                  label={item.label}
                  sx={{
                    marginRight: 0,
                  }}
                />
                {item.edit && (
                  <IconButton
                    size="small"
                    aria-label="close"
                    disabled={!values.jmsItems[item.value]}
                    onClick={() => {
                      handleShowEditChange(item.editFieldName);
                    }}
                  >
                    <EditIcon sx={{ width: 16, height: 16 }} />
                  </IconButton>
                )}
                {item.date && (
                  <Stack justifyContent="flex-start" alignItems="baseline">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <FormControl
                        style={{
                          width: "9rem",
                          marginLeft: "2rem",
                          position: "relative",
                          top: "-4px",
                        }}
                      >
                        <DatePicker
                          name={item.dateFieldName}
                          format="MM/DD/YYYY"
                          slotProps={{
                            textField: { size: "small" },
                          }}
                          value={values[item.dateFieldName]}
                          onChange={(value) => {
                            handleDateValueChange(value, item.dateFieldName);
                          }}
                          disabled={!values.jmsItems[item.value]}
                          minDate={moment()}
                        />
                      </FormControl>
                    </LocalizationProvider>
                    {touched[item.dateFieldName] &&
                      errors[item.dateFieldName] && (
                        <FormHelperText style={{ color: "red" }}>
                          {errors[item.dateFieldName]}
                        </FormHelperText>
                      )}
                  </Stack>
                )}
              </Stack>

              {touched.jmsItems?.[item.value] &&
                errors.jmsItems?.[item.value] && (
                  <FormHelperText style={{ color: "red" }}>
                    {errors.jmsItems[item.value]}
                  </FormHelperText>
                )}
              {touched?.[item.editFieldName] &&
                errors?.[item.editFieldName] &&
                typeof errors?.[item.editFieldName] === "string" && (
                  <FormHelperText style={{ color: "red" }}>
                    {errors?.[item.editFieldName]}
                  </FormHelperText>
                )}
            </Stack>
            <Stack direction="row">
              {values[item.editFieldName]?.length > 0 && (
                <Stack mb={0.5} style={{ width: "40rem" }}>
                  <Accordion defaultExpanded={true}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      open
                    >
                      {item.label}
                    </AccordionSummary>
                    <AccordionDetails style={{ paddingTop: "0" }}>
                      <Stack sx={{ maxHeight: "15rem", overflowY: "scroll" }}>
                        {values[item.editFieldName]?.map((row, index) => (
                          <Stack
                            key={index}
                            direction="row"
                            alignItems="center"
                            flex={1}
                            spacing={1}
                            sx={{ mt: 1.2 }}
                          >
                            <FormControl
                              size="small"
                              style={{ width: "15rem" }}
                            >
                              <TextField
                                type="text"
                                variant="outlined"
                                size="small"
                                name="employerName"
                                label="Employer Name"
                                value={row.employerName}
                                onChange={(event) =>
                                  handleTextChange(
                                    event,
                                    index,
                                    item.editFieldName
                                  )
                                }
                                onBlur={handleBlur}
                                error={
                                  touched[item.editFieldName]?.[index]
                                    ?.employerName &&
                                  errors[item.editFieldName]?.[index]
                                    ?.employerName
                                }
                              />
                            </FormControl>
                            <FormControl
                              size="small"
                              style={{ width: "15rem" }}
                            >
                              <TextField
                                type="text"
                                variant="outlined"
                                size="small"
                                name="jobTitle"
                                label="Job Title"
                                value={row.jobTitle}
                                onChange={(event) =>
                                  handleTextChange(
                                    event,
                                    index,
                                    item.editFieldName
                                  )
                                }
                                onBlur={handleBlur}
                                error={
                                  touched[item.editFieldName]?.[index]
                                    ?.jobTitle &&
                                  errors[item.editFieldName]?.[index]?.jobTitle
                                }
                              />
                            </FormControl>
                            <IconButton
                              sx={{
                                padding: "0px",
                                marginRight: "20px !important",
                              }}
                              onClick={() =>
                                handleRemoveRow(index, item.editFieldName)
                              }
                              disabled={
                                values[item.editFieldName]?.length === 1
                              }
                            >
                              <RemoveCircleIcon
                                fontSize="small"
                                // sx={{ fill: "#183084" }}
                                color="error"
                              />
                            </IconButton>
                          </Stack>
                        ))}

                        <Stack
                          direction="row"
                          justifyContent="end"
                          sx={{ mt: "0px !important" }}
                        >
                          <Button
                            sx={{ paddingY: 0 }}
                            onClick={() => handleNewAddRow(item.editFieldName)}
                          >
                            + Add more
                          </Button>
                        </Stack>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              )}
            </Stack>
          </>
        ))}
      </Stack>
      {touched.jmsItems &&
        errors.jmsItems &&
        typeof errors.jmsItems === "string" && (
          <FormHelperText style={{ color: "red" }}>
            {errors.jmsItems}
          </FormHelperText>
        )}
    </Stack>
  );
}

export default JMSItems;
