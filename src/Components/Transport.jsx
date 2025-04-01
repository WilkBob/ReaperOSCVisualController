import { Box, IconButton } from "@mui/material";
import PlayArrow from "@mui/icons-material/PlayArrow";
import FiberManualRecord from "@mui/icons-material/FiberManualRecord";
import StopCircle from "@mui/icons-material/StopCircle";
import AvTimer from "@mui/icons-material/AvTimer";
import React from "react";

const Transport = ({ play, stop, record, toggleMetronome, disabled }) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "fit-content",
        gap: 1,
        justifyContent: "center",
        p: 2,
        background: "#ffffff55",
        borderRadius: "10px",
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
    </Box>
  );
};

export default Transport;
