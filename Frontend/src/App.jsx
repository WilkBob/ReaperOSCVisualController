import OSCController from "./Components/OSCController";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./Components/Theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <OSCController />
    </ThemeProvider>
  );
}

export default App;
