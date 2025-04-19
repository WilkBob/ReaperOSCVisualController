import { useEffect, useRef, useContext } from "react";
import { sendMessage } from "../API/oscService";
import mapValueThroughStops from "../mapValue";
import ParameterListContext from "../Context/ParameterContext";
import nodeManager from "../NodeManager/NodeManager";
// Custom hook to manage control broadcasting and value refs
const useOSCController = (broadcasting = true) => {
  const { parameters } = useContext(ParameterListContext);
  const OSCOutputRefs = useRef({});

  // Sync OSCOutputRefs with current parameters AND remove orphaned OSC nodes
  useEffect(() => {
    const paramIds = parameters.map((p) => p.id);

    // Add or update refs for all parameters
    parameters.forEach(({ id, name }) => {
      if (!OSCOutputRefs.current[id]) {
        OSCOutputRefs.current[id] = { current: 1, last: 0, name };
      } else {
        // Always update the name in case it changed
        OSCOutputRefs.current[id].name = name;
      }
    });

    // Remove refs for parameters that no longer exist
    Object.keys(OSCOutputRefs.current).forEach((id) => {
      if (!paramIds.includes(id)) {
        delete OSCOutputRefs.current[id];
      }
    });

    // Update the global state with the current refs
    nodeManager.globalState.osc.outputRefs = OSCOutputRefs.current;

    // --- Remove orphaned OSC nodes from NodeManager ---
    const oscOutputNodes = nodeManager.nodes.filter(
      (node) => node.blueprint?.type === "output" && node.blueprint?.paramId
    );

    oscOutputNodes.forEach((node) => {
      if (!paramIds.includes(node.blueprint.paramId)) {
        console.log(
          `Removing orphaned OSC node ${node.label} (paramId: ${node.blueprint.paramId})`
        );
        nodeManager.removeNode(node.id); // Assuming NodeManager has removeNode
      }
    });
    // --------------------------------------------------
  }, [parameters]);

  // Broadcast loop
  useEffect(() => {
    let rafId;

    const loop = () => {
      if (broadcasting) {
        parameters.forEach(({ id, name, address, valueMap }) => {
          const ref = OSCOutputRefs.current[id];
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
