import { useEffect, useState, useRef, useMemo } from "react";
import { createOSCAddress, sendMessage } from "../API/oscService";

import CanvasController from "./controls/CanvasController";

const AddressController = ({ params, broadcasting }) => {
  // Object to store addresses for each control type
  const [controlAddresses, setControlAddresses] = useState({});

  // Refs to store current values and last broadcasted values
  const controlRefs = useRef({
    "mouse-x": { current: 0, last: null },
    "mouse-y": { current: 0, last: null },
    "ball-x": { current: 0, last: null },
    "ball-y": { current: 0, last: null },
    click: { current: 0, last: null },
  });

  // Configuration for control types
  const controlConfig = useMemo(() => {
    return {
      "mouse-x": {
        ref: controlRefs.current["mouse-x"],
        updateFunction: (val) => (controlRefs.current["mouse-x"].current = val),
      },
      "mouse-y": {
        ref: controlRefs.current["mouse-y"],
        updateFunction: (val) => (controlRefs.current["mouse-y"].current = val),
      },
      "ball-x": {
        ref: controlRefs.current["ball-x"],
        updateFunction: (val) => (controlRefs.current["ball-x"].current = val),
      },
      "ball-y": {
        ref: controlRefs.current["ball-y"],
        updateFunction: (val) => (controlRefs.current["ball-y"].current = val),
      },
      click: {
        ref: controlRefs.current["click"],
        updateFunction: (val) => (controlRefs.current["click"].current = val),
      },
    };
  }, []);

  // Update control states and addresses when params change
  useEffect(() => {
    const newControlAddresses = {};

    params.forEach((param) => {
      const { controlType } = param;
      if (!newControlAddresses[controlType]) {
        newControlAddresses[controlType] = [];
      }
      const address = createOSCAddress(param);
      newControlAddresses[controlType].push({
        address,
        range: param.range,
      });
    });

    setControlAddresses(newControlAddresses);
    console.log("controls adresses", newControlAddresses);
  }, [params]);

  // Set up OSC broadcast interval when broadcasting is enabled
  useEffect(() => {
    let interval;

    if (broadcasting) {
      interval = setInterval(() => {
        Object.keys(controlAddresses).forEach((controlType) => {
          const addresses = controlAddresses[controlType];
          const { ref } = controlConfig[controlType];

          addresses.forEach(({ address, range }) => {
            const scaledValue = scaleValue(
              ref.current,
              0,
              1,
              range.min,
              range.max
            );
            if (scaledValue !== ref.last) {
              sendMessage(address, scaledValue);
              ref.last = scaledValue; // Update last broadcasted value
            }
          });
        });
      }, 50); // Update rate - 50ms
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [broadcasting, controlAddresses, controlConfig]);

  // Helper function to scale values between ranges
  const scaleValue = (value, inMin, inMax, outMin, outMax) => {
    return parseFloat(
      (
        ((value - inMin) * (outMax - outMin)) / (inMax - inMin) +
        outMin
      ).toFixed(2)
    );
  };

  return (
    <CanvasController
      trackX={!!controlAddresses["mouse-x"]}
      trackY={!!controlAddresses["mouse-y"]}
      trackBallX={!!controlAddresses["ball-x"]}
      trackBallY={!!controlAddresses["ball-y"]}
      onUpdateX={controlConfig["mouse-x"].updateFunction}
      onUpdateY={controlConfig["mouse-y"].updateFunction}
      onUpdateBallX={controlConfig["ball-x"].updateFunction}
      onUpdateBallY={controlConfig["ball-y"].updateFunction}
      trackClick={!!controlAddresses["click"]}
      onUpdateClick={controlConfig["click"].updateFunction}
    />
  );
};

export default AddressController;
