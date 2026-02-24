import React, { useState } from "react";
import {
  Box,
  TextField,
  Checkbox,
  Button,
  Typography,
  Stack,
  FormHelperText,
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
      middleInitial: "",
      lastName: "",
      userName: "",
      mobilePhone: "",
      unableToUseEmail: false,
    },
    validationSchema: specialUserLookupValidationSchema,
    onSubmit: async (values) => {
      setErrorMessages([]);
      try {
        const data = await client.get(specialUserDetailsURL);
        const mockData = Array.isArray(data) ? data : (data?.data || data?.results || []);

        const filterMatch = (item, searchValues) => {
          const searchFields = ["firstName", "lastName", "userName"];
          for (const field of searchFields) {
            const searchVal = (searchValues[field] || "").trim().toLowerCase();
            if (searchVal) {
              const itemVal = (item[field] || "").toLowerCase();
              if (!itemVal.includes(searchVal)) return false;
            }
          }
          const middleVal = (searchValues.middleInitial || "").trim().toLowerCase();
          if (middleVal && (item.middleInitial || "").toLowerCase() !== middleVal) return false;
          const phoneVal = (searchValues.mobilePhone || "").replace(/\D/g, "");
          if (phoneVal && (item.mobilePhone || "").replace(/\D/g, "").indexOf(phoneVal) < 0) return false;
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
              id="middleInitial"
              name="middleInitial"
              label="Middle Initial"
              placeholder="Middle Initial"
              value={formik.values.middleInitial}
              onBlur={formik.handleBlur}
              onChange={(e) => {
                const val = e.target.value.slice(0, 1);
                formik.setFieldValue("middleInitial", val);
                setErrorMessages([]);
              }}
              inputProps={{ maxLength: 1 }}
              fullWidth
              size="small"
              sx={inputSx}
            />
          </Box>
          {ErrorMessage("middleInitial", { marginLeft: "5%" })}

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

          {/* <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Checkbox
              sx={{ marginLeft: "0.8rem", padding: "0" }}
              checked={formik.values.unableToUseEmail}
              onChange={(event) => {
                formik.setFieldValue("unableToUseEmail", event.target.checked);
                setErrorMessages([]);
              }}
            />
            <Typography
              sx={{ color: "#183084", fontWeight: "bold", paddingLeft: "5px" }}
            >
              I have ascertained that the claimant is unable to set up and use
              an email address
            </Typography>
          </Box> */}
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
