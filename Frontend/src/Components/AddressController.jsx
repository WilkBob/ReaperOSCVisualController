import { useEffect, useState, useRef, useContext } from "react";
import { sendMessage } from "../API/oscService";

import mapValueThroughStops from "../mapValue";
import ParameterListContext from "./context/ParameterContext";

// Main component for broadcasting control values, we're creating addresses elsewhere
const AddressController = ({ broadcasting }) => {
  const [controlAddresses, setControlAddresses] = useState({});
  const { parameters } = useContext(ParameterListContext);
  const controlRefs = useRef({});

  useEffect(() => {
    // Update controlRefs
    parameters.forEach((param) => {
      const { name } = param;
      if (!controlRefs.current[name]) {
        controlRefs.current[name] = { current: 1, last: 0 };
      }
    });

    // Clean up removed control types
    const currentKeys = Object.keys(controlRefs.current);
    const activeKeys = parameters.map((p) => p.name);
    currentKeys.forEach((key) => {
      if (!activeKeys.includes(key)) {
        delete controlRefs.current[key];
      }
    });

    console.log("Updated controlRefs", controlRefs.current);

    // Update controlAddresses
    const newControlAddresses = {};
    parameters.forEach((param) => {
      const { name } = param;
      if (!newControlAddresses[name]) {
        newControlAddresses[name] = [];
      }
      const address = param.address;
      newControlAddresses[name].push({
        address,
        valueMap: param.valueMap,
      });
    });

    setControlAddresses(newControlAddresses);
    console.log("controls addresses", newControlAddresses);
  }, [parameters]);

  // Broadcast control values at regular intervals when broadcasting is enabled
  useEffect(() => {
    let rafId;

    const loop = () => {
      if (broadcasting) {
        Object.keys(controlAddresses).forEach((name) => {
          const addresses = controlAddresses[name];
          const ref = controlRefs.current[name];

          addresses.forEach(({ address, valueMap }) => {
            let scaledValue = ref.current;
            if (valueMap?.enabled) {
              scaledValue = mapValueThroughStops(ref.current, valueMap);
            }

            if (scaledValue !== ref.last) {
              sendMessage(address, scaledValue);
              ref.last = scaledValue;
            }
          });
        });
        rafId = requestAnimationFrame(loop);
      }
    };

    if (broadcasting) rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [broadcasting, controlAddresses]);
  return <>{JSON.stringify}</>;
};

export default AddressController;
