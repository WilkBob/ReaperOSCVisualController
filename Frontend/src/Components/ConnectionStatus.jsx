import React, { useEffect } from "react";
import { Box, FormControlLabel, Typography, Switch } from "@mui/material";

const ConnectionStatus = ({ connected, broadcasting, setBroadcasting }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "b") {
        setBroadcasting((prev) => !prev); // Toggle broadcasting
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setBroadcasting]);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <FormControlLabel
        control={
          <Switch
            checked={broadcasting}
            onChange={(e) => setBroadcasting(e.target.checked)}
            name="broadcastingSwitch"
          />
        }
        label="Broadcasting (b)"
      />
      <Typography variant="body2" sx={{ mr: 1 }}>
        {connected ? "Connected" : "Disconnected"}
      </Typography>
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: connected ? "success.main" : "error.main",
          mr: 2,
        }}
      />
    </Box>
  );
};

export default ConnectionStatus;
