class VisualNode {
  constructor(node, x = 0, y = 0) {
    this.node = node;
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 200;
    this.inputDefs = node.inputDefs || [];
    this.outputDef = node.outputDef || null;

    this.selected = false;
    this.isDragging = false;
    this.isConnecting = false;
    this.connectingFrom = null;
    this.syncWithBaseNode();
  }

  containsPoint(px, py) {
    return (
      px >= this.x &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.height
    );
  }

  syncWithBaseNode() {
    const uiState = this.node.localState.ui;
    this.x = uiState.position.x;
    this.y = uiState.position.y;
    this.width = uiState.size.x;
    this.height = uiState.size.y;

    // Update BaseNode with current visual position
    this.updateBaseNodePosition();
  }

  updateBaseNodePosition() {
    this.node.localState.ui.position.x = this.x;
    this.node.localState.ui.position.y = this.y;
    this.node.localState.ui.size.x = this.width;
    this.node.localState.ui.size.y = this.height;
  }

  draw(ctx, globalState) {
    // Update dimensions from underlying node's localState if changed
    const uiState = this.node.localState.ui;
    if (uiState.position.x !== this.x || uiState.position.y !== this.y) {
      this.x = uiState.position.x;
      this.y = uiState.position.y;
    }
    if (uiState.size.x !== this.width || uiState.size.y !== this.height) {
      this.width = uiState.size.x;
      this.height = uiState.size.y;
    }

    // Draw node background
    ctx.fillStyle = this.selected ? "#ffffff55" : "#ffffff35"; // Light gray with transparency
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    // Draw rounded rectangle for node body
    this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 8);

    // Draw custom image if available
    if (this.node.localState.drawImage) {
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
    } else {
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

    // Draw input ports
    this.drawInputs(ctx);

    // Draw output port
    this.drawOutput(ctx, globalState);
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

  drawOutput(ctx, globalState) {
    if (!this.outputDef) return;

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
      this.outputDef.label + " " + this.node.evaluate(globalState).toFixed(2),
      xPos,
      yPos + 15
    );
  }
  handleClick(mx, my) {
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

    // Regular node selection
    this.selected = true;
    this.isDragging = true;
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

  // Add method to determine if we're over the output port
  isOverOutputPort(mx, my) {
    if (!this.outputDef) return false;

    const xPos = this.x + this.width / 2;
    const yPos = this.y + this.height;
    const portRadius = 5;

    const dist = Math.sqrt(Math.pow(mx - xPos, 2) + Math.pow(my - yPos, 2));
    return dist <= portRadius;
  }

  // Add methods for handling mouse movement and release
  handleMouseMove(mx, my) {
    if (this.isDragging && !this.isConnecting) {
      this.x = mx - this.width / 2;
      this.y = my - this.height / 2;
      this.updateBaseNodePosition();
      return true;
    }
    return false;
  }

  handleMouseUp() {
    this.isDragging = false;
    return this.isConnecting
      ? { connecting: this.isConnecting, from: this.connectingFrom, node: this }
      : false;
  }

  // Helper method to get output port position (for drawing connections)
  getOutputPortPosition() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height,
    };
  }

  // Helper method to get input port position
  getInputPortPosition(index) {
    const spacing = this.width / (this.inputDefs.length + 1);
    return {
      x: this.x + spacing * (index + 1),
      y: this.y,
    };
  }
}

export default VisualNode;
