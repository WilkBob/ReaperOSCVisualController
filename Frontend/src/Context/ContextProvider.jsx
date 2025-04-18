import { useEffect, useRef, useState } from "react";
import ParameterListContext from "./ParameterContext";
import VisualizerContext from "./VisualizerContext";
import NodeContext from "./NodeContext";
import nodeManager from "../NodeManager/NodeManager";
import { ThemeProvider } from "@emotion/react";
import { spaceTheme, rainbowTheme } from "../Components/Themes";
import { v4 } from "uuid";
import { spaceControls } from "../Visualizers/Space/Space";
export const ParameterListProvider = ({ children }) => {
  const [parameters, setParameters] = useState([
    {
      id: v4(),
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
    id: "space",
    object: spaceControls,
    name: "Space",
  });
  const [theme, setTheme] = useState(spaceTheme);

  const NodeManagerRef = useRef(nodeManager);

  useEffect(() => {
    if (visualizer.id === "space") {
      setTheme(spaceTheme);
    } else if (visualizer.id === "particle") {
      setTheme(rainbowTheme);
    } else {
      console.error("Unknown visualizer ID:", visualizer.id);
    }
  }, [visualizer.id]);

  const removeParameter = (index) => {
    if (index < 0 || index >= parameters.length) {
      console.error("Invalid index:", index);
      return;
    }
    if (parameters.length === 1) {
      return;
    }
    setParameters((prev) => prev.filter((_, i) => i !== index));
  };

  const addParameter = () => {
    setParameters((prev) => [
      ...prev,
      {
        id: v4(),
        name: `Parameter ${prev.length + 1}`,
        address: `/track/${prev.length + 1}/pan`,
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
  };

  const getParameter = (index) => {
    if (index < 0 || index >= parameters.length) {
      console.error("Invalid index:", index);
      return null;
    }
    return parameters[index];
  };
  const updateParameter = (index, key, value) => {
    if (index < 0 || index >= parameters.length) {
      console.error("Invalid index:", index);
      return;
    }
    setParameters((prev) =>
      prev.map((param, i) => (i === index ? { ...param, [key]: value } : param))
    );
  };

  return (
    <VisualizerContext.Provider value={{ visualizer, setVisualizer }}>
      <ParameterListContext.Provider
        value={{
          parameters,
          setParameters,
          removeParameter,
          addParameter,
          updateParameter,
          getParameter,
        }}
      >
        <NodeContext.Provider value={{ NodeManagerRef }}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </NodeContext.Provider>
      </ParameterListContext.Provider>
    </VisualizerContext.Provider>
  );
};

export default ParameterListProvider;
