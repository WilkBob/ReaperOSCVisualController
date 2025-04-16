import { makeBlueprint } from "./BaseNode";

const Constant = makeBlueprint({
  type: "input",
  label: "Constant",
  inputDefs: [],
  outputDef: { name: "Output", label: "Value" },
  evaluate: (inputs, globalState, localState) => {
    // Return the current slider value
    return localState.value;
  },
  update: (globalState, localState) => {
    const ctx = localState.ctx;
    const width = localState.ui.width;
    const height = localState.ui.height;
    const mouse = globalState.mouse;
    const screenSize = globalState.screenSize;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw the background
    ctx.fillStyle = "rgba(40, 40, 40, 0.6)";
    ctx.fillRect(0, 0, width, height);

    // Calculate slider dimensions
    const sliderY = height / 2;
    const sliderHeight = 6;
    const padding = 20;
    const sliderWidth = width - padding * 2;

    // Draw slider track
    ctx.fillStyle = "rgba(80, 80, 80, 0.8)";
    ctx.fillRect(
      padding,
      sliderY - sliderHeight / 2,
      sliderWidth,
      sliderHeight
    );

    // Calculate slider position based on current value
    const handlePos = padding + localState.value * sliderWidth;

    // Check for mouse interaction

    if (mouse.isDown && localState.ui.selected) {
      // IMPORTANT: Denormalize the mouse coordinates from 0-1 to screen pixels
      const absoluteMouseX = mouse.x * screenSize.width;
      const absoluteMouseY = mouse.y * screenSize.height;

      // Calculate relative position to the node
      const relX = absoluteMouseX - localState.ui.position.x;
      const relY = absoluteMouseY - localState.ui.position.y;

      // Check if mouse is within the node's bounds
      if (relX >= 0 && relX <= width && relY >= 0 && relY <= height) {
        // Update the value based on mouse position
        let newValue = (relX - padding) / sliderWidth;

        // Clamp the value between 0 and 1
        newValue = Math.max(0, Math.min(1, newValue));

        // Update the local state value
        localState.value = newValue;
        // Update evaluated inputs to match
        localState.evaluatedInputs = [newValue];
      }
    }
    // Update the drawImage if screen size changed
    if (
      width !== localState.drawImage.width ||
      height !== localState.drawImage.height
    ) {
      localState.drawImage.width = width;
      localState.drawImage.height = height;
    }

    // Draw the slider handle
    ctx.fillStyle = "rgba(100, 200, 255, 0.9)";
    ctx.beginPath();
    ctx.arc(handlePos, sliderY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw the value text
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(localState.value.toFixed(2), width / 2, height - 20);

    // Draw the label
    ctx.font = "16px Arial";
    ctx.fillText("Constant", width / 2, 20);
  },
  init: (globalState, localState) => {
    localState.value = 0.5; // Set the default value
    localState.evaluatedInputs = [localState.value]; // Initialize evaluated inputs

    // Ensure UI object exists
    if (!localState.ui) {
      localState.ui = {};
    }

    // Set default size if not already defined
    if (!localState.ui.width) localState.ui.width = 200;
    if (!localState.ui.height) localState.ui.height = 100;

    // Ensure position exists
    if (!localState.ui.position) {
      localState.ui.position = { x: 0, y: 0 };
    }

    // Create drawing canvas that matches the node size
    localState.drawImage = document.createElement("canvas");
    localState.drawImage.width = localState.ui.width;
    localState.drawImage.height = localState.ui.height;
    localState.ctx = localState.drawImage.getContext("2d");
  },
});

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

export { MinMax, Avg, SinOscillator, Constant };
