const DEFAULT_SETTINGS = {
  PARTICLE_CONTROLLER: {
    COLOR_SCHEMES: [
      // Neon scheme
      ["#ff00ff", "#00ffff", "#ffff00", "#ff0099"],
      // Fire scheme
      ["#ff4500", "#ff8c00", "#ffd700", "#ff0000"],
      // Ocean scheme
      ["#0077be", "#00ccff", "#4169e1", "#00bfff"],
      // Forest scheme
      ["#228b22", "#32cd32", "#00ff00", "#7cfc00"],
      // Sunset scheme
      ["#ff7f50", "#ff6347", "#ff4500", "#ff8c00"],
    ],

    PARTICLE_TYPES: ["circle", "square", "triangle", "star"],
    TRAIL_EFFECT: false,
    TRAIL_BACKGROUND_COLOR: "rgba(34, 32, 32, 0.1)", // Background color for trail effect
    GRAVITY_EFFECT: 0.03,
    WIND_EFFECT: 0,
    EXPLOSION_FORCE: 50,
    BURST_COUNT: 100,
    MAX_PARTICLES: 500,
    PARTICLE_SIZE_RANGE: { MIN: 5, MAX: 15 },
    PARTICLE_LIFE_RANGE: { MIN: 80, MAX: 150 },

    // LINES
    CONNECT_PARTICLES: true,
    CONNECTION_DISTANCE: 80,
    CONNECTION_OPACITY_DIVISOR: 2,

    // MOUSE
    MOUSE_RING_COLOR: "#ffffff",
    BALL: {
      GLOW_SIZE: 10,
      GLOW_DIRECTION: 1,
      GLOWSPEED: 0.5,
      BALL_SIZE: 15,
      GLOW_SIZE_MAX: 50,
      GLOW_SIZE_MIN: 10,
      GRADIENT_COLOR_START: "rgba(255, 255, 255, 0.8)",
      GRADIENT_COLOR_END: "rgba(255, 255, 255, 0)",
      BALL_COLOR: "rgba(255, 255, 255, 0.9)",
    },
  },

  SPACE_CONTROLS: {
    PLANET_COUNT: 3,
    PLANET_SIZES: [0.02, 0.025, 0.03],
    PLANET_DISTANCES: [0.3, 0.6, 0.8],
    PLANET_SPEEDS: [0.017, 0.02, 0.013],
    PLANET_COLORS: [
      ["#643A71", "#8B5FBF", "#E3879E", "#FEC0CE"],
      ["#D05353", "#E58F65", "#F9E784", "#F1E8B8"],
      ["#1E441E", "#2A7221", "#119822", "#31CB00"],
    ],
    STARS: {
      TRAIL_LENGTH: 15,
      MIN_SIZE: 2,
      MAX_SIZE: 5,
      MIN_SPEED: 2,
      MAX_SPEED: 5,
      MAX_STARS: 50,
    },
  },
};

export { DEFAULT_SETTINGS };
