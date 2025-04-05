import SpaceSky from "./SpaceSky";
import Sun from "./Sun";
import Planet from "./Planet";

class SpaceControls {
  constructor(argsOBJ) {
    const {
      canvas,
      ctx,
      mousePosRef,
      clickedRef,
      ballRef,
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
    this.mousePosRef = mousePosRef;
    this.clickedRef = clickedRef;
    this.ballRef = ballRef;
    this.chaosRef = chaosRef;
    this.trackChaos = trackChaos;
    this.trackMouse = trackMouse;
    this.trackBall = trackBall;
    this.trackClick = trackClick;
    this.onUpdateBallX = onUpdateBallX;
    this.onUpdateBallY = onUpdateBallY;
    this.onUpdateChaos = onUpdateChaos;

    this.spaceSky = new SpaceSky(this.ctx, this.mousePosRef);
    this.sun = new Sun();

    // Add planets with scaled sizes and distances
    this.planets = [
      new Planet("Planet 1", 30, 200, "blue", this.sun, 0.01),
      new Planet("Planet 2", 10, 400, "red", this.sun, 0.02),
    ];

    console.log(
      "SpaceControls initialized",
      this.spaceSky,
      this.sun,
      this.planets
    );
  }

  update() {
    const normalizedFac = Math.max(0, Math.min(1, this.ballRef.current.fac));
    const activeIndex = Math.floor(normalizedFac * this.planets.length);

    this.planets.forEach((planet, index) => {
      planet.active = index === activeIndex;
      planet.update(this.canvas.width, this.canvas.height);
      if (planet.active) {
        this.ballRef.current.x = planet.xNorm;
        this.ballRef.current.y = planet.yNorm;
        this.onUpdateBallX(planet.x);
        this.onUpdateBallY(planet.y);
      }
    });
  }

  draw() {
    this.spaceSky.updateAndDraw();
    this.sun.draw(this.ctx);
    this.planets.forEach((planet) =>
      planet.draw(this.ctx, this.canvas.width, this.canvas.height)
    );
  }
  onResize() {
    // Update the sun's position on resize
    this.sun.x = this.canvas.width / 2;
    this.sun.y = this.canvas.height / 2;
  }
}

export default SpaceControls;
