import { createTheme } from "@mui/material/styles";

// 1. Space-Themed Theme
const spaceTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4A90E2", // A calm blue for space
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#50E3C2", // A soft teal
      contrastText: "#000000",
    },
    background: {
      default: "#0B1D2A", // Deep space blue
      paper: "#112B3C", // Slightly lighter for contrast
    },
    text: {
      primary: "#E0E0E0",
      secondary: "#B0BEC5",
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: "2.5rem",
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

// 2. Rainbow-Themed Theme
const rainbowTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FF6F61", // A vibrant coral
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FFD54F", // A warm yellow
      contrastText: "#000000",
    },
    background: {
      default: "#1C1C1C", // Neutral dark background
      paper: "#2C2C2C", // Slightly lighter for contrast
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0BEC5",
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

export { spaceTheme, rainbowTheme };
