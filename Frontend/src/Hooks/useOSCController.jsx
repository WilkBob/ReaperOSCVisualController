import { useEffect, useRef, useContext } from "react";
import { sendMessage } from "../API/oscService";
import mapValueThroughStops from "../mapValue";
import ParameterListContext from "../Context/ParameterContext";

// Custom hook to manage control broadcasting and value refs
const useOSCController = (broadcasting = true) => {
  const { parameters } = useContext(ParameterListContext);
  const controlRefs = useRef({});

  // Sync controlRefs with current parameters
  useEffect(() => {
    const currentKeys = Object.keys(controlRefs.current);
    const activeKeys = parameters.map((p) => p.name);

    // Add missing refs
    activeKeys.forEach((name) => {
      if (!controlRefs.current[name]) {
        controlRefs.current[name] = { current: 1, last: 0 }; //1 instead of zero to send a message on first render for debug / later 0.5, 0.5
      }
    });

    // Clean up stale refs
    currentKeys.forEach((key) => {
      if (!activeKeys.includes(key)) {
        delete controlRefs.current[key];
      }
    });
  }, [parameters]);

  // Broadcast loop
  useEffect(() => {
    let rafId;

    const loop = () => {
      if (broadcasting) {
        parameters.forEach(({ name, address, valueMap }) => {
          const ref = controlRefs.current[name];
          if (!ref || !address) return;

          let value = ref.current;
          if (valueMap?.enabled) {
            value = mapValueThroughStops(value, valueMap);
          }

          if (value !== ref.last) {
            sendMessage(address, value);
            ref.last = value;
          }
        });

        rafId = requestAnimationFrame(loop);
      }
    };

    if (broadcasting) rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [broadcasting, parameters]);

  return controlRefs;
};

export default useOSCController;
