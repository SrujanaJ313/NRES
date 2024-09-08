import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import theme from "../../theme/theme";

// interface ILoaderProps {
//   size?: number | string;
//   withPadding?: boolean;
//   customPaddingThemeSpacing?: number;
//   position?: string;
// }

function Loader({
  customPaddingThemeSpacing,
  position = "center",
  withPadding = true,
  size,
}) {
  const positionObj = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
  };
  return (
    <Stack
      alignItems={positionObj[position]}
      boxSizing="border-box"
      height="100%"
      justifyContent="center"
      width="100%"
      {...(withPadding && {
        padding: theme.spacing(customPaddingThemeSpacing || 4),
      })}
    >
      <CircularProgress size={size} />
    </Stack>
  );
}

export default Loader;
