import { Box } from "@mui/material";
import React, { useRef, useEffect } from "react";
import { sendValue } from "../API/oscService";

const Canvas = ({ params }) => {
  const canvasRef = useRef(null);
  const xratioRef = useRef(0);
  const yratioRef = useRef(0);
  const distanceRatioRef = useRef(0); // Added third control value

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

    const particleGrid = [];
    const baseParticleSize = 2; // Smaller base size
    const maxParticleSize = 10; // Maximum size when closest to cursor
    const gridSpacing = 24; // Spacing between particles

    const createParticleGrid = () => {
      particleGrid.length = 0; // Clear the grid
      const cols = Math.floor(canvas.width / gridSpacing);
      const rows = Math.floor(canvas.height / gridSpacing);

      for (let x = 0; x <= cols; x++) {
        for (let y = 0; y <= rows; y++) {
          particleGrid.push({
            x: x * gridSpacing + gridSpacing / 2,
            y: y * gridSpacing + gridSpacing / 2,
            size: baseParticleSize,
            color: "rgb(180, 180, 180)", // Light gray default
          });
        }
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticleGrid();
      drawParticles(); // Redraw particles after resizing
    };

    const drawParticles = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      particleGrid.forEach((particle) => {
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        context.fill();
      });
    };

    const updateParticles = (mouseX, mouseY) => {
      const xRatio = mouseX / canvas.width;
      const yRatio = mouseY / canvas.height;

      // Calculate distance from center (as a ratio)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate maximum possible distance (from center to farthest corner)
      const maxPossibleDistance = Math.sqrt(
        (canvas.width / 2) ** 2 + (canvas.height / 2) ** 2
      );

      // Normalize distance to a 0-1 range
      const distanceRatio = Math.min(distance / maxPossibleDistance, 1);

      // Update refs
      xratioRef.current = xRatio.toFixed(2);
      yratioRef.current = yRatio.toFixed(2);
      distanceRatioRef.current = distanceRatio.toFixed(2);

      // Calculate the distance of the mouse from the edges
      const distanceToLeft = mouseX;
      const distanceToRight = canvas.width - mouseX;
      const distanceToTop = mouseY;
      const distanceToBottom = canvas.height - mouseY;

      // Use the minimum distance to the edges as maxDistance
      const maxDistance = Math.min(
        distanceToLeft,
        distanceToRight,
        distanceToTop,
        distanceToBottom
      );

      particleGrid.forEach((particle) => {
        // Calculate distance
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Size based on proximity (inverse relationship with distance)
        const proximityFactor = Math.max(0, 1 - distance / maxDistance);
        particle.size =
          baseParticleSize +
          proximityFactor * (maxParticleSize - baseParticleSize);

        // Calculate hue based on distances to edges and our new distanceRatio
        const distanceX = particle.x / canvas.width; // Ratio of particle's x position
        const distanceY = particle.y / canvas.height; // Ratio of particle's y position

        // Use the distanceRatio to influence the hue calculation
        const hue = Math.floor((distanceX + distanceY + distanceRatio) * 120); // Combine ratios for hue

        // Saturation based on proximity
        const saturation = Math.floor(30 + proximityFactor * 70); // 30-100%

        // Lightness based on proximity (brighter when closer)
        const lightness = Math.floor(30 + proximityFactor * 40); // 30-70%

        particle.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      });

      drawParticles();
    };

    const handleSend = (param) => {
      switch (param.controlType) {
        case "mouse-x":
          sendValue(param, xratioRef.current);
          break;
        case "mouse-y":
          sendValue(param, yratioRef.current);
          break;
        case "distance":
          sendValue(param, distanceRatioRef.current);
          break;
        default:
          console.warn(`Unsupported controlType: ${param.controlType}`);
      }
    }; //takes parameter, and the value based on it's controlType

    const handleMouseMove = (event) => {
      updateParticles(event.clientX, event.clientY);
      params.forEach((param) => {
        handleSend(param);
      });
    };

    const handleTouch = (event) => {
      if (event.touches && event.touches[0]) {
        const touch = event.touches[0];
        updateParticles(touch.clientX, touch.clientY);
      }
    };

    const handleClick = () => {
      console.log("Clicked! Params:", JSON.stringify(params, null, 2));
      console.log("Control Values:", {
        x: xratioRef.current,
        y: yratioRef.current,
        distance: distanceRatioRef.current, // Include our new third control value
      });
    };

    // Initial setup
    resizeCanvas();

    // Add event listeners
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouch);
    window.addEventListener("click", handleClick);

    // Initial draw with cursor at center
    updateParticles(canvas.width / 2, canvas.height / 2);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouch);
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
