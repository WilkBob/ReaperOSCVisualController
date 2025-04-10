import { settingsManager } from "../Settings/settingsManager";

class Sun {
  constructor() {
    this.x = 0.5; // Normalized X position
    this.y = 0.5; // Normalized Y position

    this.settings = settingsManager.settings.space.sun; // Settings for the sun

    // Constants

    // this.settings.RADIUS_FRACTION = 0.06;
    // this.settings.GLOW_FACTOR = 0.02; // Glow size as a fraction of the smallest dimension
    // this.settings.ACTIVE_RADIUS_MULTIPLIER = 1.4; // Sun grows by 40% when active
    // this.settings. = 2.0; // Glow grows by 100% when active
    // this.BASE_COLOR = "#FFA500"; // Orange base
    // this.ACTIVE_COLOR = "#FF4500"; // Red-orange when active
    // this.RAY_COUNT = 12; // Number of rays for the "groovy" glow
    // this.RAY_LENGTH = 0.5; // Length of rays relative to sun radius

    // Scaled values
    this.scaled_radius = 0;
    this.scaled_glow = 0;

    // Pre-rendered images
    this.normal_image = null;
    this.active_image = null;

    // Initialize
    this.resize();
  }

  resize(canvasWidth = 800, canvasHeight = 600) {
    // Use the smallest dimension to scale radius and glow
    const smallestDimension = Math.min(canvasWidth, canvasHeight);
    this.scaled_radius = this.settings.RADIUS_FRACTION * smallestDimension;
    this.scaled_glow = this.settings.GLOW_FRACTION * smallestDimension;

    // Pre-render the sun images
    this.normal_image = this.createSunImage(false);
    this.active_image = this.createSunImage(true);
  }

  createSunImage(isActive) {
    // Calculate sizes based on active state
    const radiusMultiplier = isActive
      ? this.settings.ACTIVE_RADIUS_MULTIPLIER
      : 1;
    const glowMultiplier = isActive ? this.settings.ACTIVE_GLOW_MULTIPLIER : 1;

    const currentRadius = this.scaled_radius * radiusMultiplier;
    const currentGlow = this.scaled_glow * glowMultiplier;

    // Calculate the total size needed for the canvas (sun + rays)
    const rayLengthFactor = isActive
      ? this.settings.RAY_LENGTH * 1.5
      : this.settings.RAY_LENGTH;
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
      this.settings.RAY_LENGTH,
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

    const color = isActive
      ? this.settings.ACTIVE_COLOR
      : this.settings.BASE_COLOR;
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
    const rayCount = this.settings.RAY_COUNT;
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

    const color = isActive
      ? this.settings.ACTIVE_COLOR
      : this.settings.BASE_COLOR;
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, this.colorWithOpacity(color, 0.7));
    gradient.addColorStop(1, this.colorWithOpacity(color, 0));

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }

  draw(ctx, isActive = false) {
    // Choose the appropriate image
    const image = isActive ? this.active_image : this.normal_image;

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
