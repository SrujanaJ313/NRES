import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import InputMask from "react-input-mask";
import client from "../../../helpers/Api";
import { useFormik } from "formik";
import { specialUserLookupValidationSchema } from "../../../helpers/Validation";
import { specialUserDetailsURL } from "../../../helpers/Urls";
import { useSnackbar } from "../../../context/SnackbarContext";

function LookupSpecialUser({ setLookUpSummary }) {
  const [errorMessages, setErrorMessages] = useState([]);
  const showSnackbar = useSnackbar();

  const onHandleChange = (e) => {
    formik.handleChange(e);
    setErrorMessages([]);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      userName: "",
      userLoginName: "",
      dateOfBirth: "",
      ssn: "",
      emailAddress: "",
      mobilePhone: "",
      status: "",
    },
    validationSchema: specialUserLookupValidationSchema,
    onSubmit: async (values) => {
      setErrorMessages([]);
      try {
        const data = await client.get(specialUserDetailsURL);
        const mockData = Array.isArray(data) ? data : (data?.data || data?.results || []);

        const filterMatch = (item, searchValues) => {
          const searchFields = ["firstName", "lastName", "userName", "userLoginName", "emailAddress"];
          for (const field of searchFields) {
            const searchVal = (searchValues[field] || "").trim().toLowerCase();
            if (searchVal) {
              const itemVal = (item[field] || "").toLowerCase();
              if (!itemVal.includes(searchVal)) return false;
            }
          }
          const phoneVal = (searchValues.mobilePhone || "").replace(/\D/g, "");
          if (phoneVal && (item.mobilePhone || "").replace(/\D/g, "").indexOf(phoneVal) < 0) return false;
          const ssnVal = (searchValues.ssn || "").replace(/\D/g, "");
          if (ssnVal && (item.ssn || "").replace(/\D/g, "").indexOf(ssnVal) < 0) return false;
          const dobVal = (searchValues.dateOfBirth || "").trim();
          if (dobVal && (item.dateOfBirth || "") !== dobVal) return false;
          const statusVal = (searchValues.status || "").trim();
          if (statusVal && (item.status || "") !== statusVal) return false;
          return true;
        };

        const filteredResults = mockData.filter((item) => filterMatch(item, values));

        setLookUpSummary(filteredResults);
        showSnackbar(
          filteredResults.length > 0
            ? `Found ${filteredResults.length} matching special user(s).`
            : "No matching special users found.",
          5000
        );
      } catch (errorResponse) {
        const errMsg =
          errorResponse?.message || "An error occurred while searching.";
        setErrorMessages([errMsg]);
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const ErrorMessage = (fieldName, styleProps) => (
    <>
      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <span style={styleProps}>
          <FormHelperText sx={{ color: "red" }}>
            {formik.errors[fieldName]}
          </FormHelperText>
        </span>
      )}
    </>
  );

  const inputSx = {
    width: "94%",
    "& .MuiInputLabel-root": { color: "#183084", fontWeight: "bold" },
  };

  return (
    <Box width="35%" bgcolor="#FFFFFF" p={0} borderRight="2px solid #3b5998">
      <form
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
        style={{ height: "100%" }}
      >
        <Stack
          spacing={0.8}
          sx={{
            height: "calc(100% - 3.2rem)",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "5px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" },
            "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
          }}
        >
          <Typography
            sx={{
              color: "#183084",
              marginLeft: "0",
              fontWeight: "bold",
              width: "94%",
              paddingLeft: "15px",
            }}
            variant="h6"
            gutterBottom
          >
            Special User Account Details
          </Typography>
          {/* 
          <Box sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Typography
              variant="body2"
              sx={{ color: "#183084", marginBottom: 1 }}
            >
              To create a Special User Account for the claimant, please enter
              the following information.
            </Typography>
          </Box> */}

          <Box display="flex" justifyContent="center">
            {errorMessages.map((x) => (
              <div key={x}>
                <span className="errorMsg">*{x}</span>
              </div>
            ))}
          </Box>

          <Box display="flex" justifyContent="center">
            <TextField
              id="firstName"
              name="firstName"
              label="First Name"
              placeholder="First Name"
              value={formik.values.firstName}
              onBlur={formik.handleBlur}
              onChange={onHandleChange}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <TextField
              id="dateOfBirth"
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formik.values.dateOfBirth}
              onBlur={formik.handleBlur}
              onChange={onHandleChange}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <TextField
              id="lastName"
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              value={formik.values.lastName}
              onBlur={formik.handleBlur}
              onChange={onHandleChange}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <TextField
              id="userName"
              name="userName"
              label="Choose a User Name"
              placeholder="Choose a User Name"
              value={formik.values.userName}
              onBlur={formik.handleBlur}
              onChange={onHandleChange}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <TextField
              id="userLoginName"
              name="userLoginName"
              label="User Login Name"
              placeholder="User Login Name"
              value={formik.values.userLoginName}
              onBlur={formik.handleBlur}
              onChange={onHandleChange}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <TextField
              id="ssn"
              name="ssn"
              label="SSN"
              placeholder="XXX-XX-XXXX"
              value={formik.values.ssn}
              onBlur={formik.handleBlur}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 9) {
                  const formatted = val
                    .replace(/(\d{3})(\d{2})?(\d{4})?/, (_, a, b, c) =>
                      [a, b, c].filter(Boolean).join("-")
                    );
                  formik.setFieldValue("ssn", val ? formatted : "");
                }
                setErrorMessages([]);
              }}
              inputProps={{ maxLength: 11, inputMode: "numeric" }}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <TextField
              id="emailAddress"
              name="emailAddress"
              label="Email Address"
              placeholder="Email Address"
              type="email"
              value={formik.values.emailAddress}
              onBlur={formik.handleBlur}
              onChange={onHandleChange}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <InputMask
              mask="(999) 999-9999"
              maskChar="_"
              value={formik.values.mobilePhone}
              onBlur={formik.handleBlur}
              onChange={(e) => {
                formik.setFieldValue("mobilePhone", e.target.value);
                setErrorMessages([]);
              }}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  id="mobilePhone"
                  name="mobilePhone"
                  label="Mobile Phone #"
                  placeholder="(____) ____-____"
                  fullWidth
                  size="small"
                  sx={inputSx}
                />
              )}
            </InputMask>
          </Box>

          <FormControl sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <Typography sx={{ color: "#183084", fontWeight: "bold", marginBottom: 0.5 }}>
              Status
            </Typography>
            <RadioGroup
              row
              name="status"
              value={formik.values.status}
              onChange={(e) => {
                formik.setFieldValue("status", e.target.value);
                setErrorMessages([]);
              }}
            >
              <FormControlLabel value="Active" control={<Radio size="small" />} label="Active" />
              <FormControlLabel value="Inactive" control={<Radio size="small" />} label="Inactive" />
              <FormControlLabel value="Deleted" control={<Radio size="small" />} label="Deleted" />
            </RadioGroup>
          </FormControl>
          <Stack display="flex" flexDirection="row-reverse">
            <Box
              display="flex"
              justifyContent="center"
              width="50%"
              padding="10px 0px"
            >
              <Button
                color="primary"
                variant="contained"
                type="submit"
                sx={{ alignSelf: "center", width: "15%" }}
              >
                Search
              </Button>
            </Box>

            <Box
              display="flex"
              justifyContent="flex-end"
              width="50%"
              padding="10px 0px"
            >
              <Button
                color="primary"
                variant="contained"
                sx={{ alignSelf: "center", width: "15%" }}
                type="reset"
              >
                Clear
              </Button>
            </Box>
          </Stack>
        </Stack>

      </form>
    </Box>
  );
}

export default LookupSpecialUser;
