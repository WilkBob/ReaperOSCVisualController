class Sun {
  constructor(radiusFraction = 0.1) {
    this.x = 0.5; // Normalized X position
    this.y = 0.5; // Normalized Y position
    this.radiusFraction = radiusFraction; // Base radius as a fraction of the smallest dimension

    // Color properties
    this.baseColor = "#FFA500"; // Orange base
    this.rayCount = 12; // Number of rays
    this.rayWaveAmplitude = 0.2; // Wave amplitude for rays

    // Scaled values
    this.scaledRadius = 0;
    this.canvasSize = 0;

    // Pre-rendered sun template (will be scaled during drawing)
    this.sunTemplate = null;

    // Canvas dimensions
    this.canvasWidth = 0;
    this.canvasHeight = 0;

    // Initialize
    this.resize();
  }

  resize(canvasWidth = 800, canvasHeight = 600) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Use the smallest dimension to scale radius
    const smallestDimension = Math.min(canvasWidth, canvasHeight);
    this.scaledRadius = this.radiusFraction * smallestDimension;

    // Calculate canvas size with room for rays
    this.canvasSize = this.scaledRadius * 4; // Make it 4x the radius to accommodate rays

    // Create the sun template
    this.createSunTemplate();
  }

  createSunTemplate() {
    // Create an offscreen canvas for the sun template
    const canvas = document.createElement("canvas");
    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = this.scaledRadius;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw rays
    this.drawRays(ctx, centerX, centerY, baseRadius);

    // Draw sun core with gradient
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      baseRadius
    );

    gradient.addColorStop(0, "#FFFFFF"); // White hot center
    gradient.addColorStop(0.7, this.baseColor); // Orange middle
    gradient.addColorStop(1, "#FF4500"); // Red-orange edge

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    ctx.fill();

    this.sunTemplate = canvas;
  }

  drawRays(ctx, centerX, centerY, radius) {
    const rayOuterRadius = radius * 1.75; // Rays extend 75% beyond sun radius

    // Draw rays with gradient
    const rayGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.9, // Start just inside the sun's edge
      centerX,
      centerY,
      rayOuterRadius
    );

    rayGradient.addColorStop(0, "rgba(255, 165, 0, 0.8)"); // Semi-transparent orange
    rayGradient.addColorStop(0.3, "rgba(255, 69, 0, 0.6)"); // Semi-transparent red-orange
    rayGradient.addColorStop(1, "rgba(255, 69, 0, 0)"); // Transparent

    ctx.save();
    ctx.beginPath();

    // Create a wavy, ray edge
    for (let i = 0; i < 360; i++) {
      const angle = (i * Math.PI) / 180;
      const wave =
        Math.sin(angle * this.rayCount) * this.rayWaveAmplitude + 0.8;
      const rayRadius = radius + (rayOuterRadius - radius) * wave;

      const x = centerX + Math.cos(angle) * rayRadius;
      const y = centerY + Math.sin(angle) * rayRadius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.fillStyle = rayGradient;
    ctx.fill();
    ctx.restore();
  }

  draw(ctx, sunSize = 0.5) {
    // Check if template exists
    if (!this.sunTemplate) {
      this.createSunTemplate();
    }

    // Calculate scaling factor based on sunSize value (0-1)
    // Scale between 0.3 and 1.0
    const scaleFactor = 0.3 + sunSize * 0.7;

    // Denormalize the sun's position
    const x = this.x * ctx.canvas.width;
    const y = this.y * ctx.canvas.height;

    // Calculate the dimensions for drawing
    const drawSize = this.canvasSize * scaleFactor;

    // Draw the scaled sun template
    ctx.drawImage(
      this.sunTemplate,
      x - drawSize / 2, // Center horizontally
      y - drawSize / 2, // Center vertically
      drawSize,
      drawSize
    );
  }

  // Update position if needed
  setPosition(xNorm, yNorm) {
    this.x = xNorm;
    this.y = yNorm;
  }
}

export default Sun;
