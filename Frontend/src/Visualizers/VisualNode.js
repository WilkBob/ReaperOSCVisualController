class VisualNode {
  constructor(node, x = 0, y = 0) {
    this.node = node;

    this.width = 200;
    this.height = 200;
    //if node has localstate.ui and x and y are not zero, use them
    if (
      node.localState?.ui &&
      node.localState.ui.position.x !== 0 &&
      node.localState.ui.position.y !== 0
    ) {
      this.x = node.localState.ui.position.x;
      this.y = node.localState.ui.position.y;
    } else {
      this.x = x;
      this.y = y;
    }

    this.inputDefs = node.inputDefs || [];
    this.outputDef = node.outputDef || null;

    this.selected = false;
    this.isDragging = false;
    this.isResizing = false;
    this.isConnecting = false;
    this.connectingFrom = null;

    // Drag and resize handle dimensions
    this.handleSize = 12;

    // Read values from the node's local state for SIZE ONLY
    this.width = this.node.localState.ui.width;
    this.height = this.node.localState.ui.height;

    // Update BaseNode's localState with initial values
    this.updateBaseNodeState();
  }

  // Update BaseNode's localState with current position and size
  updateBaseNodeState() {
    if (this.node.localState?.ui) {
      this.node.localState.ui.position.x = this.x;
      this.node.localState.ui.position.y = this.y;
      this.node.localState.ui.width = this.width;
      this.node.localState.ui.height = this.height;
      // Sync selection state
      this.node.localState.ui.selected = this.selected;
    }
  }

  // Mark node as selected and update base node state
  setSelected(isSelected) {
    if (this.selected !== isSelected) {
      this.selected = isSelected;
      this.updateBaseNodeState();
    }
  }

  containsPoint(px, py) {
    return (
      px >= this.x &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.height
    );
  }

  // Check if point is over drag handle (top-right corner)
  isOverDragHandle(px, py) {
    return (
      px >= this.x + this.width - this.handleSize &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.handleSize
    );
  }

  // Check if point is over resize handle (bottom-right corner)
  isOverResizeHandle(px, py) {
    return (
      px >= this.x + this.width - this.handleSize &&
      px <= this.x + this.width &&
      py >= this.y + this.height - this.handleSize &&
      py <= this.y + this.height
    );
  }

  syncWithBaseNode() {
    // Always update BaseNode with current visual properties
    this.updateBaseNodeState();
  }

  draw(ctx) {
    // Only sync position from underlying node's localState if changed
    const uiState = this.node.localState.ui;
    if (uiState.position.x !== this.x || uiState.position.y !== this.y) {
      this.x = uiState.position.x;
      this.y = uiState.position.y;
    }

    // Draw basic node elements
    this.drawNodeBackground(ctx);

    // Draw custom image if available, otherwise draw default content
    if (this.node.localState.drawImage) {
      this.drawCustomImage(ctx);
    } else {
      this.drawDefaultNodeContent(ctx);
    }

    // Draw input and output ports
    this.drawInputs(ctx);
    this.drawOutput(ctx);

    // Draw drag handle in top-right corner
    this.drawDragHandle(ctx);

    // Draw resize handle in bottom-right corner
    this.drawResizeHandle(ctx);
  }

  drawNodeBackground(ctx) {
    // Draw node background
    ctx.fillStyle = this.selected ? "#ffffff55" : "#ffffff35"; // Light gray with transparency
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    // Draw rounded rectangle for node body
    this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 8);
  }

  drawCustomImage(ctx) {
    try {
      ctx.drawImage(
        this.node.localState.drawImage,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } catch (e) {
      console.warn("Error drawing node image:", e);
    }
  }

  drawDefaultNodeContent(ctx) {
    // Draw node label
    ctx.fillStyle = "#fff";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      this.node.label || this.node.type,
      this.x + this.width / 2,
      this.y + 20
    );
  }

  drawDragHandle(ctx) {
    // Draw drag handle in top-right corner
    ctx.fillStyle = "#777";
    ctx.beginPath();
    ctx.moveTo(this.x + this.width, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.handleSize);
    ctx.lineTo(this.x + this.width - this.handleSize, this.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawResizeHandle(ctx) {
    // Draw resize handle in bottom-right corner
    ctx.fillStyle = "#777";
    ctx.beginPath();
    ctx.moveTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y + this.height - this.handleSize);
    ctx.lineTo(this.x + this.width - this.handleSize, this.y + this.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawInputs(ctx) {
    const inputCount = this.inputDefs.length;
    const spacing = this.width / (inputCount + 1);

    for (let i = 0; i < inputCount; i++) {
      const xPos = this.x + spacing * (i + 1);
      const yPos = this.y;

      // Draw port
      ctx.fillStyle = this.node.inputs[i] ? "#00ff00" : "#ff0000";
      ctx.beginPath();
      ctx.arc(xPos, yPos, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw label
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(this.inputDefs[i].name, xPos, yPos - 8);
    }
  }

  drawOutput(ctx) {
    if (!this.outputDef) {
      this.node.evaluate(); // Ensure output is evaluated even if not drawn
      return;
    }
    const xPos = this.x + this.width / 2;
    const yPos = this.y + this.height;

    // Draw port
    ctx.fillStyle = "#0000ff";
    ctx.beginPath();
    ctx.arc(xPos, yPos, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw label
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      this.outputDef.label + " " + this.node.evaluate().toFixed(2),
      xPos,
      yPos + 15
    );
  }

  handleClick(mx, my) {
    // Check if clicking on drag handle (top-right corner)
    if (this.isOverDragHandle(mx, my)) {
      document.body.style.cursor = "grabbing";
      this.isDragging = true;
      return { type: "drag-handle", node: this };
    }

    // Check if clicking on resize handle (bottom-right corner)
    if (this.isOverResizeHandle(mx, my)) {
      document.body.style.cursor = "nwse-resize";
      this.isResizing = true;
      return { type: "resize-handle", node: this };
    }

    if (!this.containsPoint(mx, my)) return false;

    // Check if clicking on an input port
    const inputIndex = this.getInputPortIndex(mx, my);
    if (inputIndex !== -1) {
      this.isConnecting = true;
      this.connectingFrom = inputIndex;
      return { type: "input", index: inputIndex, node: this };
    }

    // Check if clicking on output port
    if (this.isOverOutputPort(mx, my)) {
      this.isConnecting = true;
      this.connectingFrom = "output";
      return { type: "output", node: this };
    }

    // Regular node selection - use the setter to ensure base node is updated
    this.setSelected(true);
    return { type: "node", node: this };
  }

  getInputPortIndex(mx, my) {
    const inputCount = this.inputDefs.length;
    const spacing = this.width / (inputCount + 1);
    const portRadius = 5;

    for (let i = 0; i < inputCount; i++) {
      const xPos = this.x + spacing * (i + 1);
      const yPos = this.y;

      const dist = Math.sqrt(Math.pow(mx - xPos, 2) + Math.pow(my - yPos, 2));
      if (dist <= portRadius) {
        return i;
      }
    }

    return -1;
  }

  isOverOutputPort(mx, my) {
    if (!this.outputDef) return false;

    const xPos = this.x + this.width / 2;
    const yPos = this.y + this.height;
    const portRadius = 5;

    const dist = Math.sqrt(Math.pow(mx - xPos, 2) + Math.pow(my - yPos, 2));
    return dist <= portRadius;
  }

  handleMouseMove(mx, my) {
    // Change cursor based on what we're hovering over
    if (this.isOverDragHandle(mx, my)) {
      document.body.style.cursor = "grab";
      return true;
    } else if (this.isOverResizeHandle(mx, my)) {
      document.body.style.cursor = "nwse-resize";
      return true;
    } else if (this.containsPoint(mx, my)) {
      document.body.style.cursor = "default";
    }

    // Handle dragging by drag handle
    if (this.isDragging) {
      document.body.style.cursor = "grabbing";
      this.x = mx - this.width;
      this.y = my;
      this.updateBaseNodeState();
      return true;
    }

    // Handle resizing by resize handle
    if (this.isResizing) {
      document.body.style.cursor = "nwse-resize";
      const minWidth = 100;
      const minHeight = 100;
      this.width = Math.max(minWidth, mx - this.x);
      this.height = Math.max(minHeight, my - this.y);
      this.updateBaseNodeState();
      return true;
    }

    return false;
  }

  handleMouseUp() {
    // Reset cursor to default
    document.body.style.cursor = "default";

    // Store previous states
    const wasDragging = this.isDragging;
    const wasResizing = this.isResizing;

    // Reset states
    this.isDragging = false;
    this.isResizing = false;

    // Return connection info if we were connecting
    if (this.isConnecting) {
      const result = {
        connecting: this.isConnecting,
        from: this.connectingFrom,
        node: this,
      };
      this.isConnecting = false;
      return result;
    }

    // Return true if we just finished dragging or resizing
    return wasDragging || wasResizing;
  }

  getOutputPortPosition() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height,
    };
  }

  getInputPortPosition(index) {
    const spacing = this.width / (this.inputDefs.length + 1);
    return {
      x: this.x + spacing * (index + 1),
      y: this.y,
    };
  }

  getDragHandlePosition() {
    return {
      x: this.x + this.width - this.handleSize / 2,
      y: this.y + this.handleSize / 2,
    };
  }

  getResizeHandlePosition() {
    return {
      x: this.x + this.width - this.handleSize / 2,
      y: this.y + this.height - this.handleSize / 2,
    };
  }

  resize(width, height) {
    const minWidth = 100;
    const minHeight = 100;

    this.width = Math.max(minWidth, width);
    this.height = Math.max(minHeight, height);

    // Update the BaseNode's localState after resizing
    this.updateBaseNodeState();
  }
}

export default VisualNode;
