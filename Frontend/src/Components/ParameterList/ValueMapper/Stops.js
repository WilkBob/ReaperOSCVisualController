class Stop {
  constructor(ctx, x, y, clickedRef, mousePosRef) {
    this.x = x; // normalized 0–1
    this.y = y; // normalized 0–1
    this.radius = 8; // radius in pixels
    this.dragging = false;
    this.ctx = ctx; // canvas context
    this.clickedRef = clickedRef; // Reference to mouse click state
    this.mousePosRef = mousePosRef; // Reference to normalized mouse position
  }

  isHovered() {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    // Scale normalized coordinates to canvas dimensions
    const px = this.x * canvasWidth;
    const py = (1 - this.y) * canvasHeight; // Flip y-axis for canvas
    const mouseX = this.mousePosRef.current.x * canvasWidth;
    const mouseY = this.mousePosRef.current.y * canvasHeight;

    // Check if the mouse is within the radius
    const dx = mouseX - px;
    const dy = mouseY - py;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  handleDrag() {
    if (this.clickedRef.current && this.isHovered()) {
      this.dragging = true;
    }

    if (!this.clickedRef.current) {
      this.dragging = false;
    }

    if (this.dragging) {
      // Update position based on mouse position
      this.x = this.mousePosRef.current.x;
      this.y = 1 - this.mousePosRef.current.y; // Flip y-axis for canvas
    }
  }

  draw() {
    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;

    // Handle dragging logic
    this.handleDrag();

    // Scale normalized coordinates to canvas dimensions
    const px = this.x * canvasWidth;
    const py = (1 - this.y) * canvasHeight; // Flip y-axis for canvas

    // Draw the stop
    this.ctx.beginPath();
    this.ctx.arc(px, py, this.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.isHovered() ? "orange" : "blue"; // Highlight if hovered
    this.ctx.fill();
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
  }
}

export default Stop;
