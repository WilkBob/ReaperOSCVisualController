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
import ParameterList from "./ParameterList/ParameterList";

import VisualizerSelect from "./VisualizerSelect";
import useOSCController from "../Hooks/useOSCController";

const OSCController = () => {
  const [connected, setConnected] = useState(isConnected());
  const [broadcasting, setBroadcasting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { controlRefs } = useOSCController(broadcasting);

  useEffect(() => {
    const handleConnectionChange = (status) => {
      console.log("Connection status changed:", status);
      setConnected(status);
    };

    addConnectionListener(handleConnectionChange);
    return () => {
      removeConnectionListener(handleConnectionChange);
    };
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        width: "100%",
        height: "fit-content",
        gap: 2,
        alignItems: "center",
        position: "relative", // For absolute positioning of Transport
      }}
    >
      {/* Far Left */}
      <ParameterList drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Center */}
      <Transport
        play={play}
        record={record}
        stop={stop}
        toggleMetronome={toggleMetronome}
        disabled={!connected}
      />

      {/* Far Right */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          marginLeft: "auto",
          alignItems: "center",
        }}
      >
        <ConnectionStatus
          connected={connected}
          broadcasting={broadcasting}
          setBroadcasting={setBroadcasting}
        />
        <VisualizerSelect />
      </Box>
    </Box>
  );
};

export default OSCController;
// const handleSend = () => {
//   sendValue({ type: "pan", trackNum: 1, fxNum: 1, paramNum: 2 }, 0.5);
//   // const { type, trackNum, fxNum, paramNum } = param;
//   // types - inst - vol - pan - sendvol - fx
//   // inst requires track, param
//   // vol requires only track
//   // pan requires only track
//   // sendvol requires track, and param value (which send)
// };
