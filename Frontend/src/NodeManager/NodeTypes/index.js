// Import node groups
import MathNodes from "./Math";
import OscillatorNodes from "./Oscillators";

// Re-export individual node groups
export { MathNodes, OscillatorNodes };

// Create and export a combined registry of all nodes
export const AllNodes = {
  ...MathNodes,
  ...OscillatorNodes,
};

// Default export for easy access to all nodes
export default AllNodes;
