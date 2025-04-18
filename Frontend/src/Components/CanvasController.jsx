import { useContext, useEffect, useRef, useState } from "react";
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
import NodeVisualizer from "../Visualizers/NodeVisualizer";
import NodeContext from "../Context/NodeContext";

import { createNode } from "../NodeManager/NodeTypes/BaseNode";
import NodeSelect from "./NodeSelect";

const CanvasController = ({ broadcasting }) => {
  const OSCOutputRefs = useOSCController(broadcasting);
  const mouseControl = useMouseControl({ clickSwell: true, swellRate: 0.01 });
  const canvasRef = useRef(null);
  const visualizerRef = useRef(null);
  const NodeManagerRef = useContext(NodeContext);

  const [selectedNodeType, setSelectedNodeType] = useState(null);

  useEffect(() => {
    if (!canvasRef.current || !NodeManagerRef?.current) {
      // Check .current here
      console.warn("Canvas or NodeManager ref not ready for Visualizer");
      return; // Exit if refs aren't ready
    }

    console.log("Creating NodeVisualizer instance...");
    const visualizer = new NodeVisualizer(
      canvasRef.current,
      mouseControl,
      NodeManagerRef // Pass the whole ref object
    );
    visualizerRef.current = visualizer;

    // Call resize *after* the instance is created and assigned
    // Ensure the nodeManager instance itself is valid before calling resize
    if (
      visualizer.nodeManager &&
      typeof visualizer.nodeManager.resize === "function"
    ) {
      console.log("Calling initial resize for NodeVisualizer and NodeManager");
      visualizer.resize(); // This will call nodeManager.resize internally
    } else {
      console.error(
        "NodeManager instance or resize method not available for initial resize."
      );
    }

    console.log("Starting animation loop...");
    visualizer.animate(0); // Start the animation loop

    return () => {
      console.log("Cleanup: Destroying NodeVisualizer instance...");
      if (visualizerRef.current) {
        visualizerRef.current.destroy();
        visualizerRef.current = null;
      }
    };
    // Ensure dependencies are correct - NodeManagerRef itself is stable,
    // but mouseControl might change if its hook dependencies change.
  }, [mouseControl, NodeManagerRef]); // Removed OSCOutputRefs if not directly used by visualizer setup

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
              createNode(
                selectedNodeType.name,
                selectedNodeType.blueprint,
                selectedNodeType.blueprint
              ) //need id system
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
