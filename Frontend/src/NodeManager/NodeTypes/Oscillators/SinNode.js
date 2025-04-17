import { makeBlueprint } from "../BaseNode";

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
    const width = localState.ui?.width || localState.drawImage.width;
    const height = localState.ui?.height || localState.drawImage.height;

    // Update canvas dimensions if they've changed
    if (
      width !== localState.drawImage.width ||
      height !== localState.drawImage.height
    ) {
      localState.drawImage.width = width;
      localState.drawImage.height = height;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Extract evaluated inputs
    const [amplitude, frequency] = localState.evaluatedInputs || [1, 1];
    const { time } = globalState;

    // Draw the sine wave
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;

    for (let x = 0; x < width; x++) {
      const t = (x / width) * (2 * Math.PI); // Map x to [0, 2π]
      const phase = (t + time) * frequency * 2 * Math.PI; // Scale frequency to represent Hz
      const y = amplitude * Math.sin(phase);
      const canvasY = height / 2 - y * (height / 2); // Scale and center

      if (x === 0) {
        ctx.moveTo(x, canvasY);
      } else {
        ctx.lineTo(x, canvasY);
      }
    }

    ctx.stroke();

    // Draw node label
    ctx.fillStyle = "#fff";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Sin Oscillator", width / 2, 20);
  },
  init: (globalState, localState) => {
    // Create a canvas and store it in localState
    localState.drawImage = document.createElement("canvas");
    localState.drawImage.width = localState.ui.width;
    localState.drawImage.height = localState.ui.height;
    localState.ctx = localState.drawImage.getContext("2d");

    // Initialize evaluated inputs
    localState.evaluatedInputs = [1, 1];

    // Set the canvas background to transparent
    localState.ctx.clearRect(
      0,
      0,
      localState.drawImage.width,
      localState.drawImage.height
    );
  },
});

export default SinOscillator;
