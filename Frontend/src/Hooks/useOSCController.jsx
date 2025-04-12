import { useEffect, useRef, useContext } from "react";
import { sendMessage } from "../API/oscService";
import mapValueThroughStops from "../mapValue";
import ParameterListContext from "../Context/ParameterContext";

// Custom hook to manage control broadcasting and value refs
const useOSCController = (broadcasting = true) => {
  const { parameters } = useContext(ParameterListContext);
  const OSCOutputRefs = useRef({});

  // Sync OSCOutputRefs with current parameters
  useEffect(() => {
    const currentKeys = Object.keys(OSCOutputRefs.current);
    const activeKeys = parameters.map((p) => p.name);

    // Add missing refs
    activeKeys.forEach((name) => {
      if (!OSCOutputRefs.current[name]) {
        OSCOutputRefs.current[name] = { current: 1, last: 0, name }; //1 instead of zero to send a message on first render for debug / later 0.5, 0.5
      }
    });

    // Clean up stale refs
    currentKeys.forEach((key) => {
      if (!activeKeys.includes(key)) {
        delete OSCOutputRefs.current[key];
      }
    });
  }, [parameters]);

  // Broadcast loop
  useEffect(() => {
    let rafId;

    const loop = () => {
      if (broadcasting) {
        parameters.forEach(({ name, address, valueMap }) => {
          const ref = OSCOutputRefs.current[name];
          if (!ref || !address) {
            console.warn(`No ref or address for ${name} - something's F8cked`);
            return;
          }

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

  return OSCOutputRefs;
};

export default useOSCController;
