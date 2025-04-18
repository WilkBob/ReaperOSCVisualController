import { createContext } from "react";

const VisualizerContext = createContext({
  visualizer: null,
  setVisualizer: () => {},
});

export default VisualizerContext;
