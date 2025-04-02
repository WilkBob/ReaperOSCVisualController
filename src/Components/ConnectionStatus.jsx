import React from "react";
import { Box, FormControlLabel, Typography, Switch } from "@mui/material";

const ConnectionStatus = ({ connected, broadcasting, setBroadcasting }) => {
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
        label="Broadcasting"
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
