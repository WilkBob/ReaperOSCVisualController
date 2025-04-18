import { createContext } from "react";

const NodeContext = createContext({
  NodeManagerRef: null,
  NodeManager: null,
  saveNodes: () => {},
  loadNodes: () => {},
});

export default NodeContext;
