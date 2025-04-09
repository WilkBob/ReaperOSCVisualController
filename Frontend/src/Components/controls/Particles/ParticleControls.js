import Ball from "./Ball";
import Particle from "./Particle";

class ParticleControls {
  constructor(argsOBJ) {
    const {
      // Canvas and rendering context
      canvas, // The canvas element
      ctx, // The 2D rendering context for the canvas

      // Mouse tracking
      mousePosRef, // Reference to the current mouse position
      clickedRef, // Reference to the current mouse click status

      // Ball tracking
      ballRef, // Reference to the ball's position and factor

      // Chaos tracking
      chaosRef, // Reference to the chaos value

      // Update callbacks
      onUpdateBallX, // Callback to update the ball's X position
      onUpdateBallY, // Callback to update the ball's Y position
      onUpdateChaos, // Callback to update the chaos value
    } = argsOBJ;

    // Canvas and rendering context
    this.canvas = canvas;
    this.ctx = ctx;

    // Mouse tracking
    this.lastMousePos = { x: 0, y: 0 }; // Last recorded mouse position
    this.mousePosRef = mousePosRef; // Reference to the current mouse position
    this.clickedRef = clickedRef; // Reference to the current mouse click status
    this.lastClicked = false; // Last recorded click state

    // Ball tracking
    this.ballRef = ballRef; // Reference to the ball's position and factor

    // Chaos tracking
    this.chaosRef = chaosRef; // Reference to the chaos value

    // Update callbacks
    this.onUpdateBallX = onUpdateBallX; // Callback to update the ball's X position
    this.onUpdateBallY = onUpdateBallY; // Callback to update the ball's Y position
    this.onUpdateChaos = onUpdateChaos; // Callback to update the chaos value

    this.particles = [];
    this.ball = new Ball(ballRef);

    // New properties for enhanced effects
    this.colorSchemes = [
      // Neon scheme
      ["#ff00ff", "#00ffff", "#ffff00", "#ff0099"],
      // Fire scheme
      ["#ff4500", "#ff8c00", "#ffd700", "#ff0000"],
      // Ocean scheme
      ["#0077be", "#00ccff", "#4169e1", "#00bfff"],
      // Forest scheme
      ["#228b22", "#32cd32", "#00ff00", "#7cfc00"],
      // Sunset scheme
      ["#ff7f50", "#ff6347", "#ff4500", "#ff8c00"],
    ];
    this.activeColorScheme = 0;
    this.particleTypes = ["circle", "square", "triangle", "star"];
    this.trailEffect = true;
    this.gravityEffect = 0.03;
    this.windEffect = 0;
    this.explosionForce = 12;
    this.particleCount = 30;
    this.maxParticles = 500;
    this.particleSizeRange = { min: 5, max: 15 };
    this.particleLifeRange = { min: 80, max: 150 };

    // For connecting particles
    this.connectParticles = true;
    this.connectionDistance = 80;
    this.connectionOpacityDivisor = 2;

    this.init();
  }

  init() {
    console.log("Enhanced ParticleControls initialized");

    // Randomize wind effect periodically
    setInterval(() => {
      this.windEffect = Math.random() * 0.1 - 0.05;
    }, 5000);
  }
  drawMouseClickedRing() {
    const color = "#ffffff";
    const { x, y } = this.mousePosRef.current;
    const size = 20; // Size of the ring
    const lineWidth = 2; // Width of the ring
    const radius = size / 2; // Radius of the ring
    const centerX = x * this.canvas.width; // Center X position
    const centerY = y * this.canvas.height; // Center Y position

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); // Draw the ring
    this.ctx.lineWidth = lineWidth; // Set line width
    this.ctx.strokeStyle = color; // Set stroke color
    this.ctx.stroke(); // Draw the ring
    this.ctx.restore();
  }
  // Get random color from current scheme
  getRandomColor() {
    const colors = this.colorSchemes[this.activeColorScheme];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Cycle to next color scheme
  cycleColorScheme() {
    this.activeColorScheme =
      (this.activeColorScheme + 1) % this.colorSchemes.length;
  }
  starfunceslint = (ctx, size) => {
    const outerRadius = size / 2;
    const innerRadius = size / 4;
    const spikes = 5;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * 2 * i) / (spikes * 2);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
  };
  // Create a custom path for particle shape
  createParticlePath(ctx, type, size) {
    switch (type) {
      case "square":
        ctx.rect(-size / 2, -size / 2, size, size);
        break;
      case "triangle":
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();
        break;
      case "star":
        this.starfunceslint(ctx, size);
        break;
      case "circle":
      default:
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    }
  }

  onResize() {
    return;
  }

  addParticle(x, y, burst = false) {
    const count = burst ? this.particleCount : 1;
    for (let i = 0; i < count; i++) {
      const size =
        Math.random() *
          (this.particleSizeRange.max - this.particleSizeRange.min) +
        this.particleSizeRange.min;
      const life =
        Math.random() *
          (this.particleLifeRange.max - this.particleLifeRange.min) +
        this.particleLifeRange.min;

      // Enhanced particle constructor
      const particle = new Particle(
        x * this.canvas.width,
        y * this.canvas.height,
        size,
        life,
        this.getRandomColor(),
        this.particleTypes[
          Math.floor(Math.random() * this.particleTypes.length)
        ]
      );

      if (burst) {
        // Create explosion effect
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * this.explosionForce;
        particle.vx = Math.cos(angle) * force;
        particle.vy = Math.sin(angle) * force;

        // Add some rotation
        particle.rotation = Math.random() * Math.PI * 2;
        particle.rotationSpeed = (Math.random() - 0.5) * 0.2;
      } else {
        // For trail particles, add some randomness
        particle.vx = (Math.random() - 0.5) * 2;
        particle.vy = (Math.random() - 0.5) * 2;
      }

      this.particles.push(particle);
    }

    // Limit the number of particles
    if (this.particles.length > this.maxParticles) {
      this.particles = this.particles.slice(-this.maxParticles);
    }
  }

  updateAndDrawParticles() {
    const updatedParticles = [];
    const totalLifeForChaos = { max: 0, ac: 0 };
    // If we're not clearing the canvas each frame (for trails)
    if (this.trailEffect) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // First update all particles
    this.particles.forEach((particle) => {
      // Apply gravity
      particle.vy += this.gravityEffect;

      // Apply wind
      particle.vx += this.windEffect;

      // Update position and properties
      particle.update();
      totalLifeForChaos.max += particle.maxLife;
      totalLifeForChaos.ac += particle.life;

      if (particle.life > 0) {
        updatedParticles.push(particle);
      }
    });
    //after summing ac/max = chaosRef.current
    this.chaosRef.current = totalLifeForChaos.ac / totalLifeForChaos.max;
    this.onUpdateChaos(totalLifeForChaos.ac / totalLifeForChaos.max);

    // Draw connection lines between nearby particles
    if (this.connectParticles) {
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeStyle = "#ffffff";

      for (let i = 0; i < updatedParticles.length; i++) {
        for (let j = i + 1; j < updatedParticles.length; j++) {
          const p1 = updatedParticles[i];
          const p2 = updatedParticles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.connectionDistance) {
            this.ctx.beginPath();
            // Set opacity based on distance
            this.ctx.globalAlpha =
              (1 - distance / this.connectionDistance) /
              this.connectionOpacityDivisor;
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        }
      }
    }

    // Then draw all particles
    updatedParticles.forEach((particle) => {
      this.ctx.save();
      this.ctx.translate(particle.x, particle.y);

      // Apply rotation if particle has it
      if ("rotation" in particle) {
        this.ctx.rotate(particle.rotation);
      }

      this.ctx.beginPath();
      this.ctx.fillStyle = particle.color || "#ffffff";
      this.ctx.globalAlpha = particle.life / 100;

      // Draw the particle shape
      this.createParticlePath(this.ctx, particle.type, particle.size);
      this.ctx.fill();

      this.ctx.restore();
    });

    this.ctx.globalAlpha = 1;
    this.particles = updatedParticles;
  }

  update() {
    const { x: mouseX, y: mouseY } = this.mousePosRef.current;
    const clicked = this.clickedRef.current;

    // Calculate the distance between the current and last mouse positions
    const dx = mouseX - this.lastMousePos.x;
    const dy = mouseY - this.lastMousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Add particles for mouse movement
    if (distance > 0.02) {
      // Add particle at current position
      this.addParticle(mouseX, mouseY);

      // Add particles along the movement path for smoother trails
      if (distance > 0.05) {
        const steps = Math.floor(distance * 30);
        for (let i = 1; i < steps; i++) {
          const ratio = i / steps;
          const interpX = this.lastMousePos.x + dx * ratio;
          const interpY = this.lastMousePos.y + dy * ratio;
          this.addParticle(interpX, interpY);
        }
      }

      this.lastMousePos = { x: mouseX, y: mouseY };
    }

    // Handle click events
    if (clicked && !this.lastClicked) {
      this.addParticle(mouseX, mouseY, true);
      // Cycle color scheme on click
      this.cycleColorScheme();
    }
    this.lastClicked = clicked;

    // Update ball position

    this.ball.update(this.canvas.width, this.canvas.height);

    // Add trailing particles behind the ball
    if (Math.random() < 0.3) {
      const ballX = this.ballRef.current.x;
      const ballY = this.ballRef.current.y;
      this.addParticle(ballX, ballY);
    }

    // Call update callbacks
    this.onUpdateBallX(this.ballRef.current.x);
    this.onUpdateBallY(this.ballRef.current.y);

    if (this.trackChaos) {
      this.chaosRef.current = this.particles.length / this.maxParticles;
      this.onUpdateChaos(this.chaosRef.current);
    }
  }

  draw() {
    // Clear the canvas if trail effect is disabled
    if (!this.trailEffect) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Update and draw particles
    this.updateAndDrawParticles();

    // Draw the ball

    this.ball.draw(this.ctx, this.canvas.width, this.canvas.height);

    if (this.clickedRef.current) {
      this.drawMouseClickedRing();
    }
  }
}

export default ParticleControls;
