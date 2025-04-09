import { useEffect, useRef } from "react";
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
  const stopsRef = useRef([...valueMap.stops]);

  const { mousePosRef, clickedRef } = useCanvasMouse(canvasRef);

  const setMapFromRef = () => {
    // Ensure stops are sorted by x value and round x, y to 2 decimal places
    const stops = stopsRef.current
      .map((stop) => ({
        x: Math.round(stop.x * 100) / 100,
        y: Math.round(stop.y * 100) / 100,
      }))
      .sort((a, b) => a.x - b.x);

    console.log("Rounded Stops:", stops); // Debug log
    updateValueMap({ ...valueMap, stops: [...stops] });
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
      stopsRef,
      valueMap.interpolate,
      valueMap.invert
    );
    // const drawTrackingInfo = (ctx, mousePos) => {
    //   ctx.fillStyle = "black";
    //   ctx.font = "12px Arial";
    //   ctx.fillText(`Mouse X: ${mousePos.x}`, 10, 20);
    //   ctx.fillText(`Mouse Y: ${mousePos.y}`, 10, 40);
    //   ctx.fillText(`Clicked: ${clickedRef.current}`, 10, 60);
    //   // draw mapref's stops xy pairs
    //   ctx.fillText("Stops (ref):", 10, 80);
    //   stopsRef.current.forEach((stop, index) => {
    //     ctx.fillText(
    //       `Stop ${index}: (${stop.x}, ${stop.y})`,
    //       10,
    //       100 + index * 20
    //     );
    //   });
    // };

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
    window.addEventListener("keydown", controller.handleKeyDown);
    canvas.addEventListener("dblclick", controller.handleDoubleClick);

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      controller.update();
      // drawTrackingInfo(ctx, mousePosRef.current);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("keydown", controller.handleKeyDown);
      canvas.removeEventListener("dblclick", controller.handleDoubleClick);
      cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    };
  }, [mousePosRef, clickedRef, valueMap]);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {JSON.stringify(valueMap)}
      {/* Toolbar with Save button and switches */}
      <Toolbar
        style={{
          display: "flex",

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
      <Box sx={{ position: "relative", width: "100%" }}>
        <canvas ref={canvasRef} style={{ border: "", width: "100%" }}></canvas>
      </Box>
    </Box>
  );
};

export default ValueMapper;
