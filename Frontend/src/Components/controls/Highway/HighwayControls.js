//REPRESENT the click status and mouse status
//REPRESENT && UPDATE the ball x and y - using callbacks from args (onUpdateBallX, onUpdateBallY)

import Sky from "./Sky";
import Highway from "./Highway";

//REPRESENT && UPDATE the CHAOS value (0-1 like all values)
class HighwayControls {
  constructor(argsOBJ) {
    const {
      // Canvas and rendering context
      canvas, // The canvas element
      ctx, // The 2D rendering context for the canvas

      // Mouse tracking
      mousePosRef, // Reference to the current mouse position
      clickedRef, // Reference to the current mouse click status

      // Ball tracking
      ballRef, // Reference to the ball's position and factor {x: y: fac:}

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

    this.sky = new Sky(canvas, ctx, mousePosRef);
    this.highway = new Highway(canvas, ctx, ballRef);
  }

  draw() {
    this.sky.draw();
    this.highway.draw();
  }
  update() {
    this.highway.update();
  } // Update particles and ball
  onResize() {
    this.sky.resize();
  } // Resize canvas to fit the window
}

export default HighwayControls;

// concept:
// A vaporwave car running down a straight highway with procedurally generated hills, the car is the ball, it swerves left and right (ballX) the ball fac determines the avg height of the hills, and the cars relative height sets ball y

// Core Visual Mechanics:
// Car (ball)

// Swerves left/right (ballX) — represents LFO 1.

// Height along the terrain (ballY) — LFO 2. (BALL REF MUST BE MANIPULATED AND send values via onUpdateBallX/Y)

// fac (speed or turbulence) — alters hill frequency/amplitude.

// Mouse Inputs: (updated outside of this class, visual representation only
// Mouse X — drags clouds left/right or changes their density/shape. Think of it like steering the “sky layer.”

// Mouse Y — controls time of day:

// low Y = sunrise hues, mid Y = midday, high Y = deep blue night with moon and stars.

// Smoothly interpolate sky gradient and global lighting.

//TECHNIQUE: prerendering images for potentially complex objects like the car and drawing the imaage from an offscreen canvas rather than each frame
//break into class components - eg class Cloud - class Car, class sky, etc
