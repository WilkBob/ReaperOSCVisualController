class BaseNode {
  constructor(id, type, label) {
    this.id = id;
    this.type = type;
    this.label = label;
    this.inputs = [];
  }

  evaluate() {
    throw new Error("evaluate() must be implemented by subclass");
  }

  connectInput(node) {
    this.inputs.push(node);
  }
}

export default BaseNode;
