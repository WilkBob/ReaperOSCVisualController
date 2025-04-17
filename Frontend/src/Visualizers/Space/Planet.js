class Planet {
  constructor(
    name,
    radiusFraction,
    distanceFraction,
    colors,
    sun,
    canvas,
    speed = 0.01
  ) {
    this.name = name;
    this.radiusFraction = radiusFraction; // Radius as a fraction of the smallest dimension
    this.distanceFraction = distanceFraction; // Distance as a fraction of the smallest dimension
    this.colors = colors; // [dark 0, normal 1 , light 2 , lighter 3] colors
    this.sun = sun;
    this.canvas = canvas; // Store canvas reference
    this.angle = 0; // Angle of rotation around the sun
    this.xNorm = 0.5; // Normalized X position (start at center)
    this.yNorm = 0.5; // Normalized Y position (start at center)
    this.speed = speed; // Speed of rotation around the sun
    this.active = false; // Active state of the planet

    // Pre-rendered images
    this.normalImage = null;
    this.selectedImage = null;

    // Compute initial scaled values and pre-render images
    this.resize();
  }

  resize() {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    // Use the smallest dimension to scale distance and radius
    const smallestDimension = Math.min(canvasWidth, canvasHeight);
    this.scaledDistance = this.distanceFraction * smallestDimension;
    this.scaledRadius = this.radiusFraction * smallestDimension;

    // Pre-render the planet images
    this.normalImage = this.createPlanetImage(false);
    this.selectedImage = this.createPlanetImage(true);
  }

  createPlanetImage(isSelected) {
    // Create an offscreen canvas
    const offscreenCanvas = document.createElement("canvas");
    const size = this.scaledRadius * 2 + 10; // Add padding for effects
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    const ctx = offscreenCanvas.getContext("2d");

    // Create a radial gradient
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      this.scaledRadius
    );
    gradient.addColorStop(0, isSelected ? "white" : this.colors[1]); // white if selected, normal color if not
    gradient.addColorStop(0.5, isSelected ? this.colors[3] : this.colors[2]); // lighter color if selected, light color if not
    gradient.addColorStop(1, isSelected ? this.colors[1] : this.colors[0]); // dark color if not selected, normal color if selected

    // Draw the planet
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, this.scaledRadius, 0, Math.PI * 2);
    ctx.fill();

    // Add a ring if selected
    if (isSelected) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, this.scaledRadius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    return offscreenCanvas;
  }

  update() {
    this.angle = (this.angle + this.speed) % (Math.PI * 2); // Keep angle within bounds

    // Calculate the normalized position directly
    this.xNorm = 0.5 + (Math.cos(this.angle) * this.distanceFraction) / 2;
    this.yNorm = 0.5 + (Math.sin(this.angle) * this.distanceFraction) / 2;
  }

  draw(ctx) {
    // Denormalize coordinates for drawing
    const x = this.xNorm * this.canvas.width;
    const y = this.yNorm * this.canvas.height;

    // Choose the appropriate image
    const image = this.active ? this.selectedImage : this.normalImage;

    // Draw the pre-rendered image
    const size = this.scaledRadius * 2 + 10; // Add padding for effects
    ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
  }
}

export default Planet;
