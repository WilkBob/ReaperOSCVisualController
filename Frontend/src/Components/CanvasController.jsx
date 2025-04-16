import { useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useOSCController from "../Hooks/useOSCController";
import useMouseControl from "../Hooks/useMouseControl";
import InteractiveVisualizer from "../Visualizers/Visualizer";

import { createNode } from "../NodeManager/NodeTypes/BaseNode";
import NodeSelect from "./NodeSelect";

const CanvasController = ({ broadcasting }) => {
  const OSCOutputRefs = useOSCController(broadcasting);
  const mouseControl = useMouseControl({ clickSwell: true, swellRate: 0.01 });
  const canvasRef = useRef(null);
  const visualizerRef = useRef(null);

  const [selectedNodeType, setSelectedNodeType] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return; // Ensure canvasRef is defined
    const visualizer = new InteractiveVisualizer(
      canvasRef.current,
      mouseControl,
      OSCOutputRefs
    );
    visualizerRef.current = visualizer; // Store the visualizer instance for later use
    visualizer.animate(0); // Start the animation loop
    return () => {
      if (visualizerRef.current) {
        visualizer.destroy(); // Clean up the visualizer instance
        visualizerRef.current = null; // Clean up the reference
      }
    };
  }, [mouseControl, OSCOutputRefs]);

  return (
    <>
      <NodeSelect
        mouseRef={mouseControl}
        selectedNodeType={selectedNodeType}
        setSelectedNodeType={setSelectedNodeType}
      />

      <IconButton
        onClick={() => {
          if (selectedNodeType && visualizerRef.current) {
            visualizerRef.current.addNode(
              createNode(selectedNodeType.name, selectedNodeType.blueprint)
            );
          }
        }}
        disabled={!selectedNodeType}
      >
        <AddIcon />
      </IconButton>
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
    </>
  );
};

export default CanvasController;
