import BaseNode from "./BaseNode";

class MouseNode extends BaseNode {
  constructor(id, label, refKey, mouseRef) {
    super(id, "input", label);
    this.refKey = refKey;
    this.mouseRef = mouseRef;
  }

  evaluate() {
    return this.mouseRef.current[this.refKey]; // normalized
  }
}

export default MouseNode;
