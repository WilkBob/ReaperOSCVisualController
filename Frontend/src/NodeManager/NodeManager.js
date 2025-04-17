import { createNode } from "./NodeTypes/BaseNode";
import BaseNode from "./NodeTypes/BaseNode";
import createOSCBlueprint from "./NodeTypes/Outputs/OSCNode";
import makeSimBlueprint from "./NodeTypes/Space/SpaceNodes";
class NodeManager {
  constructor(mouseRef, outputRefs, simVariables) {
    this.mouseRef = mouseRef;
    this.outputRefs = outputRefs;
    this.simVariables = simVariables; // Store simulation variables
    this.nodes = [];
    this.globalState = {
      time: 0,
      deltaTime: 0,
      cycleId: 0,
      mouse: {
        x: this.mouseRef.current.x,
        y: this.mouseRef.current.y,
        isDown: this.mouseRef.current.isDown,
      },
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    // Set the global state reference in BaseNode
    BaseNode.globalState = this.globalState;

    this.createSimNodes(); //initialize simulation nodes

    this.createOSCNodes(); //initialize OSC nodes
  }

  // Create OSC nodes based on the keys in outputRefs

  createOSCNodes() {
    const oscKeys = Object.keys(this.outputRefs.current);
    oscKeys.forEach((key) => {
      const node = createNode(key, createOSCBlueprint(this.outputRefs, key));
      this.nodes.push(node);
    });
  }

  createSimNodes() {
    // (property) SpaceControls.simVariables: {
    //   sunSize: {
    //       value: number;
    //       controlled: boolean;
    //       label: string;
    //       defaultValue: number;
    //       type: string;
    //       description: string;
    //   };

    Object.keys(this.simVariables).forEach((key) => {
      const node = createNode(key, makeSimBlueprint(this.simVariables, key));
      this.nodes.push(node);
    });
  }

  update(delta) {
    // Update mouse state
    this.globalState.mouse.x = this.mouseRef.current.x;
    this.globalState.mouse.y = this.mouseRef.current.y;
    this.globalState.mouse.isDown = this.mouseRef.current.isDown;
    this.globalState.time += delta;
    this.globalState.deltaTime = delta;
    this.globalState.cycleId += 1; // Increment cycle ID for caching
    this.nodes.forEach((node) => {
      node.update();
    });
  }

  resize() {
    this.globalState.screenSize.width = window.innerWidth;
    this.globalState.screenSize.height = window.innerHeight;
  }

  destroy() {
    this.nodes.forEach((node) => {
      node.destroy(); // Call destroy on each node
    });
    this.nodes = []; // Clear the nodes array
    this.globalState = null; // Clear the global state
    // Clear references to mouse and output refs
    this.mouseRef = null;
    this.outputRefs = null;
  }
}

export default NodeManager;
