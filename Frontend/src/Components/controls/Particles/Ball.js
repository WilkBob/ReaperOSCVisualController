class Ball {
  constructor(ballRef) {
    this.ballRef = ballRef; // Reference to the ballRef object, this object must be manipulated to broadcast its properties to the OSCController

    this.GLOW_DIRECTION = 1; // Direction of glow size change (1 = increasing, -1 = decreasing)
    this.GLOWSPEED = 0.5; // Speed of the glow pulsing
    this.BALL_SIZE = 15; // Size of the ball
    this.GLOW_SIZE_MAX = 50; // Maximum glow size
    this.GLOW_SIZE_MIN = 10; // Minimum glow size
    this.GRADIENT_COLOR_START = "rgba(255, 255, 255, 0.8)"; // Gradient start color
    this.GRADIENT_COLOR_END = "rgba(255, 255, 255, 0)"; // Gradient end color
    this.BALL_COLOR = "rgba(255, 255, 255, 0.9)"; // Ball color

    // Velocity properties
    this.vx = 0.01; // Initial horizontal velocity
    this.vy = 0.01; // Initial vertical velocity
    this.GLOW_SIZE = 10; // Initial glow size
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
    this.GLOW_SIZE += this.GLOW_DIRECTION * this.GLOWSPEED;
    if (
      this.GLOW_SIZE >= this.GLOW_SIZE_MAX ||
      this.GLOW_SIZE <= this.GLOW_SIZE_MIN
    ) {
      this.GLOW_DIRECTION *= -1; // Reverse direction when reaching limits
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
      this.GLOW_SIZE
    );
    gradient.addColorStop(0, this.GRADIENT_COLOR_START);
    gradient.addColorStop(1, this.GRADIENT_COLOR_END);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, this.GLOW_SIZE, 0, Math.PI * 2);
    ctx.fill();

    // Draw the actual ball
    ctx.fillStyle = this.BALL_COLOR;
    ctx.beginPath();
    ctx.arc(ballX, ballY, this.BALL_SIZE, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default Ball;
