import SpaceControls from "./Space/Space";
import VisualNode from "./VisualNode";
import ConnectionManager from "./ConnectionManager";
import NodeInteractionManager from "./NodeInteractionManager";

class NodeVisualizer {
  constructor(canvas, mouseRef, nodeManager) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.mouseRef = mouseRef;

    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.visualNodes = [];
    this.time = 0;
    this.deltaTime = 0.16;
    this.rafID = null;
    this.lastTimestamp = null;

    // Initialize extracted managers
    this.connectionManager = new ConnectionManager(this.ctx);
    this.interactionManager = new NodeInteractionManager();

    this.space = new SpaceControls(this.ctx);
    this.nodeManager = nodeManager.current;
    console.log("NodeManager initialized:", this.nodeManager);
    this.resize();

    // Bind event handlers
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    // Add event listeners
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("keydown", this.handleKeyDown);

    // Create visual nodes
    this.createVisualNodes();
  }

  resize() {
    this.height = this.canvas.height = window.innerHeight;
    this.width = this.canvas.width = window.innerWidth;
    this.nodeManager.resize(); // Resize the node manager

    // Update all visual nodes and their base nodes
    this.visualNodes.forEach((node) => {
      node.resize(this.width, this.height);
    });

    this.space.onResize(); // Resize the space controls
  }

  createVisualNodes() {
    // Map each node from nodeManager to a VisualNode
    this.nodeManager.nodes.forEach((node, index) => {
      // Create visual nodes with staggered positions
      const x = 100 + (index % 3) * 250;
      const y = 100 + Math.floor(index / 3) * 250;

      // Create a VisualNode - it will initialize its own properties from the base node if available
      const visualNode = new VisualNode(node, x, y);
      this.visualNodes.push(visualNode);
    });
  }

  addNode(node) {
    console.debug("Adding node:", node);
    const x = 100 + (this.visualNodes.length % 3) * 250;
    const y = 100 + Math.floor(this.visualNodes.length / 3) * 250;

    // Create visual node
    const visualNode = new VisualNode(node, x, y);

    this.visualNodes.push(visualNode);
    this.nodeManager.nodes.push(node); // Add the node to the node manager
  }

  removeNode(node) {
    const index = this.visualNodes.indexOf(node);
    if (index > -1) {
      this.visualNodes.splice(index, 1);
      this.nodeManager.nodes.splice(
        this.nodeManager.nodes.indexOf(node.node),
        1
      );
    }

    // Disconnect all inputs and outputs
    node.node.disconnectAllInputs();
    node.node.outputNodes.forEach((outputNode) => {
      outputNode.disconnectInput(node.node);
    });
    node.node.outputNodes = [];
  }

  handleMouseDown(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    // Use the interaction manager to handle node selection
    this.interactionManager.handleNodeSelection(
      this.visualNodes,
      mx,
      my,
      this.connectionManager
    );
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    // Update cursor for handles
    this.interactionManager.updateCursorForHandles(this.visualNodes, mx, my);

    // Use the interaction manager to handle mouse movement
    this.interactionManager.handleMouseMove(mx, my, this.connectionManager);
  }

  handleMouseUp(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    // Use the interaction manager to handle mouse up
    this.interactionManager.handleMouseUp(
      this.visualNodes,
      mx,
      my,
      this.connectionManager
    );
  }

  handleKeyDown(event) {
    if (event.key === "Delete") {
      this.interactionManager.deleteSelectedNode(
        this.visualNodes,
        this.nodeManager
      );
    }
  }

  animate(timestamp) {
    if (!this.ctx) return; // Ensure ctx is not null before proceeding

    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }

    this.deltaTime = (timestamp - this.lastTimestamp) / 1000; // Convert to seconds
    this.lastTimestamp = timestamp;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.space.update();
    this.space.draw(); // Draw the space controls
    this.nodeManager.update(this.deltaTime, this.mouseRef); // Update the node manager with delta time

    // Draw connections between nodes
    this.connectionManager.drawConnections(this.visualNodes);

    // Draw temporary connection if connecting
    if (
      this.connectionManager.isConnecting &&
      this.connectionManager.tempConnectionPoint
    ) {
      this.connectionManager.drawTempConnection();
    }

    // Draw all nodes
    this.visualNodes.forEach((node) => node.draw(this.ctx));

    this.time += this.deltaTime;
    this.rafID = requestAnimationFrame(this.animate.bind(this));
  }

  destroy() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
      this.rafID = null;
    }
    this.nodeManager.destroy(); // Destroy the node manager

    this.nodeManager = null; // Clear the node manager reference

    // Remove event listeners to prevent memory leaks
    if (this.canvas) {
      this.canvas.removeEventListener("mousedown", this.handleMouseDown);
      this.canvas.removeEventListener("mousemove", this.handleMouseMove);
      this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    }
    window.removeEventListener("keydown", this.handleKeyDown);

    this.resize = null; // Clear the resize method reference
    this.animate = null; // Clear the animate method reference

    // Clear visual nodes array
    this.visualNodes = [];

    // Clean up references
    this.canvas = null;
    this.ctx = null;
    this.mouseRef = null;
    this.outputRefs = null;
    this.lastTimestamp = null;
    this.time = null;
    this.deltaTime = null;
    this.width = null;
    this.height = null;
    this.connectionManager = null;
    this.interactionManager = null;
  }
}

export default NodeVisualizer;
