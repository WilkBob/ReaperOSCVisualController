import OSCController from "./Components/OSCController";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f1d0a2",
    },
    secondary: {
      main: "#b42323",
    },
    success: {
      main: "#87f187",
    },
    info: {
      main: "#650909",
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
