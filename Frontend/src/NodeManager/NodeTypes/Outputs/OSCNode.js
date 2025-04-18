import { makeBlueprint } from "../BaseNode";
import { sendMessage } from "../../../API/oscService";

export default function createOSCBlueprint(ParameterID) {
  return makeBlueprint({
    type: "output",
    label: ParameterID,
    inputDefs: [],
    outputDef: { name: "Value", label: ParameterID },
    update: (inputs, globalState) => {
      const parameter = globalState.osc.parameters[ParameterID];
      if (!parameter) {
        console.error(`Parameter ${ParameterID} not found in globalState`);
        return;
      }
    },
    evaluate: (inputs, globalState) => {
      const parameter = globalState.osc.parameters[ParameterID];
      if (!parameter) {
        console.error(`Parameter ${ParameterID} not found in globalState`);
        return 0.42;
      }

      // Update the current value based on inputs or default to 0.42
      const newValue = inputs[0] ?? 0.42;
      parameter.value.current = newValue;

      // Only send a message if broadcasting is enabled and the value has changed
      if (
        globalState.osc.broadcasting &&
        parameter.value.current !== parameter.value.last
      ) {
        sendMessage(parameter.address, parameter.value.current);
        parameter.value.last = parameter.value.current; // Update the last value
      }

      return parameter.value.current; // Return the current value
    },
  });
}
