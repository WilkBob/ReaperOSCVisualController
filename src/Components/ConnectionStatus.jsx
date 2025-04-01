// ConnectionStatus.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const ConnectionStatus = ({ connected }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
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
