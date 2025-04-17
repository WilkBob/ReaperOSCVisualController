import { makeBlueprint } from "../BaseNode";

const Average = makeBlueprint({
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

export default Average;
