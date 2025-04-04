//REPRESENT the click status and mouse status
//REPRESENT && UPDATE the ball x and y - using callbacks from args (onUpdateBallX, onUpdateBallY)
class Controls {
  constructor(
    canvas,
    ctx,
    mousePosRef,
    ballRef,
    clickedRef,
    trackMouse,
    trackBall,
    trackClick,
    onUpdateBallX,
    onUpdateBallY
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    //data to represent - trackables
    this.lastMousePos = { x: 0, y: 0 };
    this.mousePosRef = mousePosRef;
    this.ballRef = ballRef;
    this.lastClicked = false;
    this.clickedRef = clickedRef;
    //Active status of trackables
    this.trackMouse = trackMouse;
    this.trackBall = trackBall;
    this.trackClick = trackClick;

    //to be updated by the 'ball' obj - (planet)
    this.onUpdateBallX = onUpdateBallX;
    this.onUpdateBallY = onUpdateBallY;
  }

  draw() {}
  update() {} // Update particles and ball
}
