import { makeBlueprint } from "./BaseNode";

const makeConstant = (value) => {
  return makeBlueprint({
    type: "input",
    label: "Constant",
    inputDefs: [],
    outputDef: { name: "Output", label: "Constant" },
    evaluate: () => value,
  });
};

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
    const result =
      switchValue < 0.5 ? Math.min(input1, input2) : Math.max(input1, input2);

    console.debug("MinMax Node Evaluation:", {
      switchValue,
      input1,
      input2,
      result,
    });

    return result;
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
    const { time } = globalState;
    const phase = time * frequency * 2 * Math.PI; // Scale frequency to represent Hz
    return (amplitude * Math.sin(phase) + 1) / 2;
  },
  update: (globalState, localState) => {
    const ctx = localState.ctx;

    // Clear the canvas
    ctx.clearRect(
      0,
      0,
      localState.drawImage.width,
      localState.drawImage.height
    );

    // Extract evaluated inputs
    const [amplitude, frequency] = localState.evaluatedInputs;
    const { time } = globalState;

    // Draw the sine wave
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"; // Black with some transparency
    ctx.lineWidth = 2;

    for (let x = 0; x < localState.drawImage.width; x++) {
      const t = (x / localState.drawImage.width) * (2 * Math.PI); // Map x to [0, 2π]
      const phase = (t + time) * frequency * 2 * Math.PI; // Scale frequency to represent Hz
      const y = amplitude * Math.sin(phase);
      const canvasY =
        localState.drawImage.height / 2 - y * (localState.drawImage.height / 2); // Scale and center

      if (x === 0) {
        ctx.moveTo(x, canvasY);
      } else {
        ctx.lineTo(x, canvasY);
      }
    }

    ctx.stroke();
  },
  init: (globalState, localState) => {
    // Create a canvas and store it in localState
    localState.drawImage = document.createElement("canvas");
    localState.drawImage.width = 100;
    localState.drawImage.height = 200;
    localState.ctx = localState.drawImage.getContext("2d");

    // Set the canvas background to transparent
    localState.ctx.clearRect(
      0,
      0,
      localState.drawImage.width,
      localState.drawImage.height
    );
  },
});

export { MinMax, Avg, SinOscillator, makeConstant };
