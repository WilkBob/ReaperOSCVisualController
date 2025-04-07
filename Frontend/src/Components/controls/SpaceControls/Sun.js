class Sun {
  constructor(radiusFraction = 0.06, glowFraction = 0.02) {
    this.x = 0.5; // Normalized X position
    this.y = 0.5; // Normalized Y position
    this.radiusFraction = radiusFraction; // Base radius as a fraction of the smallest dimension
    this.glowFraction = glowFraction; // Base glow size as a fraction of the smallest dimension

    // Growth factors for active state
    this.activeRadiusMultiplier = 1.4; // Sun grows by 40% when active
    this.activeGlowMultiplier = 2.0; // Glow grows by 100% when active

    // Color properties
    this.baseColor = "#FFA500"; // Orange base
    this.activeColor = "#FF4500"; // Red-orange when active
    this.rayCount = 12; // Number of rays for the "groovy" glow
    this.rayLength = 0.5; // Length of rays relative to sun radius

    // Scaled values
    this.scaledRadius = 0;
    this.scaledGlow = 0;

    // Pre-rendered images
    this.normalImage = null;
    this.activeImage = null;

    // Initialize
    this.resize();
  }

  resize(canvasWidth = 800, canvasHeight = 600) {
    // Use the smallest dimension to scale radius and glow
    const smallestDimension = Math.min(canvasWidth, canvasHeight);
    this.scaledRadius = this.radiusFraction * smallestDimension;
    this.scaledGlow = this.glowFraction * smallestDimension;

    // Pre-render the sun images
    this.normalImage = this.createSunImage(false);
    this.activeImage = this.createSunImage(true);
  }

  createSunImage(isActive) {
    // Calculate sizes based on active state
    const radiusMultiplier = isActive ? this.activeRadiusMultiplier : 1;
    const glowMultiplier = isActive ? this.activeGlowMultiplier : 1;

    const currentRadius = this.scaledRadius * radiusMultiplier;
    const currentGlow = this.scaledGlow * glowMultiplier;

    // Calculate the total size needed for the canvas (sun + rays)
    const rayLengthFactor = isActive ? this.rayLength * 1.5 : this.rayLength;
    const outerRadius = currentRadius * (1 + rayLengthFactor);
    const totalSize = outerRadius * 2 + currentGlow * 2;

    // Create an offscreen canvas
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = totalSize;
    offscreenCanvas.height = totalSize;
    const ctx = offscreenCanvas.getContext("2d");

    const centerX = totalSize / 2;
    const centerY = totalSize / 2;

    // Draw the groovy rays/glow
    this.drawRays(
      ctx,
      centerX,
      centerY,
      currentRadius,
      this.rayLength,
      isActive
    );

    // Create a soft inner glow gradient
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      currentRadius * 0.7,
      centerX,
      centerY,
      currentRadius
    );

    const color = isActive ? this.activeColor : this.baseColor;
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, this.colorWithOpacity(color, 0.9));

    // Draw the core of the sun
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    return offscreenCanvas;
  }

  // Helper function to create color with opacity
  colorWithOpacity(baseColor, opacity) {
    // Parse the hex color
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Create groovy rays
  drawRays(ctx, centerX, centerY, radius, rayLength, isActive) {
    const rayCount = this.rayCount;
    const rayLengthFactor = isActive ? rayLength * 1.5 : rayLength;
    const outerRadius = radius * (1 + rayLengthFactor);

    ctx.save();
    ctx.beginPath();

    // Create a wavy, groovy edge
    for (let i = 0; i < 360; i++) {
      const angle = (i * Math.PI) / 180;
      const wave = Math.sin(angle * rayCount) * 0.2 + 0.8;
      const rayRadius = radius + (outerRadius - radius) * wave;

      const x = centerX + Math.cos(angle) * rayRadius;
      const y = centerY + Math.sin(angle) * rayRadius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();

    // Create gradient for rays with the glow
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius,
      centerX,
      centerY,
      outerRadius
    );

    const color = isActive ? this.activeColor : this.baseColor;
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, this.colorWithOpacity(color, 0.7));
    gradient.addColorStop(1, this.colorWithOpacity(color, 0));

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }

  draw(ctx, isActive = false) {
    // Choose the appropriate image
    const image = isActive ? this.activeImage : this.normalImage;

    // Denormalize the sun's position
    const x = this.x * ctx.canvas.width;
    const y = this.y * ctx.canvas.height;

    // Get the size of the pre-rendered image
    const imageSize = image.width;

    // Draw the pre-rendered image
    ctx.drawImage(image, x - imageSize / 2, y - imageSize / 2);
  }
}

export default Sun;
