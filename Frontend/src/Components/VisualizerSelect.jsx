import React, { useContext } from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import BubbleChartIcon from "@mui/icons-material/BubbleChart"; // Icon for ParticleControls
import PublicIcon from "@mui/icons-material/Public"; // Icon for SpaceControls
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import SettingsIcon from "@mui/icons-material/Settings"; // Icon for settings
import VisualizerContext from "../Context/VisualizerContext";
const VisualizerSelect = () => {
  const { visualizer, setVisualizer } = useContext(VisualizerContext); // Assuming you have a context for visualizer state
  // visualizer = {id: '', threeD: bool}
  // Array of visualizer options
  const visualizerOptions = [
    {
      id: "particles",
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
      <Divider orientation="vertical" flexItem />
      <IconButton>
        <SettingsIcon />
      </IconButton>
    </Box>
  );
};

export default VisualizerSelect;
