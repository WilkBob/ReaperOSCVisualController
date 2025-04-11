import { createContext } from "react";

const ParameterListContext = createContext({
  parameters: [
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
  ],
  setParameters: () => {},
});

export default ParameterListContext;
