import { createNode } from "./NodeTypes/BaseNode";
import createMouseBlueprint from "./NodeTypes/MouseNode";
import createOSCBlueprint from "./NodeTypes/OSCNode";
import { SinOscillator } from "./NodeTypes/MathNodes";
import GamePadAxisNode from "./NodeTypes/GamePadNode";

class NodeManager {
  constructor(mouseRef, outputRefs) {
    this.mouseRef = mouseRef;
    this.outputRefs = outputRefs;

    this.nodes = [];
    this.globalState = {
      time: 0,
      deltaTime: 0,
      cycleId: 0,
    };

    this.createMouseNodes(); //initialize mouse control
    this.createOSCNodes(); //initialize OSC nodes
    this.nodes.push(createNode("gamepad", GamePadAxisNode));
    this.nodes.push(createNode("sinOscillator", SinOscillator));
    this.nodes.forEach((node) => {
      node.init(this.globalState); // Initialize each node with the global state
    }); // Connect the second mouse node to the first OSC node
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
    this.globalState.time += delta;
    this.globalState.deltaTime = delta;
    this.globalState.cycleId += 1; // Increment cycle ID for caching
    this.nodes.forEach((node) => {
      node.update(this.globalState); // Pass the global state object to nodes
    });
  }

  destroy() {
    this.mouseRef = null;
    this.outputRefs = null;
  }
}

export default NodeManager;
