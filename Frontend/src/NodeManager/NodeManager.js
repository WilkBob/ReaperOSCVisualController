import BaseNode from "./NodeTypes/BaseNode";
import { spaceControls } from "../Visualizers/Space/Space"; // Import spaceControls

class NodeManager {
  constructor() {
    this.nodes = [];
    this.globalState = {
      time: 0,
      deltaTime: 0,
      cycleId: 0,
      mouse: {
        x: 0,
        y: 0,
        isDown: false,
        click: false, // Added click state
        wheel: 0, // Added wheel state
      },
      osc: { isBroadcasting: false, outputRefs: null },
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      space: spaceControls, // Add reference to spaceControls singleton
    };

    // Set the global state reference in BaseNode
    BaseNode.globalState = this.globalState;
    console.log("NodeManager initialized with global state:", this.globalState);
  }

  update(delta, mouseRef) {
    //Update globalstate for all nodes - avoid replacing globalstate object reference, as nodes may reference it

    this.globalState.mouse.x = mouseRef.current.x;
    this.globalState.mouse.y = mouseRef.current.y;
    this.globalState.mouse.isDown = mouseRef.current.isDown;
    this.globalState.mouse.click = mouseRef.current.click; // Update click
    this.globalState.mouse.wheel = mouseRef.current.wheel; // Update wheel
    this.globalState.time += delta;
    this.globalState.deltaTime = delta;
    this.globalState.cycleId += 1; // Increment cycle ID for caching

    // Update space controls if it exists in global state
    if (
      this.globalState.space &&
      typeof this.globalState.space.update === "function"
    ) {
      this.globalState.space.update();
    }

    this.nodes.forEach((node) => {
      node.update();
    });
  }

  resize(width, height) {
    this.globalState.screenSize.width = width;
    this.globalState.screenSize.height = height;
    // Also notify space controls if it exists
    if (
      this.globalState.space &&
      typeof this.globalState.space.onResize === "function"
    ) {
      this.globalState.space.onResize();
    }
  }

  destroy() {
    this.nodes.forEach((node) => {
      node.destroy(); // Call destroy on each node
    });
    this.nodes = []; // Clear the nodes array
    // Clear references to mouse and output refs
    // Keep space reference as it's a singleton
    this.mouseRef = null;
    // Don't nullify globalState.space
  }
}

const nodeManager = new NodeManager();
export default nodeManager;
