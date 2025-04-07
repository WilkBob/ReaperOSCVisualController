class Highway {
  constructor(canvas, ctx, ballRef) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ballRef = ballRef;

    this.dashOffset = 0; // Offset for animating the dashed center line
    this.speed = 0.5; // Speed of the dashed line animation
  }

  update() {
    // Update the dash offset to create the illusion of motion
    this.dashOffset += this.speed;

    // Reset the dash offset to prevent it from growing indefinitely
    if (this.dashOffset > 200) {
      this.dashOffset = 0;
    }
  }

  draw() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Draw static side lines
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(width * 0.2, height); // Bottom-left
    ctx.lineTo(width * 0.4, height * 0.3); // Top-left
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width * 0.8, height); // Bottom-right
    ctx.lineTo(width * 0.6, height * 0.3); // Top-right
    ctx.stroke();

    // Draw the dashed center line
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]); // Dash pattern: 20px dash, 20px gap
    ctx.lineDashOffset = -this.dashOffset; // Animate the dashes

    ctx.beginPath();
    ctx.moveTo(width / 2, height); // Bottom-center
    ctx.lineTo(width / 2, 0); // Top-center
    ctx.stroke();

    // Reset the dash pattern
    ctx.setLineDash([]);
  }

  resize() {}
}

export default Highway;
