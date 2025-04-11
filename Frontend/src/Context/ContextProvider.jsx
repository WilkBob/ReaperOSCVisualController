import { useState } from "react";
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
        {children}
      </ParameterListContext.Provider>
    </VisualizerContext.Provider>
  );
};

export default ParameterListProvider;
