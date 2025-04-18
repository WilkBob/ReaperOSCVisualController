import { makeBlueprint } from "../BaseNode";
export const MouseX = makeBlueprint({
  type: "input",
  label: "Mouse X",
  inputDefs: [],
  outputDef: { name: "Mouse X", label: "Mouse X" },
  evaluate: (inputs, globalState /*, localState*/) => {
    // Return the current mouse X position
    return globalState.mouse.x;
  },
});

export const MouseY = makeBlueprint({
  type: "input",
  label: "Mouse Y",
  inputDefs: [],
  outputDef: { name: "Mouse Y", label: "Mouse Y" },
  evaluate: (inputs, globalState /*, localState*/) => {
    // Return the current mouse Y position
    return globalState.mouse.y;
  },
});

export const clickSwell = makeBlueprint({
  type: "input",
  label: "Click Swell",
  inputDefs: [],
  outputDef: { name: "Click Swell", label: "Click Swell" },
  evaluate: (inputs, globalState /*, localState*/) => {
    // Return the current click swell value
    return globalState.mouse.click;
  },
});

export const clickGate = makeBlueprint({
  type: "input",
  label: "Click Gate",
  inputDefs: [],
  outputDef: { name: "Click Gate", label: "Click Gate" },
  evaluate: (inputs, globalState /*, localState*/) => {
    // Return the current click gate value
    return globalState.mouse.isDown ? 1 : 0;
  },
});

export const mouseWheel = makeBlueprint({
  type: "input",
  label: "Mouse Wheel",
  inputDefs: [],
  outputDef: { name: "Mouse Wheel", label: "Mouse Wheel" },
  evaluate: (inputs, globalState /*, localState*/) => {
    // Return the current mouse wheel value
    return globalState.mouse.wheel;
  },
});
