import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { mapToGenericKeys } from "../../../helpers/utils";

export default function ExpandableTableRow({
  labelName,
  options,
  formik,
  fieldName,
  setErrorMessages,
}) {
  const [selectedValues, setSelectedValues] = useState(
    formik.values?.[fieldName] || []
  );
  const modifiedOptions = mapToGenericKeys(options);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // Convert to array and update states
    const newValues = typeof value === "string" ? value.split(",") : value;
    setSelectedValues(newValues);
    formik.setFieldValue(fieldName, newValues);
    setErrorMessages([]); // Clear errors when value changes
  };

  return (
    <Box sx={{ width: "94%" }}>
      <FormControl fullWidth>
        <InputLabel
          sx={{
            color: "#183084",
            fontWeight: "bold",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "10px",
            pointerEvents: "none",
            transition: "all 0.2s ease-out",
            "&.Mui-focused, &.MuiFormLabel-filled": {
              top: "0",
              transform: "translateY(1)",
              fontSize: "10px",
            },
          }}
          id={`${fieldName}-label`}
          shrink={false}
        >
          {labelName}
        </InputLabel>
        <Select
          labelId={`${fieldName}-label`}
          id={`${fieldName}-select`}
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput id={`${fieldName}-input`} label={labelName} />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((id) => {
                const option = modifiedOptions.find((opt) => opt.id === id);
                return (
                  <Chip
                    key={id}
                    size={"small"}
                    label={option?.value || id}
                    sx={{ padding: "5px" }}
                  />
                );
              })}
            </Box>
          )}
          sx={{ height: !selectedValues.length ? "35px" : "100%" }}
        >
          {modifiedOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

