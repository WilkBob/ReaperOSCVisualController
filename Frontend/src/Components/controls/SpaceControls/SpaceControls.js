import SpaceSky from "./SpaceSky";
import Sun from "./Sun";
import Planet from "./Planet";
import ShootingStars from "./ShootingStars";

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

    this.shootingStars = new ShootingStars(canvas, ctx, clickedRef);
    this.spaceSky = new SpaceSky(this.ctx, this.mousePosRef, clickedRef);
    this.sun = new Sun();

    this.PLANET_COUNT = 3;

    this.PLANET_SIZES = [0.02, 0.025, 0.03];
    this.PLANET_DISTANCES = [0.3, 0.6, 0.8];
    this.PLANET_SPEEDS = [0.017, 0.02, 0.013];
    this.PLANET_COLORS = [
      ["#643A71", "#8B5FBF", "#E3879E", "#FEC0CE"],
      ["#D05353", "#E58F65", "#F9E784", "#F1E8B8"],
      ["#1E441E", "#2A7221", "#119822", "#31CB00"],
    ];

    this.planets = [
      ...Array.from({ length: this.PLANET_COUNT }, (_, i) => {
        const name = `Planet ${i + 1}`;
        const size = this.PLANET_SIZES[i];
        const distance = this.PLANET_DISTANCES[i];
        const colors = this.PLANET_COLORS[i];
        const speed = this.PLANET_SPEEDS[i];

        return new Planet(
          name,
          size,
          distance,
          colors,
          this.sun,
          this.canvas,
          speed
        );
      }),
    ];

    console.log(
      "SpaceControls initialized",
      this.spaceSky,
      this.sun,
      this.planets
    );
  }

  update() {
    // First update all planets' positions
    let ChaosAsADerivativeOfAveragePlanetX = 0;
    this.planets.forEach((planet) => {
      planet.update();
      ChaosAsADerivativeOfAveragePlanetX += planet.xNorm;
    });
    ChaosAsADerivativeOfAveragePlanetX /= this.planets.length;
    this.chaosRef.current = ChaosAsADerivativeOfAveragePlanetX;
    this.onUpdateChaos(ChaosAsADerivativeOfAveragePlanetX);
    // Then determine which planet is active based on ballRef.fac
    const normalizedFac = Math.max(0, Math.min(1, this.ballRef.current.fac));
    const activeIndex = Math.min(
      Math.floor(normalizedFac * this.planets.length),
      this.planets.length - 1
    );

    // Update active state and call callbacks only for the active planet
    this.planets.forEach((planet, index) => {
      const isActive = index === activeIndex;
      planet.active = isActive;

      if (isActive) {
        // Update the ball position reference and call callbacks
        this.ballRef.current.x = planet.xNorm;
        this.ballRef.current.y = planet.yNorm;
        this.onUpdateBallX(planet.xNorm);
        this.onUpdateBallY(planet.yNorm);
      }
    });
  }

  draw() {
    this.spaceSky.updateAndDraw();
    this.shootingStars.updateAndDraw();
    this.sun.draw(this.ctx, this.clickedRef.current);
    this.planets.forEach((planet) => planet.draw(this.ctx));
  }

  onResize() {
    // Update the sun's position on resize
    this.sun.resize(this.canvas.width, this.canvas.height);
    // Update the space sky's size on resize
    this.spaceSky.resize(this.canvas.width, this.canvas.height);

    // Update planet scaling on resize
    this.planets.forEach((planet) => planet.resize());
  }
}

export default SpaceControls;
