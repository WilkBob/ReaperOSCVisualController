import { useEffect } from "react";
import {
  Box,
  FormControlLabel,
  Typography,
  Switch,
  CircularProgress,
} from "@mui/material";

const ConnectionStatus = ({ connected, broadcasting, setBroadcasting }) => {
  useEffect(() => {
    if (connected === false) {
      setBroadcasting(false); // Reset broadcasting state when disconnected
    }

    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "b") {
        if (!connected) {
          e.preventDefault(); // Prevent toggling if not connected
          setBroadcasting(false);
          return;
        }
        setBroadcasting((prev) => !prev); // Toggle broadcasting
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setBroadcasting, connected]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          (b) Broadcasting:
        </Typography>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: broadcasting ? "success.main" : "error.main",
          }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          {!connected && <CircularProgress size={"10px"} />} Connected:
        </Typography>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: connected ? "success.main" : "error.main",
          }}
        />
      </Box>
    </Box>
  );
};

export default ConnectionStatus;
