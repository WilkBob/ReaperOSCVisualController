import { useEffect, useRef } from "react";
import { Box, Switch, Typography } from "@mui/material";

import GradientBackground from "./GradientBackground";

const ClosedMapper = ({ valueMap, setMapperOpen, updateValueMap }) => {
  const canvasRef = useRef(null);

  const setEnabled = (enabled) => {
    const newValueMap = { ...valueMap, enabled: enabled };
    updateValueMap(newValueMap);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const controller = new GradientBackground(
      ctx,
      valueMap.stops,
      valueMap.interpolate,
      valueMap.invert
    );

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      controller.drawGradient(canvas.width, canvas.height); // Redraw the gradient
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    };
  }, [valueMap]);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography
        variant="h5"
        sx={{ display: "flex", alignItems: "center", minHeight: "100%" }}
      >
        <Switch
          component={"span"}
          checked={valueMap.enabled}
          onChange={(e) => {
            setEnabled(e.target.checked);
          }}
        />
        Value Mapper{" "}
        <Typography variant="caption" sx={{ ml: 1 }}>
          - Value will be interpreted according to the gradient (lighter color =
          higher value)
        </Typography>
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          cursor: "pointer",
        }}
        onClick={() => setMapperOpen(true)}
      >
        <Box
          component={"canvas"}
          tabIndex={0}
          ref={canvasRef}
          sx={{
            border: "2px solid rgba(255, 255, 255, 0.4)",
            borderRadius: "8px",
            width: "100%",
            height: "100px",
            transition: "border 0.3s, box-shadow 0.3s",
            //border and shadow on hover
            "&:hover": {
              border: "2px solid rgba(255, 255, 255, 0.8)",
            },
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default ClosedMapper;
