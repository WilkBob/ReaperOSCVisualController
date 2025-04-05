class Planet {
  constructor(name, radius, distance, color, sun, speed = 0.01) {
    this.name = name;
    this.radius = radius;
    this.color = color;
    this.sun = sun;
    this.distance = distance; // Distance from the sun (normalized)
    this.angle = 0; // Angle of rotation around the sun
    this.xNorm = 0; // Normalized X position
    this.yNorm = 0; // Normalized Y position
    this.speed = speed; // Speed of rotation around the sun
    this.active = false; // Active state of the planet
  }

  update(canvasWidth, canvasHeight) {
    this.angle = (this.angle + this.speed) % (Math.PI * 2); // Keep angle within bounds

    // Calculate normalized coordinates
    this.xNorm = 0.5 + (Math.cos(this.angle) * this.distance) / canvasWidth;
    this.yNorm = 0.5 + (Math.sin(this.angle) * this.distance) / canvasHeight;
  }

  draw(ctx, canvasWidth, canvasHeight) {
    // Denormalize coordinates for drawing
    const x = this.xNorm * canvasWidth;
    const y = this.yNorm * canvasHeight;

    // Draw the planet
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // If the planet is active, draw a ring around it
    if (this.active) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, this.radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

export default Planet;
