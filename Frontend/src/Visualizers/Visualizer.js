import NodeManager from "../NodeManager/NodeManager";
import BaseNode from "../NodeManager/NodeTypes/BaseNode";
import VisualNode from "./VisualNode";

class InteractiveVisualizer {
  constructor(canvas, mouseRef, outputRefs) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.mouseRef = mouseRef;
    this.outputRefs = outputRefs;
    this.nodeManager = new NodeManager(mouseRef, outputRefs);
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.visualNodes = [];
    this.selectedNode = null;
    this.isDragging = false;
    this.isResizing = false;
    this.isConnecting = false;
    this.connectionStartNode = null;
    this.connectionStartType = null;
    this.connectionStartIndex = null;
    this.time = 0;
    this.deltaTime = 0.16;
    this.rafID = null;
    this.tempConnectionPoint = null;
    this.lastTimestamp = null;

    this.resize();

    // Bind event handlers
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    // Add event listeners
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Create visual nodes
    this.createVisualNodes();
  }

  resize() {
    this.height = this.canvas.height = window.innerHeight;
    this.width = this.canvas.width = window.innerWidth;
    this.nodeManager.resize(); // Resize the node manage
    // Update all visual nodes and their base nodes
    this.visualNodes.forEach((node) => {
      // The visual node is now responsible for updating the base node
      node.resize(this.width, this.height);
    });
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

    // No need to initialize the node here as it will auto-initialize
    // during construction if BaseNode.globalState is set

    // Create visual node - it will handle updating the base node's localState
    const visualNode = new VisualNode(node, x, y);

    this.visualNodes.push(visualNode);
    this.nodeManager.nodes.push(node); // Add the node to the node manager
  }

  removeNode(node) {
    // Remove the node from the visual nodes array
    const index = this.visualNodes.indexOf(node);
    if (index > -1) {
      this.visualNodes.splice(index, 1);
      this.nodeManager.nodes.splice(
        this.nodeManager.nodes.indexOf(node.node),
        1
      ); // Remove from node manager
    }
    // Disconnect all inputs and outputs
    node.node.disconnectAllInputs(); // Disconnect all inputs
    node.node.outputNodes.forEach((outputNode) => {
      outputNode.disconnectInput(node.node); // Disconnect this node from all output nodes
    });
    node.node.outputNodes = []; // Clear output nodes
  }

  // Check for mouse over any node's handles and update the cursor appropriately
  updateCursorForHandles(mx, my) {
    let cursorUpdated = false;

    // Check all nodes in reverse order (top-most first)
    for (let i = this.visualNodes.length - 1; i >= 0; i--) {
      const node = this.visualNodes[i];

      // Check for hover over drag or resize handles
      if (node.isOverDragHandle(mx, my)) {
        document.body.style.cursor = "grab";
        cursorUpdated = true;
        break;
      } else if (node.isOverResizeHandle(mx, my)) {
        document.body.style.cursor = "nwse-resize";
        cursorUpdated = true;
        break;
      }
    }

    // Reset cursor if not over any handles
    if (!cursorUpdated && !this.isDragging && !this.isResizing) {
      document.body.style.cursor = "default";
    }

    return cursorUpdated;
  }

  handleMouseDown(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    // Reset selection if we're not clicking a handle
    let clickedHandle = false;

    // Check node interaction in reverse order (top-most first)
    for (let i = this.visualNodes.length - 1; i >= 0; i--) {
      const node = this.visualNodes[i];
      // First check if we're clicking on a handle
      if (node.isOverDragHandle(mx, my) || node.isOverResizeHandle(mx, my)) {
        clickedHandle = true;
      }
    }

    // Only reset selection if we didn't click a handle
    if (!clickedHandle) {
      // Use setSelected method to ensure base node state is updated
      this.visualNodes.forEach((node) => node.setSelected(false));
    }

    // Check for interaction with nodes (in reverse order for proper layering)
    for (let i = this.visualNodes.length - 1; i >= 0; i--) {
      const result = this.visualNodes[i].handleClick(mx, my);
      if (result) {
        this.selectedNode = this.visualNodes[i];

        if (result.type === "drag-handle") {
          this.isDragging = true;
          // Don't select the node when dragging by handle
          this.selectedNode.setSelected(false);
        } else if (result.type === "resize-handle") {
          this.isResizing = true;
          // Don't select the node when resizing by handle
          this.selectedNode.setSelected(false);
        } else if (result.type === "input" || result.type === "output") {
          this.isConnecting = true;
          this.connectionStartNode = result.node;
          this.connectionStartType = result.type;
          if (result.type === "input") {
            this.connectionStartIndex = result.index;
          }
        } else {
          // Regular node selection
          this.selectedNode.setSelected(true);
        }

        // Bring the selected node to the front
        this.visualNodes.splice(i, 1);
        this.visualNodes.push(this.selectedNode);
        break;
      }
    }
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    // Always update cursor for handles first
    this.updateCursorForHandles(mx, my);

    if (this.selectedNode) {
      // Let the selected node handle the mouse movement
      this.selectedNode.handleMouseMove(mx, my);

      // Store connection point for temporary connections
      if (this.isConnecting) {
        this.tempConnectionPoint = { x: mx, y: my };
      }
    }
  }

  handleMouseUp(event) {
    // Reset cursor
    document.body.style.cursor = "default";

    if (!this.selectedNode) {
      this.isDragging = false;
      this.isResizing = false;
      this.isConnecting = false;
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    // Let the node handle its own mouseup logic
    this.selectedNode.handleMouseUp();

    if (this.isConnecting) {
      // Check if we're over another node's port
      for (const targetNode of this.visualNodes) {
        if (targetNode === this.connectionStartNode) continue;

        if (this.connectionStartType === "output") {
          // We're dragging from an output, looking for an input
          const inputIndex = targetNode.getInputPortIndex(mx, my);
          if (inputIndex !== -1) {
            // Connect output -> input
            targetNode.node.connectInput(
              inputIndex,
              this.connectionStartNode.node
            );
          }
        } else if (this.connectionStartType === "input") {
          // We're dragging from an input, looking for an output
          if (targetNode.isOverOutputPort(mx, my)) {
            // Connect output -> input
            this.connectionStartNode.node.connectInput(
              this.connectionStartIndex,
              targetNode.node
            );
          }
        }
      }
    }

    // Reset all interaction states
    this.isDragging = false;
    this.isResizing = false;
    this.isConnecting = false;
    this.connectionStartNode = null;
    this.tempConnectionPoint = null;
    this.connectionStartType = null;
    this.connectionStartIndex = null;
  }

  handleKeyDown(event) {
    if (event.key === "Delete" && this.selectedNode) {
      // Delete the selected node
      this.removeNode(this.selectedNode);
      this.selectedNode = null; // Clear selection after deletion
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
    this.nodeManager.update(this.deltaTime); // Update the node manager with delta time

    // Draw connections between nodes
    this.drawConnections();

    // Draw temporary connection if connecting
    if (this.isConnecting && this.tempConnectionPoint) {
      this.drawTempConnection();
    }

    // Draw all nodes - VisualNode will handle its own drawing and state management
    this.visualNodes.forEach((node) => node.draw(this.ctx));

    this.time += this.deltaTime;
    this.rafID = requestAnimationFrame(this.animate.bind(this));
  }

  destroy() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID); // Cancel any ongoing animation frame
      this.rafID = null;
    }

    // Remove event listeners to prevent memory leaks
    if (this.canvas) {
      this.canvas.removeEventListener("mousedown", this.handleMouseDown);
      this.canvas.removeEventListener("mousemove", this.handleMouseMove);
      this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    }
    window.removeEventListener("keydown", this.handleKeyDown.bind(this));

    // Clean up node manager first
    if (this.nodeManager) {
      this.nodeManager.destroy();
      this.nodeManager = null;
    }

    // Clear visual nodes array
    this.visualNodes = [];

    // Clean up references
    this.canvas = null;
    this.ctx = null;
    this.mouseRef = null;
    this.outputRefs = null;
    this.selectedNode = null;
    this.isDragging = false;
    this.isResizing = false;
    this.isConnecting = false;
    this.connectionStartNode = null;
    this.connectionStartType = null;
    this.connectionStartIndex = null;
    this.tempConnectionPoint = null;
    this.lastTimestamp = null;
    this.time = null;
    this.deltaTime = null;
    this.width = null;
    this.height = null;
  }

  drawConnections() {
    this.ctx.strokeStyle = "#666666";
    this.ctx.lineWidth = 2;

    for (const visualNode of this.visualNodes) {
      const baseNode = visualNode.node;

      baseNode.inputs.forEach((input, index) => {
        if (input instanceof BaseNode) {
          // Find the visual node that corresponds to this input
          const sourceVisualNode = this.visualNodes.find(
            (vn) => vn.node === input
          );
          if (sourceVisualNode) {
            const start = sourceVisualNode.getOutputPortPosition();
            const end = visualNode.getInputPortPosition(index);

            this.drawBezierConnection(start.x, start.y, end.x, end.y);
          }
        }
      });
    }
  }

  drawTempConnection() {
    if (!this.connectionStartNode || !this.tempConnectionPoint) return;

    let start;
    if (this.connectionStartType === "output") {
      start = this.connectionStartNode.getOutputPortPosition();
    } else {
      start = this.connectionStartNode.getInputPortPosition(
        this.connectionStartIndex
      );
    }

    this.ctx.strokeStyle = "#999999";
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([5, 3]);
    this.drawBezierConnection(
      start.x,
      start.y,
      this.tempConnectionPoint.x,
      this.tempConnectionPoint.y
    );
    this.ctx.setLineDash([]);
  }

  drawBezierConnection(x1, y1, x2, y2) {
    const deltaY = y2 - y1;
    const bezierHeight = Math.min(Math.abs(deltaY), 100);
    const sign = deltaY >= 0 ? 1 : -1;

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.bezierCurveTo(
      x1,
      y1 + bezierHeight * sign,
      x2,
      y2 - bezierHeight * sign,
      x2,
      y2
    );
    this.ctx.stroke();
  }
}
export default InteractiveVisualizer;
