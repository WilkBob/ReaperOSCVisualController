const DEFAULT_SETTINGS = {
  particles: {
    controls: [
      {
        id: "sim1",
        name: "Ball-X",
        description: "X value of ball",
        behavior: "lfo",
      },
      {
        id: "sim2",
        name: "Ball-Y",
        description: "Y value of ball",
        behavior: "lfo",
      },
      {
        id: "sim3",
        name: "Ball AVG",
        description: "Mouse click",
        behavior: "chaos",
      },
      {
        id: "sim4",
        name: "AVG Life",
        description: "Average life of particles on screen",
        behavior: "chaos",
      },
    ],
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
    ball: {
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

  space: {
    controls: [
      {
        id: "sim1",
        name: "Planet-X",
        description: "X position of selected planet",
        behavior: "lfo",
      },
      {
        id: "sim2",
        name: "Planet-Y",
        description: "Y position of selected planet",
        behavior: "lfo",
      },
      {
        id: "sim3",
        name: "Planet AVG",
        description: "Average distance of planets from sun",
        behavior: "chaos",
      },
      {
        id: "sim4",
        name: "AVG Speed",
        description: "Average speed of planets",
        behavior: "chaos",
      },
    ],
    PLANET_COUNT: 3,
    PLANET_SIZES: [0.02, 0.025, 0.03],
    PLANET_DISTANCES: [0.3, 0.6, 0.8],
    PLANET_SPEEDS: [0.017, 0.02, 0.013],
    PLANET_COLORS: [
      ["#643A71", "#8B5FBF", "#E3879E", "#FEC0CE"],
      ["#D05353", "#E58F65", "#F9E784", "#F1E8B8"],
      ["#1E441E", "#2A7221", "#119822", "#31CB00"],
    ],
    stars: {
      FADE_RATE: 0.01, // How quickly stars fade out
      TRAIL_LENGTH: 20, // Length of star trail
      MIN_SIZE: 2,
      MAX_SIZE: 5,
      MIN_SPEED: 2,
      MAX_SPEED: 5,
      MAX_STARS: 50,
    },
    sun: {
      RADIUS_FRACTION: 0.06,
      GLOW_FRACTION: 0.02,
      ACTIVE_RADIUS_MULTIPLIER: 1.4, // Sun grows by 40% when active
      ACTIVE_GLOW_MULTIPLIER: 2.0, // Glow grows by 100% when active
      BASE_COLOR: "#FFA500", // Orange base
      ACTIVE_COLOR: "#FF4500", // Red-orange when active
      RAY_COUNT: 12, // Number of rays for the "groovy" glow
      RAY_LENGTH: 0.5, // Length of rays relative to sun radius
    },
    sky: {
      STAR_COUNT: 200, // Number of stars
      STAR_MIN_SIZE: 1, // Minimum star size
      STAR_MAX_SIZE: 3, // Maximum star size
      STAR_GLOW_DISTANCE: 50, // Distance for star glow
      STAR_BASE_COLOR: "#999999", // Default star color
      STAR_GLOW_COLOR: "#ffffff", // Glow color when mouse is near
      GRADIENT_COLORS: ["#000020", "#000040", "#000000"], // Normal gradient colors
      ACTIVE_GRADIENT_COLORS: ["#400000", "#800000", "#000000"], // Active gradient colors
    },
  },
};

export { DEFAULT_SETTINGS };
