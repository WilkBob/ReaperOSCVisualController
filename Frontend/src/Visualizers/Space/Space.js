import SpaceSky from "./SpaceSky";
import Sun from "./Sun";
import Planet from "./Planet";
import ShootingStars from "./ShootingStars";

class SpaceControls {
  constructor(ctx) {
    this.canvas = ctx.canvas;
    this.ctx = ctx;

    this.simVariables = {
      sunSize: {
        value: 0.1,
        controlled: false,
        label: "Sun Size",
        defaultValue: 0.1,
        type: "output",
        description: "Controls the sun size relative to maximum",
      },
      selectedPlanet: {
        value: 0.2,
        controlled: false,
        label: "Selected Planet",
        defaultValue: 0.2,
        type: "output",
        description: "Controls which planet is selected (normalized 0-1)",
      },
      celestialIntensity: {
        value: 0.5,
        controlled: false,
        label: "Celestial Intensity",
        defaultValue: 0.5,
        type: "output",
        description: "Controls sky hue and shooting star frequency",
      },
      starGlowX: {
        value: 0.3,
        controlled: false,
        label: "Star Glow X",
        defaultValue: 0.3,
        type: "output",
        description: "X position for star glow effect",
      },
      starGlowY: {
        value: 0.4,
        controlled: false,
        label: "Star Glow Y",
        defaultValue: 0.4,
        type: "output",
        description: "Y position for star glow effect",
      },
      selectedPlanetX: {
        value: 0.5,
        controlled: false,
        label: "Planet X",
        type: "input",
        description: "X position of selected planet (output only)",
      },
      selectedPlanetY: {
        value: 0.5,
        controlled: false,
        label: "Planet Y",
        type: "input",
        description: "Y position of selected planet (output only)",
      },
    };
    this.shootingStars = new ShootingStars(
      this.canvas,
      this.ctx,
      this.simVariables.celestialIntensity
    );
    this.spaceSky = new SpaceSky(
      this.ctx,
      this.simVariables.starGlowX,
      this.simVariables.starGlowY,
      this.simVariables.celestialIntensity
    );
    this.sun = new Sun();

    // Add planets with scaled sizes and distances
    this.planets = [
      new Planet(
        "Planet 1",
        0.02,
        0.3,
        ["#643A71", "#8B5FBF", "#E3879E", "#FEC0CE"],
        this.sun,
        this.canvas,
        0.017
      ), //colors [dark, normal, light, lighter]
      new Planet(
        "Planet 2",
        0.02,
        0.6,
        ["#D05353", "#E58F65", "#F9E784", "#F1E8B8"],
        this.sun,
        this.canvas,
        0.02
      ),
      new Planet(
        "Planet 3",
        0.025,
        0.8,
        ["#1E441E", "#2A7221", "#119822", "#31CB00"],
        this.sun,
        this.canvas,
        0.013
      ),
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

    this.planets.forEach((planet) => {
      planet.update();
    });

    // Then determine which planet is active based on ballRef.fac
    const normalizedFac = Math.max(
      0,
      Math.min(1, this.simVariables.selectedPlanet.value)
    );
    const activeIndex = Math.min(
      Math.floor(normalizedFac * this.planets.length),
      this.planets.length - 1
    );

    // Update active state and call callbacks only for the active planet
    this.planets.forEach((planet, index) => {
      const isActive = index === activeIndex;
      planet.active = isActive;

      if (isActive) {
        // Update only the value property of selectedPlanetX and selectedPlanetY
        this.simVariables.selectedPlanetX.value = planet.xNorm;
        this.simVariables.selectedPlanetY.value = planet.yNorm;
      }
    });
  }

  draw() {
    this.spaceSky.updateAndDraw();
    this.shootingStars.updateAndDraw();
    this.sun.draw(this.ctx, this.simVariables.sunSize.value);
    this.planets.forEach((planet) => planet.draw(this.ctx));
  }

  onResize() {
    // Update the sun's position on resize
    this.sun.resize(this.canvas.width, this.canvas.height);

    // Update planet scaling on resize
    this.planets.forEach((planet) => planet.resize());
  }
}

export default SpaceControls;
