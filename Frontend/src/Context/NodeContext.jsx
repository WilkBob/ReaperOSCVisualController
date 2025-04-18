import { createContext } from "react";

const NodeContext = createContext({
  NodeManager: null,
  saveNodes: () => {},
  loadNodes: () => {},
});

export default NodeContext;
