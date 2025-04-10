import { Box, IconButton } from "@mui/material";
import PlayArrow from "@mui/icons-material/PlayArrow";
import FiberManualRecord from "@mui/icons-material/FiberManualRecord";
import StopCircle from "@mui/icons-material/StopCircle";
import AvTimer from "@mui/icons-material/AvTimer";
import FastRewind from "@mui/icons-material/FastRewind"; // Import rewind icon
import React from "react";
import { sendMessage } from "../API/oscService";

const Transport = ({ play, stop, record, toggleMetronome, disabled }) => {
  const rewind = () => {
    sendMessage("/samples/str", "0"); // Example OSC message for rewind
  };

  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)", // Center Transport

        display: "flex",
        width: "fit-content",
        gap: 1,
        justifyContent: "center",

        p: 2,
      }}
    >
      <IconButton color="primary" disabled={disabled} onClick={play}>
        <PlayArrow fontSize="large" />
      </IconButton>
      <IconButton color="error" disabled={disabled} onClick={record}>
        <FiberManualRecord fontSize="large" />
      </IconButton>
      <IconButton color="secondary" disabled={disabled} onClick={stop}>
        <StopCircle fontSize="large" />
      </IconButton>
      <IconButton color="success" disabled={disabled} onClick={toggleMetronome}>
        <AvTimer fontSize="large" />
      </IconButton>
      <IconButton color="info" disabled={disabled} onClick={rewind}>
        <FastRewind fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default Transport;
