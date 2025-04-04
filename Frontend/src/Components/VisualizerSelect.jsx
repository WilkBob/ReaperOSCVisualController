import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import BubbleChartIcon from "@mui/icons-material/BubbleChart"; // Icon for ParticleControls

const VisualizerSelect = ({ visualizer, setVisualizer }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: 2,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        borderRadius: "8px",
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 10,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "white",
          fontWeight: "bold",
        }}
      >
        Select Visualizer:
      </Typography>
      <IconButton
        onClick={() => setVisualizer("ParticleControls")}
        color={visualizer === "ParticleControls" ? "primary" : "default"}
        sx={{
          backgroundColor:
            visualizer === "ParticleControls"
              ? "rgba(255, 255, 255, 0.2)"
              : "transparent",
        }}
      >
        <BubbleChartIcon />
      </IconButton>
    </Box>
  );
};

export default VisualizerSelect;
