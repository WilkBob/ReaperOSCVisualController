import MouseNode from "./NodeTypes/MouseNode";
import OSCNode from "./NodeTypes/OSCNode";
class NodeEditor {
  constructor(mouseRef, outputRefs) {
    this.mouseRef = mouseRef; //current.{x (normalized), y (normalized), click, wheel} all 0-1
    this.outputRefs = outputRefs; //current[name] = { current, last, name } for each parameter -do not update last value here, only in the broadcast loop

    this.inputNodes = {
      mouseX: new MouseNode("mouseX", "Mouse X", "x", this.mouseRef),
      mouseY: new MouseNode("mouseY", "Mouse Y", "y", this.mouseRef),
      click: new MouseNode("click", "Click", "click", this.mouseRef),
      wheel: new MouseNode("wheel", "Wheel", "wheel", this.mouseRef),
    };

    this.OSCNodes = Object.keys(this.outputRefs.current).reduce((acc, key) => {
      const node = new OSCNode(key, key, this.outputRefs, key);
      acc[key] = node;
      return acc;
    }, {});

    console.log(
      "NodeEditor initialized with input nodes:",
      this.inputNodes,
      "and OSC nodes:",
      this.OSCNodes
    );
  }

  destroy() {
    this.canvas = null;
    this.ctx = null;
    this.mouseRef = null;
    this.outputRefs = null;
  }
}

export default NodeEditor;
