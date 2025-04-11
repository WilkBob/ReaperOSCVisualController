import { createContext } from "react";

const VisualizerContext = createContext({
  visualizer: { id: "circle", threeD: false },
  setVisualizer: () => {},
});

export default VisualizerContext;
