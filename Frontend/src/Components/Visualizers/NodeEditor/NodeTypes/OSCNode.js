import BaseNode from "./BaseNode";
//current[name] = { current, last, name } for each parameter -do not update last value here, only in the broadcast loop
class OSCNode extends BaseNode {
  constructor(id, label, outputRef, name) {
    super(id, "output", label);
    this.outputRef = outputRef;
    this.name = name;
  }

  evaluate() {
    const inputVal = this.inputs[0]?.evaluate?.() ?? 0;
    this.outputRef.current[this.name].current = inputVal; // normalized
    return inputVal;
  }
}

export default OSCNode;
