class Particle {
  constructor(x, y, size, life, color = "#ffffff", type = "circle") {
    this.x = x;
    this.y = y;
    this.size = size;
    this.originalSize = size;
    this.maxLife = life;
    this.life = life;
    this.vx = 0;
    this.vy = 0;
    this.color = color;
    this.type = type;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.oscillationAmplitude = Math.random() * 2;
    this.oscillationSpeed = Math.random() * 0.05;
    this.oscillationOffset = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.02 + Math.random() * 0.03;
    this.fadeRate = 1;
  }

  update() {
    // Update position
    this.x += this.vx;
    this.vy *= 0.98; // Air resistance
    this.vx *= 0.98; // Air resistance
    this.y += this.vy;

    // Update rotation if available
    if (this.rotationSpeed) {
      this.rotation += this.rotationSpeed;
    }

    // Add some oscillation to movement for floating effect
    if (this.type === "circle" || this.type === "star") {
      this.x +=
        Math.sin(this.life * this.oscillationSpeed + this.oscillationOffset) *
        this.oscillationAmplitude *
        0.1;
    }

    // Pulsing size effect
    this.size =
      this.originalSize * (0.8 + Math.sin(this.life * this.pulseSpeed) * 0.2);

    // Decrease life
    this.life -= this.fadeRate;

    // Extra fade out at the end of life
    if (this.life < 20) {
      this.size *= 0.95;
    }
  }
}

export default Particle;
