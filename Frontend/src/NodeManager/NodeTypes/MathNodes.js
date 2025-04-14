import { makeBlueprint } from "./BaseNode";

const MinMax = makeBlueprint({
  type: "transform",
  label: "Min/Max",
  inputDefs: [
    { name: "Switch", defaultValue: 0 },
    { name: "Input 1", defaultValue: 0 },
    { name: "Input 2", defaultValue: 0 },
  ],
  outputDef: { name: "Output", label: "Min/Max" },
  evaluate: (inputs) => {
    const [switchValue, input1, input2] = inputs;
    return switchValue === 0
      ? Math.min(input1, input2)
      : Math.max(input1, input2);
  },
});
const Avg = makeBlueprint({
  type: "transform",
  label: "Average",
  inputDefs: [
    { name: "Input 1", defaultValue: 0 },
    { name: "Input 2", defaultValue: 0 },
  ],
  outputDef: { name: "Output", label: "Average" },
  evaluate: (inputs) => {
    const [input1, input2] = inputs;
    return (input1 + input2) / 2;
  },
});

const SinOscillator = makeBlueprint({
  type: "transform",
  label: "Sin Oscillator",
  inputDefs: [
    { name: "Amplitude", defaultValue: 1 },
    { name: "Frequency", defaultValue: 1 },
  ],
  outputDef: { name: "Output", label: "Sin" },
  evaluate: (inputs, globalState) => {
    const [amplitude, frequency] = inputs;
    const time = globalState.time; // Assuming you have a time variable in your global state
    return (amplitude * Math.sin(frequency * time) + 1) / 2;
  },
  update: () => {
    // Update logic if needed
  },
  init: () => {
    // Initialization logic if needed
  },
});

export { MinMax, Avg, SinOscillator };
