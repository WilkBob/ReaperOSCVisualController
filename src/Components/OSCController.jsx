import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  isConnected,
  play,
  record,
  stop,
  toggleMetronome,
  addConnectionListener,
  removeConnectionListener,
} from "../API/oscService";
import Transport from "./Transport";
import ConnectionStatus from "./ConnectionStatus";
import Canvas from "./Canvas";

const OSCController = () => {
  const [connected, setConnected] = useState(isConnected());

  useEffect(() => {
    const handleConnectionChange = (status) => setConnected(status);

    addConnectionListener(handleConnectionChange);
    return () => removeConnectionListener(handleConnectionChange);
  }, []);

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <ConnectionStatus connected={connected} />
      <Transport
        play={play}
        record={record}
        stop={stop}
        toggleMetronome={toggleMetronome}
        disabled={!connected}
      />
      <Canvas />
    </Box>
  );
};

export default OSCController;
