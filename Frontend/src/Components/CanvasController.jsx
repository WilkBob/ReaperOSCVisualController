import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import useOSCController from "../Hooks/useOSCController";
import useMouseControl from "../Hooks/useMouseControl";
import InteractiveVisualizer from "../Visualizers/Visualizer";
const CanvasController = ({ broadcasting }) => {
  const OSCOutputRefs = useOSCController(broadcasting);
  const mouseControl = useMouseControl({ clickSwell: true, swellRate: 0.01 });
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return; // Ensure canvasRef is defined
    const visualizer = new InteractiveVisualizer(
      canvasRef.current,
      mouseControl,
      OSCOutputRefs
    );
    visualizer.animate(); // Start the animation loop
    return () => {
      visualizer.destroy(); // Clean up the visualizer instance
    };
  }, [mouseControl, OSCOutputRefs]);

  return (
    <Box
      component={"canvas"}
      ref={canvasRef}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100vh",
      }}
    />
  );
};

export default CanvasController;
