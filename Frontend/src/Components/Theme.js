import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3a435e", // Delft Blue
      light: "#5c6672", // Payne's gray
      dark: "#313e50", // Charcoal
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#6c6f7f", // Slate gray
      light: "#8d909f",
      dark: "#455561", // Charcoal 2
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#313e50", // Charcoal
      paper: "#3a435e", // Delft Blue
    },
    error: {
      main: "#ff6b6b",
    },
    warning: {
      main: "#ffd166",
    },
    info: {
      main: "#5c6672", // Payne's gray
    },
    success: {
      main: "#06d6a0",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "rgba(255, 255, 255, 0.8)",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
});

export default theme;
