import { Button, Tooltip } from "@mui/material";
import React from "react";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import WavesIcon from "@mui/icons-material/Waves";
import BlurOnIcon from "@mui/icons-material/BlurOn"; // Import icon for chaos behavior

const ExpressionSelect = ({
  description,
  id,
  behavior,
  name,
  param,
  updateParameter,
}) => {
  return (
    <Tooltip key={id} title={description} placement="top">
      <Button
        onClick={() => updateParameter("controlType", id)}
        variant={param.controlType === id ? "contained" : "outlined"}
        startIcon={
          behavior === "linear" ? (
            <LinearScaleIcon />
          ) : behavior === "gate" ? (
            <ToggleOnIcon />
          ) : behavior === "chaos" ? (
            <BlurOnIcon />
          ) : (
            <WavesIcon />
          )
        }
      >
        {name}
      </Button>
    </Tooltip>
  );
};

export default ExpressionSelect;
