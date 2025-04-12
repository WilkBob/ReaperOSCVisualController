import { createNode } from "./NodeTypes/BaseNode";
import createMouseBlueprint from "./NodeTypes/MouseNode";
import createOSCBlueprint from "./NodeTypes/OSCNode";
import { Avg } from "./NodeTypes/MathNodes";
import GlobalState from "./GlobalState";

class NodeManager {
  constructor(mouseRef, outputRefs) {
    this.mouseRef = mouseRef;
    this.outputRefs = outputRefs;

    this.nodes = [];
    this.globalState = new GlobalState(); // Use the GlobalState class

    this.createMouseNodes(); //initialize mouse control
    this.createOSCNodes(); //initialize OSC nodes
  }
  // Create mouse nodes based on the keys in mouseRef

  createMouseNodes() {
    const mouseKeys = Object.keys(this.mouseRef.current);
    mouseKeys.forEach((key) => {
      const node = createNode(
        key,
        createMouseBlueprint(this.mouseRef, key, key)
      );
      this.nodes.push(node);
    });
  }

  // Create OSC nodes based on the keys in outputRefs

  createOSCNodes() {
    const oscKeys = Object.keys(this.outputRefs.current);
    oscKeys.forEach((key) => {
      const node = createNode(key, createOSCBlueprint(this.outputRefs, key));
      this.nodes.push(node);
    });
  }

  update(delta) {
    this.globalState.updateTime(delta); // Update time and deltaTime in global state
    this.nodes.forEach((node) => {
      node.update(this.globalState.state); // Pass the global state object to nodes
    });
    this.nodes.forEach((node) => {
      if (node.type === "output") {
        node.evaluate(this.globalState.state);
      }
    });
  }

  destroy() {
    this.mouseRef = null;
    this.outputRefs = null;
  }
}

export default NodeManager;
