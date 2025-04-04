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
import ParameterList from "./ParameterList";
import AddressController from "./AddressController";
import VisualizerSelect from "./VisualizerSelect";

const OSCController = () => {
  const [connected, setConnected] = useState(isConnected());
  const [broadcasting, setBroadcasting] = useState(false);
  const [parameters, setParameters] = useState([
    {
      type: "inst",
      trackNum: 1,
      fxNum: 1,
      paramNum: 2,
      controlType: "mouse-x",
      range: { min: 0, max: 1 },
    },
  ]);
  const [visualizer, setVisualizer] = useState("ParticleControls");

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
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <ConnectionStatus
        connected={connected}
        broadcasting={broadcasting}
        setBroadcasting={setBroadcasting}
      />
      <Transport
        play={play}
        record={record}
        stop={stop}
        toggleMetronome={toggleMetronome}
        disabled={!connected}
      />

      {!broadcasting && (
        <>
          <ParameterList
            setParameters={setParameters}
            parameters={parameters}
          />
          <VisualizerSelect
            setVisualizer={setVisualizer}
            visualizer={visualizer}
          />
        </>
      )}
      <AddressController
        params={parameters}
        broadcasting={broadcasting}
        visualizer={visualizer}
      />
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
