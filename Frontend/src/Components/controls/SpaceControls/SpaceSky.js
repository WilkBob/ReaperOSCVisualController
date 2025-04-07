class SpaceSky {
  constructor(ctx, mousePosRef, clickedRef) {
    this.stars = []; // Array to hold stars
    this.canvas = ctx.canvas; // Reference to the canvas element
    this.ctx = ctx; // Reference to the 2D rendering context
    this.mousePosRef = mousePosRef; // Reference to the current mouse position
    this.clickedRef = clickedRef; // Reference to the clicked state

    this.gradientCanvas = document.createElement("canvas"); // Separate canvas for gradient
    this.gradientCanvas.width = this.canvas.width;
    this.gradientCanvas.height = this.canvas.height;
    this.gradientCtx = this.gradientCanvas.getContext("2d");

    this.activeGradientCanvas = document.createElement("canvas"); // Separate canvas for active gradient
    this.activeGradientCanvas.width = this.canvas.width;
    this.activeGradientCanvas.height = this.canvas.height;
    this.activeGradientCtx = this.activeGradientCanvas.getContext("2d");

    this.generateGradient(this.gradientCtx, ["#000020", "#000040", "#000000"]); // Normal gradient
    this.generateGradient(this.activeGradientCtx, [
      "#400000",
      "#800000",
      "#000000",
    ]); // Active gradient

    this.generateStars(200); // Generate 200 stars
  }

  // Generate a spacey gradient background
  generateGradient(ctx, colors) {
    const gradient = ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(this.canvas.width, this.canvas.height) / 1.5
    );

    gradient.addColorStop(0, colors[0]); // First color
    gradient.addColorStop(0.5, colors[1]); // Middle color
    gradient.addColorStop(1, colors[2]); // Last color

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Generate stars and scatter them randomly
  generateStars(count) {
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width, // Random x position
        y: Math.random() * this.canvas.height, // Random y position
        size: Math.random() * 2 + 1, // Random size (1-3)
        baseColor: "#999999", // Default star color
        glowColor: "#d466ff", // Glow color when mouse is near
      });
    }
  }

  // Combined update and draw method
  updateAndDraw() {
    const mouseX = this.mousePosRef.current.x * this.canvas.width;
    const mouseY = this.mousePosRef.current.y * this.canvas.height;

    // Draw the appropriate gradient background
    if (this.clickedRef.current) {
      this.ctx.drawImage(this.activeGradientCanvas, 0, 0);
    } else {
      this.ctx.drawImage(this.gradientCanvas, 0, 0);
    }

    // Update and draw the stars
    this.stars.forEach((star) => {
      const dx = star.x - mouseX;
      const dy = star.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If the mouse is near the star, illuminate it
      star.isGlowing = distance < 50; // Glow if within 50px of the mouse

      // Draw the star
      this.ctx.beginPath();
      this.ctx.arc(
        star.x,
        star.y,
        star.isGlowing ? star.size * 2 : star.size,
        0,
        Math.PI * 2
      );
      this.ctx.fillStyle = star.isGlowing ? star.glowColor : star.baseColor;
      this.ctx.fill();
    });
  }

  // Resize the gradient canvas when the window is resized
  resize() {
    this.gradientCanvas.width = this.canvas.width;
    this.gradientCanvas.height = this.canvas.height;
    this.activeGradientCanvas.width = this.canvas.width;
    this.activeGradientCanvas.height = this.canvas.height;
    this.generateGradient(this.gradientCtx, ["#000020", "#000040", "#000000"]); // Regenerate normal gradient
    this.generateGradient(this.activeGradientCtx, [
      "#400000",
      "#800000",
      "#000000",
    ]); // Regenerate active gradient
  }
}

export default SpaceSky;
