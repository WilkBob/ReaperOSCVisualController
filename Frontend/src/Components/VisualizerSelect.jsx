import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import BubbleChartIcon from "@mui/icons-material/BubbleChart"; // Icon for ParticleControls
import PublicIcon from "@mui/icons-material/Public"; // Icon for SpaceControls
import DriveEtaIcon from "@mui/icons-material/DriveEta";
const VisualizerSelect = ({ visualizer, setVisualizer }) => {
  // visualizer = {id: '', threeD: bool}
  // Array of visualizer options
  const visualizerOptions = [
    {
      id: "particle",
      label: "Particle Controls",
      icon: <BubbleChartIcon />,
      threeD: false,
    },
    {
      id: "space",
      label: "Space Controls",
      icon: <PublicIcon />,
      threeD: false,
    },
    {
      id: "highway",
      label: "Vaporwave Highway",
      icon: <DriveEtaIcon />,
      threeD: true,
    },
  ];

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
      {visualizerOptions.map((option) => (
        <IconButton
          key={option.id}
          onClick={() =>
            setVisualizer({ id: option.id, threeD: option.threeD })
          }
          color={visualizer === option.id ? "primary" : "default"}
          sx={{
            backgroundColor:
              visualizer.id === option.id
                ? "rgba(255, 255, 255, 0.2)"
                : "transparent",
          }}
          title={option.label} // Tooltip for accessibility
        >
          {option.icon}
        </IconButton>
      ))}
    </Box>
  );
};

export default VisualizerSelect;
