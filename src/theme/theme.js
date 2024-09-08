import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#183084",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          "& > form": {
            display: "contents",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: {
          fontSize: "0.8rem",
        },
        // p: {
        //     fontSize:"20rem"
        // }
      }),
    },
    MuiTypography: {
      styleOverrides: (themeParam) => ({
        p: {
          fontSize: "20rem",
        },
      }),
    },
  },
  typography: {
    fontFamily: `"Aptos"`,
    body1: {
      fontSize: "0.8rem",
    },
  },
  button: {
    textTransform: "none",
  },
});

export default theme;
