//REPRESENT the click status and mouse status
//REPRESENT && UPDATE the ball x and y - using callbacks from args (onUpdateBallX, onUpdateBallY)
class Controls {
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

    this.mousePosRef = mousePosRef; // Reference to the current mouse position
    this.clickedRef = clickedRef; // Reference to the current mouse click status

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
  }

  draw() {}
  update() {} // Update particles and ball
  onResize() {} // Resize canvas to fit the window
}
