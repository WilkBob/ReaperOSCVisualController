import SpaceSky from "./SpaceSky";
import Sun from "./Sun";
import Planet from "./Planet";
import ShootingStars from "./ShootingStars";

class SpaceControls {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.initialized = false; // Track initialization state

    this.simVariables = {
      sunSize: {
        value: 0.1,
        controlled: false,
        label: "Sun Size",
        defaultValue: 0.1,
        type: "output", // This will be controlled BY a node
        description: "Controls the sun size relative to maximum",
      },
      selectedPlanet: {
        value: 0.2,
        controlled: false,
        label: "Selected Planet",
        defaultValue: 0.2,
        type: "output", // Controlled BY a node
        description: "Controls which planet is selected (normalized 0-1)",
      },
      celestialIntensity: {
        value: 0.5,
        controlled: false,
        label: "Celestial Intensity",
        defaultValue: 0.5,
        type: "output", // Controlled BY a node
        description: "Controls sky hue and shooting star frequency",
      },
      starGlowX: {
        value: 0.3,
        controlled: false,
        label: "Star Glow X",
        defaultValue: 0.3,
        type: "output", // Controlled BY a node
        description: "X position for star glow effect",
      },
      starGlowY: {
        value: 0.4,
        controlled: false,
        label: "Star Glow Y",
        defaultValue: 0.4,
        type: "output", // Controlled BY a node
        description: "Y position for star glow effect",
      },
      selectedPlanetX: {
        value: 0.5,
        controlled: false,
        label: "Planet X",
        type: "input", // This will BE an input TO a node
        description: "X position of selected planet (output only)",
      },
      selectedPlanetY: {
        value: 0.5,
        controlled: false,
        label: "Planet Y",
        type: "input", // This will BE an input TO a node
        description: "Y position of selected planet (output only)",
      },
    };
  }

  // Accept canvas and context, handles re-initialization
  init(canvas, ctx) {
    if (!canvas || !ctx) {
      console.error(
        "Canvas or context not provided. Cannot initialize SpaceControls."
      );
      return;
    }
    this.canvas = canvas;
    this.ctx = ctx;

    // Initialize components only if not already initialized or if canvas/ctx changed
    // For simplicity, let's re-initialize components every time init is called with a new context.
    // A more robust solution might check if canvas/ctx actually changed.

    console.log("Initializing SpaceControls components...");
    this.shootingStars = new ShootingStars(
      this.canvas,
      this.ctx,
      this.simVariables.celestialIntensity // Pass the variable object itself
    );
    this.spaceSky = new SpaceSky(
      this.ctx,
      this.simVariables.starGlowX, // Pass the variable object
      this.simVariables.starGlowY, // Pass the variable object
      this.simVariables.celestialIntensity // Pass the variable object
    );
    this.sun = new Sun(); // Sun might need canvas dimensions on init/resize

    this.planets = [
      new Planet(
        "Planet 1",
        0.02,
        0.3,
        ["#643A71", "#8B5FBF", "#E3879E", "#FEC0CE"],
        this.sun,
        this.canvas,
        0.017
      ),
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

    this.initialized = true;
    console.log("SpaceControls initialized successfully.");
    this.onResize(); // Call resize initially to set up dimensions
  }

  // Optional: Method to update context if needed without full re-init
  setContext(canvas, ctx) {
    if (!canvas || !ctx) {
      console.error("Invalid canvas or context provided to setContext.");
      return;
    }
    this.canvas = canvas;
    this.ctx = ctx;
    // Update context for child components that need it
    if (this.shootingStars) this.shootingStars.ctx = ctx;
    if (this.spaceSky) this.spaceSky.ctx = ctx;
    // Planets draw directly using the passed ctx in their draw methods
    // Sun draws directly using the passed ctx
    this.onResize(); // Re-apply sizing based on new canvas potentially
  }

  // Keep destroy minimal as requested, maybe just log or clear refs if necessary
  destroy() {
    console.log("SpaceControls destroy called - doing minimal cleanup.");
    // We are keeping the instance alive, so don't nullify internal components
    // unless they truly need disposal that can't be handled by re-init.
    this.initialized = false; // Mark as uninitialized
    // If components have specific cleanup (e.g., removing listeners), call them here.
  }

  update() {
    if (!this.initialized) return;
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
        // These are read by input nodes
        this.simVariables.selectedPlanetX.value = planet.xNorm;
        this.simVariables.selectedPlanetY.value = planet.yNorm;
      }
    });
  }

  draw() {
    if (!this.initialized || !this.ctx) return; // Check context validity
    this.spaceSky.updateAndDraw();
    this.shootingStars.updateAndDraw();
    this.sun.draw(this.ctx, this.simVariables.sunSize.value);
    this.planets.forEach((planet) => planet.draw(this.ctx));
  }

  onResize() {
    if (!this.initialized || !this.canvas) return; // Check canvas validity
    // Update the sun's position on resize
    this.sun.resize(this.canvas.width, this.canvas.height);

    // Update the space sky's position on resize
    this.spaceSky.resize(this.canvas.width, this.canvas.height);

    // Update planet scaling on resize
    this.planets.forEach((planet) => planet.resize());
  }
}

// Export a single instance (singleton)
const spaceControls = new SpaceControls();

// Remove getSpaceControls function
export { spaceControls }; // Export the singleton instance directly
