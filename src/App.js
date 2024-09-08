import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import "./App.css";
import AppRoutes from "./routes";
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
