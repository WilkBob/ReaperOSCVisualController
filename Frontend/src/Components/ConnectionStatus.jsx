import { useContext, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import NodeContext from "../Context/NodeContext";

const ConnectionStatus = ({ connected }) => {
  const { NodeManagerRef, broadcasting, setBroadcasting } =
    useContext(NodeContext);

  useEffect(() => {
    if (connected === false) {
      setBroadcasting(false); // Reset broadcasting state when disconnected
      NodeManagerRef.current.globalState.osc.isBroadcasting = false; // Ensure OSC broadcasting is off
    }

    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "b") {
        if (!connected) {
          e.preventDefault(); // Prevent toggling if not connected
          NodeManagerRef.current.globalState.osc.isBroadcasting = false; // Ensure OSC broadcasting is off
          setBroadcasting(false);
          return;
        }
        e.preventDefault(); // Prevent default action
        NodeManagerRef.current.globalState.osc.isBroadcasting = !broadcasting; // Toggle OSC broadcasting
        setBroadcasting((prev) => !prev); // Toggle broadcasting
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setBroadcasting, connected, NodeManagerRef, broadcasting]);

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
