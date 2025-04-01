import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";

const Canvas = ({ params }) => {
  const canvasRef = useRef(null);

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

    // Set canvas size to match the window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(canvas.width / 2, canvas.height / 2); // Start with neutral center
    };

    const draw = (x, y) => {
      if (!context) return;

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate ratios relative to the center
      const xratio = ((x - canvas.width / 2) / (canvas.width / 2)).toFixed(2);
      const yratio = ((y - canvas.height / 2) / (canvas.height / 2)).toFixed(2);

      // Base color is neutral gray (128,128,128)
      let red = 128 + Math.floor(xratio * 127); // Red increases right, decreases left
      let green = 128 - Math.floor(yratio * 127); // Green increases upward, decreases downward
      let blue = 128 - Math.floor(xratio * 127); // Blue increases left, decreases right

      // Clamp values to valid 0-255 range
      red = Math.max(0, Math.min(255, red));
      green = Math.max(0, Math.min(255, green));
      blue = Math.max(0, Math.min(255, blue));

      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "black";
      context.fillText(`x: ${xratio}, y: ${yratio}`, 80, 80);
    };

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      draw(clientX, clientY);
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden", // Prevent scrolling
        position: "fixed", // Fix to viewport
        top: 0,
        left: 0,
        zIndex: -1,
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
