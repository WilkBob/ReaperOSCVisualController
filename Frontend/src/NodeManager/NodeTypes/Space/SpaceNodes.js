import { makeBlueprint } from "../BaseNode";

// Generic function to create simulation nodes
const makeSimBlueprint = (simVariables, variableName) => {
  const variable = simVariables[variableName];

  if (variable.type === "output") {
    return makeBlueprint({
      type: "output",
      label: variable.label,
      inputDefs: [{ name: "Value", defaultValue: variable.defaultValue }],
      evaluate: (inputs) => {
        const [value] = inputs;
        simVariables[variableName].value = value ?? variable.defaultValue ?? 0; // Fallback to defaultValue or 0
        return simVariables[variableName].value;
      },
    });
  } else if (variable.type === "input") {
    return makeBlueprint({
      type: "input",
      label: variable.label,
      inputDefs: [],
      outputDef: { name: "Value" },
      evaluate: () => {
        return simVariables[variableName].value ?? variable.defaultValue ?? 0; // Fallback to defaultValue or 0
      },
    });
  }
};

// Export the functions
export default makeSimBlueprint;
