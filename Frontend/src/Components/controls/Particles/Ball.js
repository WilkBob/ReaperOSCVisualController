import { settingsManager } from "../Settings/settingsManager";
class Ball {
  constructor(ballRef) {
    this.ballRef = ballRef; // Reference to the ballRef object, this object must be manipulated to broadcast its properties to the OSCController
    const {
      GLOW_DIRECTION,
      GLOWSPEED,
      BALL_SIZE,
      GLOW_SIZE_MAX,
      GLOW_SIZE_MIN,
      GRADIENT_COLOR_START,
      GRADIENT_COLOR_END,
      BALL_COLOR,
    } = settingsManager.settings.particles.ball;
    this.GLOW_DIRECTION = GLOW_DIRECTION; // Direction of glow size change (1 for expanding, -1 for contracting)
    this.GLOWSPEED = GLOWSPEED; // Speed of glow size change
    this.BALL_SIZE = BALL_SIZE; // Size of the ball
    this.GLOW_SIZE_MAX = GLOW_SIZE_MAX; // Maximum glow size
    this.GLOW_SIZE_MIN = GLOW_SIZE_MIN; // Minimum glow size
    this.GRADIENT_COLOR_START = GRADIENT_COLOR_START; // Start color of the gradient
    this.GRADIENT_COLOR_END = GRADIENT_COLOR_END; // End color of the gradient
    this.BALL_COLOR = BALL_COLOR; // Color of the ball
    // Velocity properties
    this.vx = 0.01; // Initial horizontal velocity
    this.vy = 0.01; // Initial vertical velocity
    this.glowSize = GLOW_SIZE_MIN; // Initial glow size
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
    this.glowSize += this.GLOW_DIRECTION * this.GLOWSPEED;
    if (
      this.glowSize >= this.GLOW_SIZE_MAX ||
      this.glowSize <= this.GLOW_SIZE_MIN
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
      this.glowSize
    );
    gradient.addColorStop(0, this.GRADIENT_COLOR_START);
    gradient.addColorStop(1, this.GRADIENT_COLOR_END);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, this.glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw the actual ball
    ctx.fillStyle = this.BALL_COLOR;
    ctx.beginPath();
    ctx.arc(ballX, ballY, this.BALL_SIZE, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default Ball;
