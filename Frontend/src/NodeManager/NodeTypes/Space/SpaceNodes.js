import { makeBlueprint } from "../BaseNode";
import { spaceControls } from "../../../Visualizers/Space/Space"; // Import the singleton

// Function to create blueprints dynamically from simVariables
function createSpaceBlueprints() {
  const blueprints = {};

  for (const key in spaceControls.simVariables) {
    const variable = spaceControls.simVariables[key];

    if (variable.type === "input") {
      // Create an INPUT node blueprint (reads value FROM sim)
      blueprints[key] = makeBlueprint({
        type: "input", // Special type for simulation inputs
        label: variable.label,
        inputDefs: [], // No inputs for sim input nodes
        outputDef: { name: key, label: variable.label },
        evaluate: (/*, localState*/) => {
          // Read directly from the singleton's simVariables
          return spaceControls.simVariables[key].value;
        },
        // Add init/update/destroy if needed, e.g., for custom drawing
        init: (globalState, localState) => {
          localState.ui.width = 150;
          localState.ui.height = 50;
        },
      });
    } else if (variable.type === "output") {
      // Create an OUTPUT node blueprint (writes value TO sim)
      blueprints[key] = makeBlueprint({
        type: "output", // Special type for simulation outputs
        label: variable.label,
        inputDefs: [{ name: "Value", defaultValue: variable.defaultValue }],
        outputDef: null, // No output from sim output nodes
        evaluate: (inputs /* globalState, localState*/) => {
          const value = inputs[0] ?? variable.defaultValue; // Use default if no input
          // Write directly to the singleton's simVariables
          spaceControls.simVariables[key].value = value;
          return value; // Output nodes can still return their input value
        },
        // Add init/update/destroy if needed, e.g., for custom drawing
        init: (globalState, localState) => {
          localState.ui.width = 150;
          localState.ui.height = 50;
        },
      });
    }
  }
  return blueprints;
}

const SpaceNodeBlueprints = createSpaceBlueprints();

export default SpaceNodeBlueprints;
