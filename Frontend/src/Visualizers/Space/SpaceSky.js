class SpaceSky {
  constructor(ctx, starGlowX, starGlowY, celestialIntensity) {
    this.stars = []; // Array to hold stars
    this.canvas = ctx.canvas; // Reference to the canvas element
    this.ctx = ctx; // Reference to the 2D rendering context
    this.starGlowX = starGlowX; // Reference to the X position of the star glow
    this.starGlowY = starGlowY; // Reference to the Y position of the star glow
    this.celestialIntensity = celestialIntensity; // Reference to the celestial intensity object

    this.gradientCanvas = document.createElement("canvas"); // Separate canvas for gradient
    this.gradientCanvas.width = this.canvas.width;
    this.gradientCanvas.height = this.canvas.height;
    this.gradientCtx = this.gradientCanvas.getContext("2d");

    this.activeGradientCanvas = document.createElement("canvas"); // Separate canvas for active gradient
    this.activeGradientCanvas.width = this.canvas.width;
    this.activeGradientCanvas.height = this.canvas.height;
    this.activeGradientCtx = this.activeGradientCanvas.getContext("2d");

    this.glowCanvas = document.createElement("canvas"); // Separate canvas for star glow
    this.glowCanvas.width = this.canvas.width;
    this.glowCanvas.height = this.canvas.height;
    this.glowCtx = this.glowCanvas.getContext("2d");

    this.generateGradient(this.gradientCtx, ["#000020", "#000040", "#000000"]); // Normal gradient
    this.generateGradient(this.activeGradientCtx, [
      "#400000",
      "#800000",
      "#000000",
    ]); // Active gradient

    this.generateStars(400); // Generate 400 stars for a richer effect
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
        glowColor: `hsl(${Math.random() * 360}, 80%, 70%)`, // Randomized glow color
      });
    }
  }

  // Combined update and draw method
  updateAndDraw() {
    const intensity = this.celestialIntensity.value; // Get the intensity value

    // Blend between the normal and active gradient based on intensity
    this.ctx.globalAlpha = 1 - intensity;
    this.ctx.drawImage(this.gradientCanvas, 0, 0);

    this.ctx.globalAlpha = intensity;
    this.ctx.drawImage(this.activeGradientCanvas, 0, 0);

    this.ctx.globalAlpha = 1; // Reset alpha for subsequent drawing

    // Clear the glow canvas
    this.glowCtx.clearRect(0, 0, this.glowCanvas.width, this.glowCanvas.height);

    // Update and draw the stars
    this.stars.forEach((star) => {
      const dx = star.x - this.starGlowX.value * this.canvas.width;
      const dy = star.y - this.starGlowY.value * this.canvas.height;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If the glow center is near the star, illuminate it
      star.isGlowing = distance < 100; // Glow if within 100px of the glow center

      // Draw the star
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = star.baseColor;
      this.ctx.fill();

      // Draw the glow effect on the glow canvas
      if (star.isGlowing) {
        const glowRadius = star.size * 6; // Larger radius for the glow
        const gradient = this.glowCtx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          glowRadius
        );
        gradient.addColorStop(0, star.glowColor);
        gradient.addColorStop(1, "transparent");

        this.glowCtx.beginPath();
        this.glowCtx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
        this.glowCtx.fillStyle = gradient;
        this.glowCtx.fill();
      }
    });

    // Draw the glow canvas on top of the main canvas
    this.ctx.drawImage(this.glowCanvas, 0, 0);
  }

  // Resize the gradient and glow canvases when the window is resized
  resize() {
    this.gradientCanvas.width = this.canvas.width;
    this.gradientCanvas.height = this.canvas.height;
    this.activeGradientCanvas.width = this.canvas.width;
    this.activeGradientCanvas.height = this.canvas.height;
    this.glowCanvas.width = this.canvas.width;
    this.glowCanvas.height = this.canvas.height;

    this.generateGradient(this.gradientCtx, ["#000020", "#000040", "#000000"]); // Regenerate normal gradient
    this.generateGradient(this.activeGradientCtx, [
      "#400000",
      "#800000",
      "#000000",
    ]); // Regenerate active gradient
  }
}

export default SpaceSky;
