import { makeBlueprint } from "./BaseNode";

const GamepadAxisNode = makeBlueprint({
  type: "transform",
  label: "Gamepad Axis",
  inputDefs: [
    { name: "Gamepad Index", defaultValue: 0 },
    { name: "Axis Index", defaultValue: 0 },
  ],
  outputDef: { name: "Output", label: "Axis Value" },

  init: (globalState, localState) => {
    localState.gamepads = [];
    localState.polling = false;
    localState.listeners = [];

    localState.startPolling = () => {
      if (localState.polling) return;
      localState.polling = true;
      const poll = () => {
        const pads = navigator.getGamepads();
        localState.gamepads = pads;
        localState.listeners.forEach((fn) => fn(pads));
        if (localState.polling) {
          requestAnimationFrame(poll);
        }
      };
      requestAnimationFrame(poll);
    };

    localState.onUpdate = (fn) => {
      localState.listeners.push(fn);
    };

    localState.stopPolling = () => {
      localState.polling = false;
      localState.listeners = [];
    };

    localState.axisValue = 0;
    localState.update = (pads) => {
      const pad = pads[localState.padIndex];
      if (pad && pad.axes.length > localState.axisIndex) {
        localState.axisValue = (pad.axes[localState.axisIndex] + 1) / 2;
      }
    };

    localState.padIndex = 0; // overwritten by inputs at runtime
    localState.axisIndex = 0;

    localState.startPolling();
    localState.onUpdate((pads) => {
      localState.update(pads);
    });
  },

  evaluate: (inputs, globalState, localState) => {
    const pads = navigator.getGamepads();
    const totalPads = pads.filter(Boolean).length;

    // Normalize padIndex and axisIndex to 0-1 range relative to their lengths
    localState.padIndex =
      Math.min(Math.max(inputs[0] * totalPads, 0), totalPads - 1) | 0;

    const pad = pads[localState.padIndex];
    const totalAxes = pad ? pad.axes.length : 0;
    localState.axisIndex =
      Math.min(Math.max(inputs[1] * totalAxes, 0), totalAxes - 1) | 0;

    return localState.axisValue ?? 0;
  },

  destroy: (localState) => {
    localState.stopPolling();
  },
});

export default GamepadAxisNode;
