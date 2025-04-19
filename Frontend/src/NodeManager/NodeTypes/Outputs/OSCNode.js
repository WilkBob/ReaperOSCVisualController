export default function createOSCBlueprint(key, name) {
  return {
    paramId: key, // <-- Add this line
    type: "output",
    label: name || key,
    inputDefs: [{ name: "Value", defaultValue: 0 }],
    init: (globalState, localState) => {
      const image = new Image();
      localState.canvas = document.createElement("canvas");
      localState.canvas.width = localState.ui.width = 200; // Default width
      localState.canvas.height = localState.ui.height = 200; // Default height
      localState.ctx = localState.canvas.getContext("2d");
      localState.nodeName = name || key;
      localState.currentValue = null;
      localState.hasConnection = false;

      // Create reusable draw function
      localState.drawFunction = () => {
        // Clear canvas before drawing
        localState.ctx.clearRect(
          0,
          0,
          localState.canvas.width,
          localState.canvas.height
        );

        if (localState.image) {
          const padding = 20; // Padding around the image
          const maxWidth = localState.canvas.width - padding * 2;
          const maxHeight = localState.canvas.height - padding * 2 - 50; // Extra space for text and value

          // Calculate aspect ratio scaling
          const scale = Math.min(
            maxWidth / localState.image.width,
            maxHeight / localState.image.height
          );

          const scaledWidth = localState.image.width * scale;
          const scaledHeight = localState.image.height * scale;

          // Center the image
          const offsetX = (localState.canvas.width - scaledWidth) / 2;
          const offsetY = (localState.canvas.height - scaledHeight - 50) / 2; // Adjust for text and value

          // Draw the image scaled and centered
          localState.ctx.drawImage(
            localState.image,
            offsetX,
            offsetY,
            scaledWidth,
            scaledHeight
          );
        }

        // Draw the node name
        localState.ctx.fillStyle = "#fff";
        localState.ctx.font = "18px Arial";
        localState.ctx.textAlign = "center";
        localState.ctx.fillText(
          localState.nodeName,
          localState.canvas.width / 2,
          localState.canvas.height - 40 // Position above the value
        );

        // Check evaluatedInputs to determine if connected
        const isConnected =
          localState.evaluatedInputs &&
          localState.evaluatedInputs[0] !== undefined &&
          localState.evaluatedInputs[0] !== null;

        // Draw the current value or connection status
        localState.ctx.font = "14px Arial";
        localState.ctx.fillStyle = isConnected ? "#4CAF50" : "#FF5252";

        const valueText = isConnected
          ? `Value: ${localState.evaluatedInputs[0].toFixed(2)}`
          : "Disconnected";

        localState.ctx.fillText(
          valueText,
          localState.canvas.width / 2,
          localState.canvas.height - 15 // Position below the name
        );

        // Set drawImage to the canvas element so VisualNode can use it
        localState.drawImage = localState.canvas;
      };

      image.src = "REAPER.png"; // Placeholder image
      image.onload = () => {
        localState.image = image;
        localState.drawFunction(); // Call the draw function once the image is loaded
      };
    },
    evaluate: (inputs, globalState) => {
      const value = inputs[0] ?? 0; // default to 0 if no input

      globalState.osc.outputRefs[key].current = value; // set the value to the output ref
      return value; // return the value for the node
    },

    update: (globalState, localState) => {
      // Removed 'node' parameter
      // Check if canvas dimensions need to be updated
      if (
        localState.ui.width !== localState.canvas.width ||
        localState.ui.height !== localState.canvas.height
      ) {
        localState.canvas.width = localState.ui.width; // Update canvas width
        localState.canvas.height = localState.ui.height; // Update canvas height
      }

      // Check if name has changed by looking up in globalState
      // Ensure the ref exists before accessing its name
      const currentName =
        globalState.osc?.outputRefs?.[key]?.name || name || key;
      if (localState.nodeName !== currentName) {
        localState.nodeName = currentName;
      }

      // localState.evaluatedInputs is updated during the evaluate phase
      // The draw function will use localState.evaluatedInputs directly

      // Call the draw function to update the canvas
      if (localState.drawFunction) {
        localState.drawFunction();
      }
    },
    destroy: (localState) => {
      if (localState.canvas) {
        localState.canvas.width = 0; // Clear the canvas width
        localState.canvas.height = 0; // Clear the canvas height
      }
    },
  };
}
