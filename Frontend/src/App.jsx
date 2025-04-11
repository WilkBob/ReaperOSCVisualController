import OSCController from "./Components/OSCController";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./Components/Theme";
import { ParameterListProvider } from "./Context/ContextProvider";

function App() {
  return (
    <ParameterListProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <OSCController />
      </ThemeProvider>
    </ParameterListProvider>
  );
}

export default App;
