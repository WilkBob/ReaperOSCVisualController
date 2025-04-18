import BaseNode from "../NodeManager/NodeTypes/BaseNode";

/**
 * Manages connections between visual nodes
 */
class ConnectionManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.isConnecting = false;
    this.connectionStartNode = null;
    this.connectionStartType = null;
    this.connectionStartIndex = null;
    this.tempConnectionPoint = null;
  }

  startConnection(node, type, index = null) {
    this.isConnecting = true;
    this.connectionStartNode = node;
    this.connectionStartType = type;
    this.connectionStartIndex = index;
  }

  updateTempConnection(x, y) {
    if (this.isConnecting) {
      this.tempConnectionPoint = { x, y };
    }
  }

  completeConnection(targetNode, mx, my) {
    if (!this.isConnecting || !this.connectionStartNode) return false;

    if (targetNode === this.connectionStartNode) return false;

    let connected = false;
    if (this.connectionStartType === "output") {
      // We're dragging from an output, looking for an input
      const inputIndex = targetNode.getInputPortIndex(mx, my);
      if (inputIndex !== -1) {
        // Connect output -> input
        targetNode.node.connectInput(inputIndex, this.connectionStartNode.node);
        connected = true;
      }
    } else if (this.connectionStartType === "input") {
      // We're dragging from an input, looking for an output
      if (targetNode.isOverOutputPort(mx, my)) {
        // Connect output -> input
        this.connectionStartNode.node.connectInput(
          this.connectionStartIndex,
          targetNode.node
        );
        connected = true;
      }
    }

    return connected;
  }

  reset() {
    this.isConnecting = false;
    this.connectionStartNode = null;
    this.connectionStartType = null;
    this.connectionStartIndex = null;
    this.tempConnectionPoint = null;
  }

  drawConnections(visualNodes) {
    this.ctx.strokeStyle = "#666666";
    this.ctx.lineWidth = 2;

    for (const visualNode of visualNodes) {
      const baseNode = visualNode.node;

      baseNode.inputs.forEach((input, index) => {
        if (input instanceof BaseNode) {
          // Find the visual node that corresponds to this input
          const sourceVisualNode = visualNodes.find((vn) => vn.node === input);
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

export default ConnectionManager;
