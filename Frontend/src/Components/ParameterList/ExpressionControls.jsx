import { Box, Select, MenuItem, Typography } from "@mui/material";
import ValueMapper from "./ValueMapper/ValueMapper";
import { useState } from "react";
import ClosedMapper from "./ValueMapper/ClosedMapper";

const ExpressionControls = ({ param, updateParameter, updateValueMap }) => {
  const controlOptions = [
    { value: "mouse-x", label: "Mouse X" },
    { value: "mouse-y", label: "Mouse Y" },
    { value: "ball-x", label: "Ball X" },
    { value: "ball-y", label: "Ball Y" },
    { value: "click", label: "Mouse Click" },
    { value: "chaos", label: "Chaos" },
  ];
  const [mapperOpen, setMapperOpen] = useState(false);
  // Use valueMap to generate a linear gradient string for the canvas background, respect invert and interpolate (double stops if invert is true)

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        gap: 2,
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 0.5, display: "flex", alignItems: "center" }}
      >
        Expression Controls{" "}
        <Typography variant="caption" sx={{ ml: 1 }}>
          - Chosen control value will be interpreted according to the gradient
          (lighter color = higher value)
        </Typography>
      </Typography>
      <Select
        fullWidth
        size="small"
        value={param.controlType}
        onChange={(e) => updateParameter("controlType", e.target.value)}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {controlOptions.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>

      <Box display="flex" sx={{ width: "100%", height: "100%" }}>
        {mapperOpen ? (
          <ValueMapper
            valueMap={param.valueMap}
            updateValueMap={updateValueMap}
            closeMapper={() => setMapperOpen(false)}
          />
        ) : (
          <ClosedMapper
            valueMap={param.valueMap}
            setMapperOpen={setMapperOpen}
          />
        )}
      </Box>
    </Box>
  );
};

export default ExpressionControls;
