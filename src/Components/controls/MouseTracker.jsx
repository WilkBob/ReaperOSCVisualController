import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

const MouseControlCanvas = ({
  trackX,
  trackY,
  trackBallX,
  trackBallY,
  onUpdateX,
  onUpdateY,
  onUpdateBallX,
  onUpdateBallY,
  trackClick,
  onUpdateClick,
}) => {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 0.5, y: 0.5, vx: 0.004, vy: 0.001 });
  const animationRef = useRef(null);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 }); // Store mouse position

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e) => {
      const { innerWidth: width, innerHeight: height } = window;
      const x = e.clientX / width; // Always normalize mouse X
      const y = e.clientY / height; // Always normalize mouse Y

      mousePosRef.current = { x, y }; // Always update mouse position

      if (trackX) onUpdateX(x); // Only call onUpdateX if trackX is true
      if (trackY) onUpdateY(y); // Only call onUpdateY if trackY is true
    };
    const handleMouseWheel = (e) => {
      // Adjust ball velocity based on scroll direction and intensity
      const ball = ballRef.current;
      const delta = e.deltaY * 0.00001; // Scale the scroll intensity
      ball.vx += delta; // Increase or decrease horizontal velocity
      ball.vy += delta; // Increase or decrease vertical velocity

      // Clamp the velocity to prevent it from becoming too fast or reversing
      ball.vx = Math.max(-0.02, Math.min(0.02, ball.vx));
      ball.vy = Math.max(-0.02, Math.min(0.02, ball.vy));
    };
    let clicked = false;
    const handleMouseDown = () => {
      if (trackClick) onUpdateClick(1); // Send 1 when clicked
      clicked = true;
    };

    const handleMouseUp = () => {
      if (trackClick) onUpdateClick(0); // Send 0 when released
      clicked = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleMouseWheel);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mouse interaction background - Bright and punchy colors
      const { x: mouseX, y: mouseY } = mousePosRef.current;
      const r = Math.floor(mouseX * 255); // Red based on mouse X
      const g = Math.floor(mouseY * 255); // Green based on mouse Y
      const b = 255 - Math.abs(r - g); // Blue for contrast
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`; // Background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ball physics
      if (trackBallX || trackBallY) {
        let ball = ballRef.current;
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x <= 0 || ball.x >= 1) ball.vx *= -1;
        if (ball.y <= 0 || ball.y >= 1) ball.vy *= -1;

        trackBallY && onUpdateBallY(ball.y);
        trackBallX && onUpdateBallX(ball.x);

        ctx.fillStyle = `rgb(${255 - r}, ${255 - g}, 150)`; // Complementary color for the ball
        ctx.beginPath();
        ctx.arc(
          ball.x * canvas.width,
          ball.y * canvas.height,
          20,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      if (clicked && trackClick) {
        // Draw a circle at the current mouse position
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Set a color for the circle
        ctx.beginPath();
        ctx.arc(
          mouseX * canvas.width, // Scale mouseX to canvas width
          mouseY * canvas.height, // Scale mouseY to canvas height
          20, // Radius of the circle
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleMouseWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    trackX,
    trackY,
    trackBallX,
    trackBallY,
    trackClick,
    onUpdateX,
    onUpdateY,
    onUpdateBallX,
    onUpdateBallY,
    onUpdateClick,
  ]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    >
      <canvas ref={canvasRef} />
    </Box>
  );
};

export default MouseControlCanvas;
