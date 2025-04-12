import OSCController from "./Components/OSCController";
import { CssBaseline } from "@mui/material";

import { ParameterListProvider } from "./Context/ContextProvider";

function App() {
  return (
    <ParameterListProvider>
      <CssBaseline />
      <OSCController />
    </ParameterListProvider>
  );
}

export default App;
