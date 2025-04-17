import { makeBlueprint } from "../BaseNode";

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

export default MinMax;
