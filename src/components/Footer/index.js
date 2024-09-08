import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import client from "../../helpers/Api";
import { footerURL } from "../../helpers/Urls";
import { getUserName } from "../../utils/cookies";

export default function Footer() {
  const [footerData, setFooterData] = useState({});
  useEffect(() => {
    getFooterData();
  }, []);
  const getFooterData = async () => {
    const data = await client.get(footerURL);
    setFooterData(data);
  };
  const footerStyle = {
    fontSize: "0.5rem",
    lineHeight: "1",
  };
  return (
    <>
      <Box
        boxSizing="border-box"
        // height={{ xs: "80px", midsm: "100px" }}
        sx={{
          backgroundColor: "#183084",
          padding: "4px",
          // position: "fixed",
          // bottom: 0,
        }}
        width="100%"
        alignItems="center"
      >
        <Stack direction="column">
          <Stack
            direction="row"
            marginLeft={2}
            spacing={3}
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography style={footerStyle} color="white">
              NHES is a proud member of America's Workforce Network and NH Works
            </Typography>
          </Stack>
          <Stack
            direction="row"
            marginLeft={2}
            spacing={3}
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography style={footerStyle} color="white">
              NHES is a Equal Opportunity Employer and complies with the
              Americans with Disabilities Act. Auxiliary aids and services are
              available upon request of individuals with disabilities.
            </Typography>
          </Stack>
          <Stack
            direction="row"
            marginLeft={2}
            spacing={3}
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography style={footerStyle} color="white">
              User: {getUserName()} &nbsp; &nbsp; Bus Unit: Office of
              Information Technology &nbsp; &nbsp; Application Date:{" "}
              {footerData.systemDate} &nbsp; &nbsp; Database Date:{" "}
              {footerData.dbDate} &nbsp; &nbsp;Micro App:{" "}
              {footerData.applicationVersion} &nbsp; &nbsp; Micro UI:{" "}
              {process.env.REACT_APP_VERSION}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
