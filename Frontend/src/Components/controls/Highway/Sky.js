class Sky {
  constructor(canvas, ctx, mousePosRef) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.mousePosRef = mousePosRef;

    // Create an offscreen canvas for the gradients
    this.gradientCanvas = document.createElement("canvas");
    this.gradientCanvas.width = canvas.width * 3; // 3x the width for three scenes
    this.gradientCanvas.height = canvas.height;
    this.gradientCtx = this.gradientCanvas.getContext("2d");

    // Create an offscreen canvas for the stars
    this.starCanvas = document.createElement("canvas");
    this.starCanvas.width = canvas.width;
    this.starCanvas.height = canvas.height;
    this.starCtx = this.starCanvas.getContext("2d");

    this.generateStars();
    this.createGradients();
  }

  generateStars() {
    // Generate stars with varying brightness and size
    const starCount = Math.floor(
      (this.canvas.width * this.canvas.height) / 1000
    );

    // Draw stars on the offscreen star canvas
    this.starCtx.clearRect(0, 0, this.starCanvas.width, this.starCanvas.height);
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * this.starCanvas.width;
      const y = Math.random() * this.starCanvas.height;
      const size = Math.random() * 1.5 + 0.5;
      const opacity = Math.random() * 0.8 + 0.2;

      this.starCtx.beginPath();
      this.starCtx.arc(x, y, size, 0, Math.PI * 2);
      this.starCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      this.starCtx.fill();
    }
  }

  createGradients() {
    const width = this.gradientCanvas.width;
    const height = this.gradientCanvas.height;
    const segmentWidth = width / 3;

    // Clear the canvas first
    this.gradientCtx.clearRect(0, 0, width, height);

    // Scene 1: Night into Dawn (0% - 33%)
    const gradient1 = this.gradientCtx.createLinearGradient(
      0,
      0,
      segmentWidth,
      0
    );
    gradient1.addColorStop(0, "#120136"); // Deep night (dark purple)
    gradient1.addColorStop(0.5, "#30115E"); // Transitional pre-dawn
    gradient1.addColorStop(1, "#40107A"); // Pre-dawn purple

    this.gradientCtx.fillStyle = gradient1;
    this.gradientCtx.fillRect(0, 0, segmentWidth, height);

    // Scene 2: Dawn into Morning (33% - 66%)
    const gradient2 = this.gradientCtx.createLinearGradient(
      segmentWidth,
      0,
      segmentWidth * 2,
      0
    );
    gradient2.addColorStop(0, "#40107A"); // Pre-dawn purple
    gradient2.addColorStop(0.3, "#A64B82"); // Pink/purple transition
    gradient2.addColorStop(0.7, "#FF7F50"); // Coral/orange morning
    gradient2.addColorStop(1, "#FFA07A"); // Lighter morning

    this.gradientCtx.fillStyle = gradient2;
    this.gradientCtx.fillRect(segmentWidth, 0, segmentWidth, height);

    // Scene 3: Morning into Midday (66% - 100%)
    const gradient3 = this.gradientCtx.createLinearGradient(
      segmentWidth * 2,
      0,
      width,
      0
    );
    gradient3.addColorStop(0, "#FFA07A"); // Lighter morning
    gradient3.addColorStop(0.5, "#87CEEB"); // Sky blue
    gradient3.addColorStop(1, "#4682B4"); // Steel blue / midday

    this.gradientCtx.fillStyle = gradient3;
    this.gradientCtx.fillRect(segmentWidth * 2, 0, segmentWidth, height);

    // Apply a slight vertical gradient to help transitions appear more natural
    const verticalBlend = this.gradientCtx.createLinearGradient(
      0,
      0,
      0,
      height
    );
    verticalBlend.addColorStop(0, "rgba(0,0,0,0.15)"); // Slightly darker at top
    verticalBlend.addColorStop(0.5, "rgba(0,0,0,0)"); // No change in middle
    verticalBlend.addColorStop(1, "rgba(255,255,255,0.1)"); // Slightly lighter at bottom

    this.gradientCtx.globalCompositeOperation = "overlay";
    this.gradientCtx.fillStyle = verticalBlend;
    this.gradientCtx.fillRect(0, 0, width, height);

    // Reset composite operation
    this.gradientCtx.globalCompositeOperation = "source-over";
  }

  drawStars() {
    const { x } = this.mousePosRef.current || { x: 0.5 };

    // Star visibility fades as we move from night to day
    // Maximum visibility at position 0 (night), gone by position 0.7 (day)
    const starOpacityFactor = Math.max(0, 1 - x * 1.4);

    if (starOpacityFactor > 0) {
      this.ctx.globalAlpha = starOpacityFactor;
      this.ctx.drawImage(this.starCanvas, 0, 0);
      this.ctx.globalAlpha = 1.0; // Reset alpha
    }
  }

  draw() {
    const { x } = this.mousePosRef.current || { x: 0.5 };

    // Calculate the portion of the gradient to draw
    const gradientWidth = this.canvas.width;
    const offsetX = x * (this.gradientCanvas.width - gradientWidth);

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the portion of the gradient onto the main canvas
    this.ctx.drawImage(
      this.gradientCanvas,
      offsetX,
      0,
      gradientWidth,
      this.gradientCanvas.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Draw stars on top of the gradient
    this.drawStars();
  }

  resize() {
    // Regenerate the stars for the new size
    this.starCanvas.width = this.canvas.width;
    this.starCanvas.height = this.canvas.height;
    this.generateStars();

    // Recreate the gradients when the canvas size changes
    this.gradientCanvas.width = this.canvas.width * 3;
    this.gradientCanvas.height = this.canvas.height;
    this.createGradients();
  }
}

export default Sky;
