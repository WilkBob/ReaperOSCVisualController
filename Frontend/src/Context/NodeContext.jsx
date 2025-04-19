import { createContext } from "react";

const NodeContext = createContext({
  NodeManagerRef: null,
  broadcasting: false,
  setBroadcasting: () => {},
});

export default NodeContext;
