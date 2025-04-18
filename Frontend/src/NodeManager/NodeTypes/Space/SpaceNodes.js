// Generic function to create simulation nodes
const makeSimBlueprint = (simVariables, variableName) => {
  const variable = simVariables[variableName];

  if (variable.type === "output") {
    // Output nodes: Take input, update simVariables, and return the updated value
    return {
      type: "output",
      label: variable.label,
      inputDefs: [{ name: "Value", defaultValue: variable.defaultValue }],
      init: (globalState, localState) => {
        localState.value = variable.defaultValue;
      },
      evaluate: (inputs) => {
        const [value] = inputs;
        simVariables[variableName].value = value ?? variable.defaultValue ?? 0; // Update simVariables
        return simVariables[variableName].value; // Return the updated value
      },
      destroy: (localState) => {
        localState.value = null; // Clear local state
      },
    };
  } else if (variable.type === "input") {
    // State-derived nodes: Provide value from simVariables and return it
    return {
      type: "input",
      label: variable.label,
      inputDefs: [],
      outputDef: { name: "Value", label: variable.label },
      init: (globalState, localState) => {
        localState.value = variable.defaultValue;
      },
      evaluate: () => {
        return simVariables[variableName].value ?? variable.defaultValue ?? 0; // Return value from simVariables
      },
      destroy: (localState) => {
        localState.value = null; // Clear local state
      },
    };
  }
};

// Export the functions
export default makeSimBlueprint;

// this.simVariables = {
//   sunSize: {
//     value: 0.1,
//     controlled: false,
//     label: "Sun Size",
//     defaultValue: 0.1,
//     type: "output",
//     description: "Controls the sun size relative to maximum",
//   },
//   selectedPlanet: {
//     value: 0.2,
//     controlled: false,
//     label: "Selected Planet",
//     defaultValue: 0.2,
//     type: "output",
//     description: "Controls which planet is selected (normalized 0-1)",
//   },
//   celestialIntensity: {
//     value: 0.5,
//     controlled: false,
//     label: "Celestial Intensity",
//     defaultValue: 0.5,
//     type: "output",
//     description: "Controls sky hue and shooting star frequency",
//   },
//   starGlowX: {
//     value: 0.3,
//     controlled: false,
//     label: "Star Glow X",
//     defaultValue: 0.3,
//     type: "output",
//     description: "X position for star glow effect",
//   },
//   starGlowY: {
//     value: 0.4,
//     controlled: false,
//     label: "Star Glow Y",
//     defaultValue: 0.4,
//     type: "output",
//     description: "Y position for star glow effect",
//   },
//   selectedPlanetX: {
//     value: 0.5,
//     controlled: false,
//     label: "Planet X",
//     type: "input",
//     description: "X position of selected planet (output only)",
//   },
//   selectedPlanetY: {
//     value: 0.5,
//     controlled: false,
//     label: "Planet Y",
//     type: "input",
//     description: "Y position of selected planet (output only)",
//   },
// };
