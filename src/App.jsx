import OSCController from "./Components/OSCController";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#D5B942",
    },
    secondary: {
      main: "#d9d375",
    },
    success: {
      main: "#87f187",
    },
    info: {
      main: "#EDFBC1",
    },
    text: {
      primary: "#FFFFFF",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <OSCController />
    </ThemeProvider>
  );
}

export default App;
