import React, { useState } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput } from "@mui/material";
import { mapToGenericKeys } from "../../../helpers/utils";

export default function ExpandableTableRow({
  labelName,
  options,
  formik,
  fieldName,
  setErrorMessages,
}) {
  const [selectedValues, setSelectedValues] = useState(formik.values?.[fieldName] || []);
  const modifiedOptions = mapToGenericKeys(options);

  const handleChange = (event) => {
    const { target: { value } } = event;

    // Convert to array and update states
    const newValues = typeof value === "string" ? value.split(",") : value;
    setSelectedValues(newValues);
    formik.setFieldValue(fieldName, newValues);
    setErrorMessages([]); // Clear errors when value changes
  };

  return (
    <Box sx={{ width: "90%" }}>
      <FormControl fullWidth>
        <InputLabel sx={{color:"#183084", fontWeight:"bold"}} id={`${fieldName}-label`}>{labelName}</InputLabel>
        <Select
          labelId={`${fieldName}-label`}
          id={`${fieldName}-select`}
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput id={`${fieldName}-input`} label={labelName} />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5}}>
              {selected.map((id) => {
                const option = modifiedOptions.find((opt) => opt.id === id);
                return <Chip key={id} label={option?.value || id} />;
              })}
            </Box>
          )}
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
