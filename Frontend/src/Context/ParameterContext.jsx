import { createContext } from "react";

const ParameterListContext = createContext({
  parameters: [
    {
      id: "1",
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
  ],
  setParameters: () => {},
  removeParameter: (index) => {
    return index;
  },
  addParameter: () => {},
  updateParameter: (index, key, value) => {
    return { index, key, value };
  },
  getParameter: (index) => {
    return index;
  },
});

export default ParameterListContext;
