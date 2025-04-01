import React, { useRef, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";

const Canvas = () => {
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
      draw(0, 0); // Redraw with default values
    };

    const draw = (x, y) => {
      if (!context) return;

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Change color based on mouse position
      const red = Math.floor((x / canvas.width) * 255);
      const green = Math.floor((y / canvas.height) * 255);
      const blue = 150; // Fixed blue value for contrast

      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
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
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Interactive Color Canvas
        </Typography>
        <Typography variant="body1">
          Move your mouse around to change the background color!
        </Typography>
      </Paper>
    </Box>
  );
};

export default Canvas;
