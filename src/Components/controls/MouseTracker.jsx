import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import useMouseControl from "./UseMouseControl";

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

  const { mousePosRef, ballRef, clickedRef } = useMouseControl({
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
  });

  const drawCanvas = (
    ctx,
    canvas,
    { mousePos, ball, clicked, trackBallX, trackBallY, trackClick }
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background based on mouse position
    const { x: mouseX, y: mouseY } = mousePos;
    const r = Math.floor(mouseX * 255);
    const g = Math.floor(mouseY * 255);
    const b = 255 - Math.abs(r - g);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    if (trackBallX || trackBallY) {
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.x <= 0 || ball.x >= 1) ball.vx *= -1;
      if (ball.y <= 0 || ball.y >= 1) ball.vy *= -1;

      // Call onUpdateBallX and onUpdateBallY if tracking is enabled
      if (trackBallX) onUpdateBallX(ball.x);
      if (trackBallY) onUpdateBallY(ball.y);

      ctx.fillStyle = `rgb(${255 - r}, ${255 - g}, 150)`;
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
    // Draw click indicator
    if (clicked && trackClick) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      ctx.arc(
        mouseX * canvas.width,
        mouseY * canvas.height,
        20,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    //Draw all values being tracked on screen in a nice way (e.g. mouseX: 0.9)
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";

    const textLines = [
      `Mouse X: ${mouseX.toFixed(2)}`,
      `Mouse Y: ${mouseY.toFixed(2)}`,
      `Ball X: ${ball.x.toFixed(2)}`,
      `Ball Y: ${ball.y.toFixed(2)}`,
      `Clicked: ${clicked ? "Yes" : "No"}`,
      `Ball Vel: ${ball.vx}, ${ball.vy}`,
    ].filter(Boolean); // Filter out null values

    textLines.forEach((line, index) => {
      ctx.fillText(line, 100, 20 + index * 20); // Draw each line with spacing
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      drawCanvas(ctx, canvas, {
        mousePos: mousePosRef.current,
        ball: ballRef.current,
        clicked: clickedRef.current,
        trackBallX,
        trackBallY,
        trackClick,
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [trackBallX, trackBallY, trackClick, mousePosRef, ballRef, clickedRef]);

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
