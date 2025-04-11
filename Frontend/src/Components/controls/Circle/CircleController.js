class CircleController {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }
  draw() {
    this.ctx.fillStyle = "blue";
    this.ctx.beginPath();
    this.ctx.arc(100, 100, 50, 0, Math.PI * 2); // Draw a blue circle
    this.ctx.fill();
  }
}

export default CircleController;
