export default function createOSCBlueprint(outputRefs, key) {
  return {
    type: "output",
    label: key,
    inputDefs: [{ name: "Value", defaultValue: 0 }],
    init: (globalState, localState) => {
      const image = new Image();
      localState.canvas = document.createElement("canvas");
      localState.canvas.width = localState.ui.size.x;
      localState.canvas.height = localState.ui.size.y;
      localState.ctx = localState.canvas.getContext("2d");
      image.src = "REAPER.png"; // Placeholder image

      image.onload = () => {
        // Calculate scaling to fit image within node
        const padding = 20; // Padding around the image
        const maxWidth = localState.ui.size.x - padding * 2;
        const maxHeight = localState.ui.size.y - padding * 2 - 30; // Extra space for text

        // Calculate aspect ratio scaling
        const scale = Math.min(
          maxWidth / image.width,
          maxHeight / image.height
        );

        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;

        // Center the image
        const offsetX = (localState.ui.size.x - scaledWidth) / 2;
        const offsetY = (localState.ui.size.y - scaledHeight - 30) / 2; // Adjust for text

        // Clear canvas before drawing
        localState.ctx.clearRect(
          0,
          0,
          localState.canvas.width,
          localState.canvas.height
        );

        // Draw the image scaled and centered
        localState.ctx.drawImage(
          image,
          offsetX,
          offsetY,
          scaledWidth,
          scaledHeight
        );

        // Draw the text below the image
        localState.ctx.fillStyle = "black";
        localState.ctx.font = "18px Arial";
        localState.ctx.textAlign = "center";
        localState.ctx.fillText(
          key,
          localState.ui.size.x / 2,
          localState.ui.size.y - padding
        );

        localState.drawImage = localState.canvas;
        console.debug("Image and text drawn for:", key);
      };
    },
    evaluate: (inputs) => {
      const value = inputs[0] ?? 0; // default to 0 if no input

      outputRefs.current[key].current = value; // set the value to the output ref
      return value; // return the value for the node
    },
  };
}

// // where refs are created
// activeKeys.forEach((name) => {
//     if (!OSCOutputRefs.current[name]) {
//       OSCOutputRefs.current[name] = { current: 1, last: 0, name }; //1 instead of zero to send a message on first render for debug / later 0.5, 0.5
//     }
//   });
