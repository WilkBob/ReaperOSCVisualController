import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { sendValue } from "../API/oscService";
import throttle from "../API/throttle";

const Canvas = ({ params }) => {
  const canvasRef = useRef(null);
  const xratioRef = useRef(0);
  const yratioRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Failed to get canvas context");
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(canvas.width / 2, canvas.height / 2); // Start centered
    };

    const draw = (x, y) => {
      if (!context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const xratio = ((x - canvas.width / 2) / (canvas.width / 2)).toFixed(2);
      const yratio = ((y - canvas.height / 2) / (canvas.height / 2)).toFixed(2);

      // Store values in refs
      xratioRef.current = (x / canvas.width).toFixed(2);
      yratioRef.current = (y / canvas.height).toFixed(2);

      let red = 128 + Math.floor(xratio * 127);
      let green = 128 - Math.floor(yratio * 127);
      let blue = 128 - Math.floor(xratio * 127);

      red = Math.max(0, Math.min(255, red));
      green = Math.max(0, Math.min(255, green));
      blue = Math.max(0, Math.min(255, blue));

      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "black";
      context.fillText(`x: ${xratio}, y: ${yratio}`, 80, 80);
    };

    const handleMouseMove = (event) => {
      draw(event.clientX, event.clientY);
      params.forEach((param) => {
        const value =
          param.controlType === "mouse-x"
            ? xratioRef.current
            : yratioRef.current;
        sendValue(param, value);
      });
    };

    const handleClick = () => {
      console.log("Clicked! Params:", JSON.stringify(params, null, 2));
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [params]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
        }}
      />
    </Box>
  );
};

export default Canvas;
