//REPRESENT the click status and mouse status
//REPRESENT && UPDATE the ball x and y - using callbacks from args (onUpdateBallX, onUpdateBallY)
class Controls {
  constructor(argsOBJ) {
    const {
      canvas,
      ctx,
      mousePosRef,
      ballRef,
      clickedRef,
      chaosRef,
      trackMouse,
      trackBall,
      trackClick,
      trackChaos,
      onUpdateBallX,
      onUpdateBallY,
      onUpdateChaos,
    } = argsOBJ;
    this.canvas = canvas;
    this.ctx = ctx;
    this.lastMousePos = { x: 0, y: 0 };
    this.mousePosRef = mousePosRef;
    this.ballRef = ballRef;
    this.lastClicked = false;
    this.clickedRef = clickedRef;
    this.chaosRef = chaosRef;
    this.trackChaos = trackChaos;
    this.onUpdateChaos = onUpdateChaos;
    this.trackMouse = trackMouse;
    this.trackBall = trackBall;
    this.trackClick = trackClick;
    this.onUpdateBallX = onUpdateBallX;
    this.onUpdateBallY = onUpdateBallY;
  }

  draw() {}
  update() {} // Update particles and ball
}
