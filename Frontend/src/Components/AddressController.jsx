import { useEffect, useState, useRef, useMemo } from "react";
import { createOSCAddress, sendMessage } from "../API/oscService";

import CanvasController from "./controls/CanvasController";
//Component creates OSC addresses for different control types and broadcasts their values at a specified interval. It uses React hooks to manage state and side effects, and it scales values between specified ranges for each control type. - adding new controls happens here and in paramlist, - also good place to invert values if added to paramlist - this is the main controller for the address creation and broadcasting.
const AddressController = ({ params, broadcasting, visualizer }) => {
  // Object to store addresses for each control type
  const [controlAddresses, setControlAddresses] = useState({});

  // Refs to store current values and last broadcasted values
  const controlRefs = useRef({
    "mouse-x": { val: 0, last: null },
    "mouse-y": { val: 0, last: null },
    "ball-x": { val: 0, last: null },
    "ball-y": { val: 0, last: null },
    click: { val: 0, last: null },
    chaos: { val: 0, last: null },
  });

  // Configuration for control types
  const controlConfig = useMemo(() => {
    return {
      "mouse-x": {
        ref: controlRefs.current["mouse-x"],
        updateFunction: (val) => (controlRefs.current["mouse-x"].val = val),
      },
      "mouse-y": {
        ref: controlRefs.current["mouse-y"],
        updateFunction: (val) => (controlRefs.current["mouse-y"].val = val),
      },
      "ball-x": {
        ref: controlRefs.current["ball-x"],
        updateFunction: (val) => (controlRefs.current["ball-x"].val = val),
      },
      "ball-y": {
        ref: controlRefs.current["ball-y"],
        updateFunction: (val) => (controlRefs.current["ball-y"].val = val),
      },
      click: {
        ref: controlRefs.current["click"],
        updateFunction: (val) => (controlRefs.current["click"].val = val),
      },
      chaos: {
        ref: controlRefs.current["chaos"],
        updateFunction: (val) => (controlRefs.current["chaos"].val = val),
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
            const scaledValue = scaleValue(ref.val, 0, 1, range.min, range.max);
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
    <>
      <CanvasController
        trackX={!!controlAddresses["mouse-x"]}
        trackY={!!controlAddresses["mouse-y"]}
        trackBallX={!!controlAddresses["ball-x"]}
        trackBallY={!!controlAddresses["ball-y"]}
        trackClick={!!controlAddresses["click"]}
        trackChaos={!!controlAddresses["chaos"]}
        onUpdateX={controlConfig["mouse-x"].updateFunction}
        onUpdateY={controlConfig["mouse-y"].updateFunction}
        onUpdateBallX={controlConfig["ball-x"].updateFunction}
        onUpdateBallY={controlConfig["ball-y"].updateFunction}
        onUpdateClick={controlConfig["click"].updateFunction}
        onUpdateChaos={controlConfig["chaos"].updateFunction}
        visualizer={visualizer}
      />
    </>
  );
};

export default AddressController;
