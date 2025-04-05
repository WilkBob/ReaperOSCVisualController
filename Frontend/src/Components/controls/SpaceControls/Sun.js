class Sun {
  constructor() {
    this.x = 0.5;
    this.y = 0.5;
    this.radius = 50;
    this.color = "yellow";
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default Sun;
