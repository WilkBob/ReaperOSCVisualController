import Constant from "./Constant";
import MinMax from "./MinMaxNode";
import Avg from "./AverageNode";

// Export individual nodes for direct imports
export { Constant, MinMax, Avg };

// Export a node registry for easy registration
export const MathNodes = {
  Constant,
  MinMax,
  Avg,
};

// Default export for convenience
export default MathNodes;
