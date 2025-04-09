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
import AddressController from "./AddressController";
import VisualizerSelect from "./VisualizerSelect";

const OSCController = () => {
  const [connected, setConnected] = useState(isConnected());
  const [broadcasting, setBroadcasting] = useState(false);
  const [visualizer, setVisualizer] = useState({
    id: "particle",
    ThreeD: false,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [parameters, setParameters] = useState([
    {
      name: "Parameter 1",
      type: "inst",
      trackNum: 1,
      fxNum: 1,
      paramNum: 2,
      controlType: "mouse-x",
      valueMap: {
        stops: [
          { x: 0.0, y: 0.0 },
          { x: 1.0, y: 1.0 },
        ],
        interpolate: true,
        invert: false,
      },
    },
  ]);

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
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
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
        editing={drawerOpen}
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
