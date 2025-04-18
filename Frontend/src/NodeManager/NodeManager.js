import BaseNode from "./NodeTypes/BaseNode";

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
      },
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
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
    this.globalState.mouse.click = mouseRef.current.click;
    this.globalState.mouse.wheel = mouseRef.current.wheel;
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
    // Clear references to mouse and output refs
    this.mouseRef = null;
    this.outputRefs = null;
  }
}

const nodeManager = new NodeManager();
export default nodeManager;
