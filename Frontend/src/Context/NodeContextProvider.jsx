import { useRef, useState } from "react";
import nodeManager from "../NodeManager/NodeManager";

import NodeContext from "./NodeContext";
import useOSCController from "../Hooks/useOSCController";
const NodeContextProvider = ({ children }) => {
  const NodeManagerRef = useRef(nodeManager);

  const [broadcasting, setBroadcasting] = useState(false);
  const OutputRefs = useOSCController(broadcasting);
  console.log("OutputRefs", OutputRefs);
  return (
    <NodeContext.Provider
      value={{ NodeManagerRef, broadcasting, setBroadcasting }}
    >
      {children}
    </NodeContext.Provider>
  );
};

export default NodeContextProvider;
