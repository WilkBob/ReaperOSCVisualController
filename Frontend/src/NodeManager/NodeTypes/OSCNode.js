export default function createOSCBlueprint(outputRefs, key) {
  return {
    type: "output",
    label: key,
    inputDefs: [{ name: "Value", defaultValue: 0 }],
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
