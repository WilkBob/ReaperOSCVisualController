import { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Toolbar,
  FormControlLabel,
  Switch,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import MapCanvas from "./MapCanvas";
import useCanvasMouse from "./useCanvasMouse";

const ValueMapper = ({ valueMap, updateValueMap }) => {
  const canvasRef = useRef(null);
  const mapRef = useRef({
    stops: valueMap.stops,
  });

  const { mousePosRef, clickedRef } = useCanvasMouse(canvasRef);

  const setMapFromRef = () => {
    // Ensure stops are sorted by x value
    const stops = mapRef.current.stops.sort((a, b) => a.x - b.x);

    updateValueMap({ stops, ...valueMap });
  };

  const setInterpolate = (e) => {
    const newValueMap = { ...valueMap, interpolate: e.target.checked };
    updateValueMap(newValueMap);
  };
  const setInvert = (e) => {
    const newValueMap = { ...valueMap, invert: e.target.checked };
    updateValueMap(newValueMap);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const controller = new MapCanvas(
      canvas,
      ctx,
      canvas.width,
      canvas.height,
      mousePosRef,
      clickedRef,
      mapRef
    );
    const drawTrackingInfo = (ctx, mousePos) => {
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText(`Mouse X: ${mousePos.x}`, 10, 20);
      ctx.fillText(`Mouse Y: ${mousePos.y}`, 10, 40);
      ctx.fillText(`Clicked: ${clickedRef.current}`, 10, 60);
      // draw mapref's stops xy pairs
      ctx.fillText("Stops:", 10, 80);
      mapRef.current.stops.forEach((stop, index) => {
        ctx.fillText(
          `Stop ${index}: (${stop.x}, ${stop.y})`,
          10,
          100 + index * 20
        );
      });
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      controller.onResize(); // Optionally pass new width/height if needed
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animId;
    const animate = () => {
      controller.update();
      drawTrackingInfo(ctx, mousePosRef.current);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    };
  }, [mousePosRef, clickedRef]);

  return (
    <Box>
      {JSON.stringify(valueMap)}
      {/* Toolbar with Save button and switches */}
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",

          marginBottom: "10px",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={valueMap.interpolate}
              onChange={setInterpolate}
              color="primary"
            />
          }
          label="Interpolate"
        />
        <FormControlLabel
          control={
            <Switch
              checked={valueMap.invert}
              onChange={setInvert}
              color="primary"
            />
          }
          label="Invert"
        />
        <IconButton onClick={setMapFromRef} style={{}}>
          <SaveIcon />
        </IconButton>
      </Toolbar>

      {/* Canvas */}
      <Box position="relative">
        <canvas
          ref={canvasRef}
          style={{ border: "1px solid black", width: "100%", height: "200px" }}
        ></canvas>
      </Box>
    </Box>
  );
};

export default ValueMapper;
