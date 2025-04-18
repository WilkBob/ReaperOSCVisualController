class ParticleControls {
  constructor() {
    this.ctx = null;
    this.canvas = null;
  }

  update() {
    if (!this.ctx) return; // Ensure ctx is not null before proceeding
  }

  draw() {
    if (!this.ctx) return; // Ensure ctx is not null before proceeding
    //draw a little square in the middle of the canvas so i know you're alive
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(
      this.canvas.width / 2 - 5,
      this.canvas.height / 2 - 5,
      10,
      10
    );
    this.ctx.fillStyle = "black";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(
      "Particles",
      this.canvas.width / 2 - 50,
      this.canvas.height / 2 + 20
    );
  }

  onResize() {
    if (!this.ctx) return; // Ensure ctx is not null before proceeding
  }
}

const particleControls = new ParticleControls();
const getParticleControls = (ctx) => {
  particleControls.ctx = ctx;
  particleControls.canvas = ctx.canvas;
  particleControls.init();
  return particleControls;
};

export { getParticleControls, particleControls };
