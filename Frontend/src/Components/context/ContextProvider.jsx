import { useEffect, useState } from "react";
import ParameterListContext from "./ParameterContext";
import VisualizerContext from "./VisualizerContext";

export const ParameterListProvider = ({ children }) => {
  const [parameters, setParameters] = useState([
    {
      name: "Parameter 1",
      address: "/track/1/pan",
      valueMap: {
        enabled: true,
        stops: [
          { x: 0.0, y: 0.0 },
          { x: 1.0, y: 1.0 },
        ],
        interpolate: true,
        invert: false,
      },
    },
  ]);
  const [visualizer, setVisualizer] = useState({
    id: "circle",
    threeD: false,
  });

  return (
    <VisualizerContext.Provider value={{ visualizer, setVisualizer }}>
      <ParameterListContext.Provider value={{ parameters, setParameters }}>
        {children}
      </ParameterListContext.Provider>
    </VisualizerContext.Provider>
  );
};

export default ParameterListProvider;
