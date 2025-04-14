import NodeManager from "../NodeManager/NodeManager";

class InteractiveVisualizer {
  constructor(canvas, mouseRef, outputRefs) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.mouseRef = mouseRef;
    this.outputRefs = outputRefs;
    this.nodeManager = new NodeManager(mouseRef, outputRefs);
    this.height = this.canvas.height;
    this.width = this.canvas.width;

    this.time = 0;
    this.deltaTime = 0.16;
    this.rafID = null;

    this.resize();
  }
  resize() {
    this.height = this.canvas.height = window.innerHeight;
    this.width = this.canvas.width = window.innerWidth;
  }

  animate() {
    if (!this.ctx) return; // Ensure ctx is not null before proceeding

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.nodeManager.update(this.deltaTime); // Update the node manager with delta time
    this.drawNodes();

    this.time += this.deltaTime;
    this.rafID = requestAnimationFrame(this.animate.bind(this));
  }

  drawNodes() {
    const nodeSpacing = 150;
    const startX = 50;
    const startY = 50;

    this.nodeManager.nodes.forEach((node, index) => {
      const x = startX + (index % 3) * nodeSpacing;
      const y = startY + Math.floor(index / 3) * nodeSpacing;

      this.drawNode(node, x, y);
    });
  }

  drawNode(node, x, y) {
    const nodeWidth = 100;
    const nodeHeight = 50;

    // Draw the node rectangle
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(x, y, nodeWidth, nodeHeight);

    // Draw the node label
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      node.label +
        " " +
        " " +
        node.evaluate(this.nodeManager.globalState).toFixed(2),
      x + nodeWidth / 2,
      y + 20
    );

    // Draw input dots
    const inputSpacing = nodeHeight / (node.inputDefs.length + 1);

    node.inputDefs.forEach((input, index) => {
      this.ctx.fillStyle = node.inputs[index] ? "#0f0" : "#fff"; // Green if connected, white if not
      const dotY = y + inputSpacing * (index + 1);
      this.ctx.beginPath();
      this.ctx.arc(x - 5, dotY, 5, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Draw output dot
    this.ctx.fillStyle = "#f00";
    this.ctx.beginPath();
    this.ctx.arc(x + nodeWidth + 5, y + nodeHeight / 2, 5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  destroy() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID); // Cancel any ongoing animation frame
      this.rafID = null;
    }
    this.canvas = null;
    this.ctx = null;
    this.mouseRef = null;
    this.outputRefs = null;
    this.nodeManager = null;
    this.width = null;
    this.height = null;
    this.app = null;
  }
}
export default InteractiveVisualizer;
