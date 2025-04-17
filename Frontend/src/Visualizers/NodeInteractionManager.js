/**
 * Manages interactions with visual nodes (dragging, resizing, selection)
 */
class NodeInteractionManager {
  constructor() {
    this.selectedNode = null;
    this.isDragging = false;
    this.isResizing = false;
  }

  // Check for mouse over any node's handles and update the cursor appropriately
  updateCursorForHandles(visualNodes, mx, my) {
    let cursorUpdated = false;

    // Check all nodes in reverse order (top-most first)
    for (let i = visualNodes.length - 1; i >= 0; i--) {
      const node = visualNodes[i];

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

  resetCursor() {
    document.body.style.cursor = "default";
  }

  handleNodeSelection(visualNodes, mx, my, connectionManager) {
    // Reset selection if we're not clicking a handle
    let clickedHandle = false;

    // Check node interaction in reverse order (top-most first)
    for (let i = visualNodes.length - 1; i >= 0; i--) {
      const node = visualNodes[i];
      // First check if we're clicking on a handle
      if (node.isOverDragHandle(mx, my) || node.isOverResizeHandle(mx, my)) {
        clickedHandle = true;
      }
    }

    // Only reset selection if we didn't click a handle
    if (!clickedHandle) {
      // Use setSelected method to ensure base node state is updated
      visualNodes.forEach((node) => node.setSelected(false));
    }

    // Check for interaction with nodes (in reverse order for proper layering)
    for (let i = visualNodes.length - 1; i >= 0; i--) {
      const result = visualNodes[i].handleClick(mx, my);
      if (result) {
        this.selectedNode = visualNodes[i];

        if (result.type === "drag-handle") {
          this.isDragging = true;
          // Don't select the node when dragging by handle
          this.selectedNode.setSelected(false);
        } else if (result.type === "resize-handle") {
          this.isResizing = true;
          // Don't select the node when resizing by handle
          this.selectedNode.setSelected(false);
        } else if (result.type === "input" || result.type === "output") {
          connectionManager.startConnection(
            result.node,
            result.type,
            result.type === "input" ? result.index : null
          );
        } else {
          // Regular node selection
          this.selectedNode.setSelected(true);
        }

        // Bring the selected node to the front
        visualNodes.splice(i, 1);
        visualNodes.push(this.selectedNode);
        return true;
      }
    }

    return false;
  }

  handleMouseMove(mx, my, connectionManager) {
    if (this.selectedNode) {
      // Let the selected node handle the mouse movement
      this.selectedNode.handleMouseMove(mx, my);

      // Update connection point for temporary connections
      if (connectionManager.isConnecting) {
        connectionManager.updateTempConnection(mx, my);
      }
      return true;
    }
    return false;
  }

  handleMouseUp(visualNodes, mx, my, connectionManager) {
    if (!this.selectedNode) {
      this.reset();
      connectionManager.reset();
      return;
    }

    // Let the node handle its own mouseup logic
    this.selectedNode.handleMouseUp();

    if (connectionManager.isConnecting) {
      // Check if we're over another node's port
      for (const targetNode of visualNodes) {
        if (connectionManager.completeConnection(targetNode, mx, my)) {
          break;
        }
      }
    }

    // Reset all interaction states
    this.reset();
    connectionManager.reset();
  }

  reset() {
    this.isDragging = false;
    this.isResizing = false;
  }

  deleteSelectedNode(visualNodes, nodeManager) {
    if (!this.selectedNode) return null;

    const nodeToRemove = this.selectedNode;

    // Remove the node from the visual nodes array
    const index = visualNodes.indexOf(nodeToRemove);
    if (index > -1) {
      visualNodes.splice(index, 1);
      nodeManager.nodes.splice(nodeManager.nodes.indexOf(nodeToRemove.node), 1); // Remove from node manager
    }

    // Disconnect all inputs and outputs
    nodeToRemove.node.disconnectAllInputs(); // Disconnect all inputs
    nodeToRemove.node.outputNodes.forEach((outputNode) => {
      outputNode.disconnectInput(nodeToRemove.node); // Disconnect this node from all output nodes
    });
    nodeToRemove.node.outputNodes = []; // Clear output nodes

    const removed = this.selectedNode;
    this.selectedNode = null; // Clear selection after deletion
    return removed;
  }
}

export default NodeInteractionManager;
