import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

const MouseControlCanvas = ({ trackX, trackY, onUpdateX, onUpdateY }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas to fullscreen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e) => {
      const { innerWidth: width, innerHeight: height } = window;
      const x = trackX ? e.clientX / width : 0;
      const y = trackY ? e.clientY / height : 0;

      if (trackX) onUpdateX(x);
      if (trackY) onUpdateY(y);

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw a background color based on mouse position
      const color = `rgba(${Math.floor(x * 255)}, ${Math.floor(
        y * 255
      )}, 150, 0.2)`;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Add mousemove listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [trackX, trackY, onUpdateX, onUpdateY]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1, // Ensure it stays in the background
      }}
    >
      <canvas ref={canvasRef} />
    </Box>
  );
};

export default MouseControlCanvas;
