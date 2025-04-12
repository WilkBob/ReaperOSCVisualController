const VisualizerNodes = {
  space: {
    id: "space",
    name: "Space",
    nodes: {
      inputs: {
        glowX: {
          defaultControl: "mouseX",
          description: "X position of the star glow",
          label: "Glow X",
        },
        glowY: {
          defaultControl: "mouseX",
          description: "Y position of the star glow",
          label: "Glow Y",
        },
        selectedPlanet: {
          defaultControl: "wheel",
          description: "Selected Planet",
          label: "Selected Planet",
        },
        planetSpeed: {
          defaultControl: "constant",
          description: "Planet Speed",
          label: "Planet Speed",
        },
        celestialIntensity: {
          defaultControl: "click",
          description: "Celestial Intensity",
          label: "Celestial Intensity",
        },
      },
      outputs: {
        planetX: {
          description: "X position of the planet",
          behavior: "lfo",
          label: "Planet X",
        },
        planetY: {
          description: "Y position of the planet",
          behavior: "lfo",
          label: "Planet Y",
        },
        numberOfStars: {
          description: "current stars divided by max stars",
          behavior: "chaos",
          label: "Number of Stars",
        },
      },
    },
  },

  particle: {
    id: "particle",
    name: "Particle Controls",
    nodes: {
      inputs: {
        spawnX: {
          defaultControl: "mouseX",
          description: "X position of the particle spawn",
          label: "Spawn X",
        },
        spawnY: {
          defaultControl: "mouseY",
          description: "Y position of the particle spawn",
          label: "Spawn Y",
        },
        spawnRate: {
          defaultControl: "click",
          description: "Rate of particle spawn",
          label: "Spawn Rate",
        },
        ballSpeed: {
          defaultControl: "wheel",
          description: "Ball Speed",
          label: "Ball Speed",
        },
        ballSize: {
          defaultControl: "constant",
          description: "Ball Size",
          label: "Ball Size",
        },
      },
      outputs: {
        ballX: {
          description: "X position of the ball",
          behavior: "lfo",
          label: "Ball X",
        },
        ballY: {
          description: "Y position of the ball",
          behavior: "lfo",
          label: "Ball Y",
        },
        ballAvg: {
          description: "Average position of the ball",
          behavior: "lfo",
          label: "Ball Avg",
        },
        numberOfParticles: {
          description: "current particles divided by max particles",
          behavior: "chaos",
          label: "Number of Particles",
        },
      },
    },
  },
};
