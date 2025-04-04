class SpaceSky {
  constructor(ctx, mousePosRef) {
    this.stars = []; // Array to hold stars
    this.canvas = ctx.canvas; // Reference to the canvas element
    this.ctx = ctx; // Reference to the 2D rendering context
    this.mousePosRef = mousePosRef; // Reference to the current mouse position

    this.gradientCanvas = document.createElement("canvas"); // Separate canvas for gradient
    this.gradientCanvas.width = this.canvas.width;
    this.gradientCanvas.height = this.canvas.height;
    this.gradientCtx = this.gradientCanvas.getContext("2d");

    this.generateGradient(); // Generate the spacey gradient
    this.generateStars(200); // Generate 200 stars
  }

  // Generate a spacey gradient background
  generateGradient() {
    const gradient = this.gradientCtx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(this.canvas.width, this.canvas.height) / 1.5
    );

    gradient.addColorStop(0, "#000020"); // Deep space blue
    gradient.addColorStop(0.5, "#000040"); // Slightly lighter blue
    gradient.addColorStop(1, "#000000"); // Black

    this.gradientCtx.fillStyle = gradient;
    this.gradientCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

    // Draw the gradient background
    this.ctx.drawImage(this.gradientCanvas, 0, 0);

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
    this.generateGradient(); // Regenerate the gradient
  }
}

export default SpaceSky;
