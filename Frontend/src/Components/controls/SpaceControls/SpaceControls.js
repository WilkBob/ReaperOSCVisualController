class SpaceControls {
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

      // Tracking flags
      trackMouse, // Whether to track mouse movement
      trackBall, // Whether to track ball movement
      trackClick, // Whether to track mouse clicks
      trackChaos, // Whether to track chaos value

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
    this.trackChaos = trackChaos; // Whether chaos tracking is enabled

    // Tracking flags
    this.trackMouse = trackMouse; // Whether mouse tracking is enabled
    this.trackBall = trackBall; // Whether ball tracking is enabled
    this.trackClick = trackClick; // Whether click tracking is enabled

    // Update callbacks
    this.onUpdateBallX = onUpdateBallX; // Callback to update the ball's X position
    this.onUpdateBallY = onUpdateBallY; // Callback to update the ball's Y position
    this.onUpdateChaos = onUpdateChaos; // Callback to update the chaos value
    // Solar system properties
    this.sun = { x: canvas.width / 2, y: canvas.height / 2, radius: 50 };
    this.planets = [
      { radius: 10, distance: 100, angle: 0, speed: 0.01, color: "blue" },
      { radius: 15, distance: 150, angle: 0, speed: 0.005, color: "green" },
      { radius: 20, distance: 200, angle: 0, speed: 0.002, color: "red" },
    ];
  }

  update() {
    // Update planets' positions
    this.planets.forEach((planet) => {
      planet.angle += planet.speed;
      if (planet.angle > Math.PI * 2) {
        planet.angle -= Math.PI * 2;
      }
    });

    // Determine which planet governs the ball based on fac
    if (this.trackBall) {
      const planetIndex = Math.min(
        Math.floor(this.ballRef.current.fac * this.planets.length),
        this.planets.length - 1
      );
      const selectedPlanet = this.planets[planetIndex];

      // Calculate the ball's position based on the selected planet
      const ballX =
        this.sun.x + Math.cos(selectedPlanet.angle) * selectedPlanet.distance;
      const ballY =
        this.sun.y + Math.sin(selectedPlanet.angle) * selectedPlanet.distance;

      // Update the ballRef with the new position
      this.ballRef.current.x = ballX / this.canvas.width;
      this.ballRef.current.y = ballY / this.canvas.height;

      // Call update callbacks
      if (this.onUpdateBallX) this.onUpdateBallX(this.ballRef.current.x);
      if (this.onUpdateBallY) this.onUpdateBallY(this.ballRef.current.y);
    }
  }

  draw() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the sun
    this.ctx.fillStyle = "yellow";
    this.ctx.beginPath();
    this.ctx.arc(this.sun.x, this.sun.y, this.sun.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw the planets
    this.planets.forEach((planet) => {
      const planetX = this.sun.x + Math.cos(planet.angle) * planet.distance;
      const planetY = this.sun.y + Math.sin(planet.angle) * planet.distance;

      this.ctx.fillStyle = planet.color;
      this.ctx.beginPath();
      this.ctx.arc(planetX, planetY, planet.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Draw the ball (if tracking is enabled)
    if (this.trackBall) {
      const ballX = this.ballRef.current.x * this.canvas.width;
      const ballY = this.ballRef.current.y * this.canvas.height;

      // Draw a glowing effect around the ball
      const gradient = this.ctx.createRadialGradient(
        ballX,
        ballY,
        0,
        ballX,
        ballY,
        20
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(ballX, ballY, 20, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw the actual ball
      this.ctx.fillStyle = "white";
      this.ctx.beginPath();
      this.ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  onResize() {
    // Recalculate the sun position
    this.sun.x = this.canvas.width / 2;
    this.sun.y = this.canvas.height / 2;
  }
}

export default SpaceControls;
