import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import useMouseControl from "./UseMouseControl";
import ParticleControls from "./Particles/ParticleControls";
import SpaceControls from "./SpaceControls/SpaceControls";

const CanvasController = ({
  trackX,
  trackY,
  trackBallX,
  trackBallY,
  trackClick,
  trackChaos,
  onUpdateX,
  onUpdateY,
  onUpdateBallX,
  onUpdateBallY,
  onUpdateClick,
  onUpdateChaos,
  visualizer,
}) => {
  const canvasRef = useRef(null);

  const { mousePosRef, ballRef, clickedRef, chaosRef } = useMouseControl({
    trackX,
    trackY,
    trackClick,
    onUpdateX,
    onUpdateY,
    onUpdateClick,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawTrackingInfo = () => {
      ctx.font = "16px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "left";

      // Array of tracking information strings
      const trackingInfo = [
        `Mouse Position: x=${mousePosRef.current.x.toFixed(
          2
        )}, y=${mousePosRef.current.y.toFixed(2)}`,
        `Ball Position: x=${ballRef.current.x.toFixed(
          2
        )}, y=${ballRef.current.y.toFixed(2)}`,
        `Mouse Clicked: ${clickedRef.current ? "Yes" : "No"}`,
        `Track Mouse: ${trackX || trackY ? "Yes" : "No"}`,
        `Track Ball: ${trackBallX || trackBallY ? "Yes" : "No"}`,
        `Ball Factor: ${ballRef.current.fac}`,
        `Track Click: ${trackClick ? "Yes" : "No"}`,
        `Track Chaos: ${trackChaos ? "Yes" : "No"}`,
        `Chaos Value: ${chaosRef.current.toFixed(2)}`,
        `Visualizer: ${visualizer}`,
      ];

      // Iterate over the array and draw each line
      trackingInfo.forEach((text, index) => {
        ctx.fillText(text, 10, 50 + index * 20); // Adjust vertical spacing (20px per line)
      });
    };
    const controllerArgs = {
      canvas,
      ctx,
      mousePosRef,
      trackMouse: trackX || trackY,

      clickedRef,
      trackClick,

      ballRef,
      trackBall: trackBallX || trackBallY,
      onUpdateBallX,
      onUpdateBallY,

      chaosRef,
      trackChaos,
      onUpdateChaos,
    };

    // Initialize ParticleControls or SpaceControls based on visualizer prop / only 2d visualizers shown
    const getController = (visualizerType) => {
      switch (visualizerType) {
        case "particle":
          return new ParticleControls(controllerArgs);
        case "space":
          return new SpaceControls(controllerArgs);

        default:
          console.warn(`Unknown visualizer type: ${visualizerType}`);
          return null;
      }
    };

    const controller = getController(visualizer);
    if (controller === null) {
      return;
    }
    // Resize canvas to fit the window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      controller.onResize(); // Call the resize method of the controller
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    let animationFrameId = null;
    // Animation loop
    const animate = () => {
      controller.update(); // Update particles and ball
      controller.draw(); // Draw particles and ball
      drawTrackingInfo(); // Draw tracking information
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      // Cleanup event listeners and animation frame
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    };
  }, [
    trackX,
    trackY,
    trackBallX,
    trackBallY,
    trackClick,
    mousePosRef,
    ballRef,
    clickedRef,
    onUpdateBallX,
    onUpdateBallY,
    onUpdateChaos,
    chaosRef,
    trackChaos,
    visualizer,
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

export default CanvasController;
