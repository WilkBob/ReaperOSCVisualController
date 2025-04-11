import { createTheme } from "@mui/material/styles";
import { amber, blueGrey, teal } from "@mui/material/colors"; // Importing some Material UI colors for inspiration

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#283593", // Indigo - A deeper, more distinct primary
      light: "#5f5fc4",
      dark: "#001064",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#00897b", // Teal - Provides better contrast and visual interest
      light: "#4db6ac",
      dark: "#005b4f",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#121212", // A darker, true dark gray
      paper: "#1e1e1e", // Slightly lighter dark gray for paper surfaces
    },
    error: {
      main: "#f44336", // Standard Material UI error
    },
    warning: {
      main: amber[700], // Using a warmer amber for warning
    },
    info: {
      main: blueGrey[300], // A lighter blue-grey for better distinction
    },
    success: {
      main: teal.A400, // A vibrant teal for success
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "rgba(255, 255, 255, 0.8)",
      hover: "rgba(40, 53, 147, 0.12)", // Tint hover with primary dark
      selected: "rgba(40, 53, 147, 0.24)", // Tint selected with primary dark
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
  typography: {
    // You can add more typography customizations here if needed
  },
  shape: {
    // You can customize border radius here
  },
  components: {
    // You can customize specific components here (e.g., MuiButton, MuiAppBar)
  },
});

export default theme;
