class Ball {
  constructor(ballRef) {
    this.ballRef = ballRef; // Reference to the ballRef object, this object must be manipulated to broadcast it's properties to the OSCController
    this.glowSize = 10; // Initial glow size
    this.glowDirection = 1; // Direction of glow size change (1 = increasing, -1 = decreasing)
    this.glowSpeed = 0.5; // Speed of the glow pulsing

    // Velocity properties
    this.vx = 0.01; // Initial horizontal velocity
    this.vy = 0.01; // Initial vertical velocity
  }

  update() {
    // Update ball position based on velocity and factor
    this.ballRef.current.x += this.vx * this.ballRef.current.fac;
    this.ballRef.current.y += this.vy * this.ballRef.current.fac * 1.2;

    // Bounce off edges
    if (this.ballRef.current.x <= 0 || this.ballRef.current.x >= 1) {
      this.vx *= -1; // Reverse horizontal velocity
    }
    if (this.ballRef.current.y <= 0 || this.ballRef.current.y >= 1) {
      this.vy *= -1; // Reverse vertical velocity
    }

    // Update glow size for pulsing effect
    this.glowSize += this.glowDirection * this.glowSpeed;
    if (this.glowSize >= 50 || this.glowSize <= 10) {
      this.glowDirection *= -1; // Reverse direction when reaching limits
    }

    // Clamp position to stay within bounds
    this.ballRef.current.x = Math.max(0, Math.min(1, this.ballRef.current.x));
    this.ballRef.current.y = Math.max(0, Math.min(1, this.ballRef.current.y));
  }

  draw(ctx, canvasWidth, canvasHeight) {
    const ballX = this.ballRef.current.x * canvasWidth;
    const ballY = this.ballRef.current.y * canvasHeight;

    // Draw gradient around the ball for the glow effect
    const gradient = ctx.createRadialGradient(
      ballX,
      ballY,
      0,
      ballX,
      ballY,
      this.glowSize
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, this.glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw the actual ball
    ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 15, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default Ball;
