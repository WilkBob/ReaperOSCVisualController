import OSCController from "./Components/OSCController";
import { CssBaseline } from "@mui/material";

import { ParameterListProvider } from "./Context/ContextProvider";
import NodeContextProvider from "./Context/NodeContextProvider";

function App() {
  return (
    <ParameterListProvider>
      <NodeContextProvider>
        <CssBaseline />
        <OSCController />
      </NodeContextProvider>
    </ParameterListProvider>
  );
}

export default App;
