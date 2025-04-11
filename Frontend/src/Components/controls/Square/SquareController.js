class SquareController {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }
  draw() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(50, 50, 100, 100); // Draw a red square
  }
}

export default SquareController;
