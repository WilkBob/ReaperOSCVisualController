import { useEffect, useState, useRef, useMemo } from "react";
import { createOSCAddress, sendMessage } from "../API/oscService";
import CanvasController from "./controls/CanvasController";
import ThreeDCanvasController from "./controls/3DCanvasController";
import mapValueThroughStops from "../mapValue";

// Main component for creating OSC addresses and broadcasting control values
const AddressController = ({ params, broadcasting, visualizer, editing }) => {
  const [controlAddresses, setControlAddresses] = useState({});

  // Initialize ref with empty object
  const controlRefs = useRef({});

  // Combined useEffect to handle both controlRefs and controlAddresses updates
  useEffect(() => {
    // Update controlRefs
    params.forEach((param) => {
      const { controlType } = param;
      if (!controlRefs.current[controlType]) {
        controlRefs.current[controlType] = { current: 1, last: 0 };
      }
    });

    // Clean up removed control types
    const currentKeys = Object.keys(controlRefs.current);
    const activeKeys = params.map((p) => p.controlType);
    currentKeys.forEach((key) => {
      if (!activeKeys.includes(key)) {
        delete controlRefs.current[key];
      }
    });

    console.log("Updated controlRefs", controlRefs.current);

    // Update controlAddresses
    const newControlAddresses = {};
    params.forEach((param) => {
      const { controlType } = param;
      if (!newControlAddresses[controlType]) {
        newControlAddresses[controlType] = [];
      }
      const address = createOSCAddress(param);
      newControlAddresses[controlType].push({
        address,
        valueMap: param.valueMap,
      });
    });

    setControlAddresses(newControlAddresses);
    console.log("controls addresses", newControlAddresses);
  }, [params]);

  // Broadcast control values at regular intervals when broadcasting is enabled
  useEffect(() => {
    let interval;

    if (broadcasting) {
      interval = setInterval(() => {
        Object.keys(controlAddresses).forEach((controlType) => {
          const addresses = controlAddresses[controlType]; // Get addresses for control type
          const ref = controlRefs.current[controlType]; // Get ref for control type

          addresses.forEach(({ address, valueMap }) => {
            const scaledValue = mapValueThroughStops(ref.current, valueMap); // Scale value
            if (scaledValue !== ref.last) {
              // Check if value has changed
              sendMessage(address, scaledValue); // Send OSC message
              ref.last = scaledValue; // Update last broadcasted value
            }
          });
        });
      }, 50); // Broadcast every 50ms
    }

    return () => {
      if (interval) clearInterval(interval); // Clear interval on cleanup
    };
  }, [broadcasting, controlAddresses]);

  const controlConfig = useMemo(() => {
    return Object.fromEntries(
      Object.keys(controlAddresses).map((controlType) => {
        const ref = controlRefs.current[controlType];
        return [
          controlType,
          {
            updateFunction: (value) => {
              ref.current = value; // Update ref value
            },
          },
        ];
      })
    );
  }, [controlAddresses]);

  console.log("controlConfig", controlConfig);

  if (editing) {
    return null; // Return null if in editing mode
  }

  return (
    <>
      {visualizer.threeD === true ? (
        <ThreeDCanvasController
          controlConfig={controlConfig}
          visualizerId={visualizer.id}
        />
      ) : (
        <CanvasController
          controlConfig={controlConfig}
          visualizer={visualizer.id}
        />
      )}
    </>
  );
};

export default AddressController;
