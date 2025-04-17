class ShootingStars {
  constructor(canvas, ctx, celestialIntensity) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.celestialIntensity = celestialIntensity; // Reference to celestial intensity object
    this.stars = []; // Array to hold active shooting stars

    // Configuration options
    this.fadeRate = 0.01; // How quickly stars fade out
    this.trailLength = 15; // Length of star trail
    this.minSize = 2;
    this.maxSize = 5;
    this.minSpeed = 2;
    this.maxSpeed = 5;
    this.maxStars = 50; // Maximum number of stars allowed at once

    // Pre-rendered star images - different sizes and trail lengths
    this.starImages = this.createStarImages();
  }

  createStarImages() {
    // Create an array of pre-rendered star images with different sizes
    const images = [];
    const sizesToRender = [2, 3, 4, 5]; // Star sizes to pre-render

    for (const size of sizesToRender) {
      // Ensure minimum dimensions for the canvas
      const trailLength = Math.max(this.trailLength, 5);
      const canvasWidth = Math.max(size * 2 + trailLength * 2, 10);
      const canvasHeight = Math.max(size * 4, 10);

      const canvas = document.createElement("canvas");
      // Size the canvas to accommodate the star and its trail
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Make sure canvas is actually created with non-zero dimensions
      if (canvas.width <= 0 || canvas.height <= 0) {
        console.error(
          "Failed to create canvas with valid dimensions",
          canvas.width,
          canvas.height
        );
        continue; // Skip this iteration if dimensions are invalid
      }

      const ctx = canvas.getContext("2d");

      // Create a gradient for the trail
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)"); // Transparent start
      gradient.addColorStop(0.4, "rgba(200, 200, 255, 0.3)"); // Subtle blue tint
      gradient.addColorStop(0.8, "rgba(255, 255, 255, 0.7)"); // Brighter middle
      gradient.addColorStop(1, "rgba(255, 255, 255, 1)"); // Full white at end

      // Draw the trail
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2 - size / 2);
      ctx.lineTo(canvas.width - size * 2, canvas.height / 2 - size / 2);
      ctx.lineTo(canvas.width - size * 2, canvas.height / 2 + size / 2);
      ctx.lineTo(0, canvas.height / 2 + size / 2);
      ctx.closePath();
      ctx.fill();

      // Draw the star (core)
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(canvas.width - size, canvas.height / 2, size, 0, Math.PI * 2);
      ctx.fill();

      // Add a subtle glow
      const glowGradient = ctx.createRadialGradient(
        canvas.width - size,
        canvas.height / 2,
        size,
        canvas.width - size,
        canvas.height / 2,
        size * 2
      );
      glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
      glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(canvas.width - size, canvas.height / 2, size * 2, 0, Math.PI * 2);
      ctx.fill();

      images.push({
        canvas,
        size,
        width: canvas.width,
        height: canvas.height,
      });
    }

    // Fallback in case no valid images were created
    if (images.length === 0) {
      const canvas = document.createElement("canvas");
      canvas.width = 20;
      canvas.height = 10;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(15, 5, 3, 0, Math.PI * 2);
      ctx.fill();

      images.push({
        canvas,
        size: 3,
        width: 20,
        height: 10,
      });
    }

    return images;
  }

  getStarImage(size) {
    // Find the closest pre-rendered size
    let closest = this.starImages[0];
    let minDiff = Math.abs(closest.size - size);

    for (const image of this.starImages) {
      const diff = Math.abs(image.size - size);
      if (diff < minDiff) {
        minDiff = diff;
        closest = image;
      }
    }

    return closest;
  }

  spawnStar() {
    // Limit the number of stars
    if (this.stars.length >= this.maxStars) {
      return;
    }

    const size = Math.random() * (this.maxSize - this.minSize) + this.minSize;
    let x, y;

    // Random position near the top 20% of the screen
    x = Math.random() * this.canvas.width;
    y = Math.random() * this.canvas.height * 0.9;

    // Angle between 30-60 degrees for natural diagonal movement
    const angle = (Math.random() * 30 + 30) * (Math.PI / 180);
    const speed =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;

    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };

    const opacity = 1; // Start fully visible
    const rotation = Math.atan2(velocity.y, velocity.x); // Align with movement direction

    // Make sure we have valid star images
    if (this.starImages.length > 0) {
      this.stars.push({
        x,
        y,
        size,
        velocity,
        opacity,
        rotation,
        image: this.getStarImage(size),
      });
    }
  }

  updateAndDraw() {
    // Adjust spawn rate based on celestialIntensity.value
    const spawnRate = this.celestialIntensity.value * 0.1; // Scale spawn rate
    if (Math.random() < spawnRate) {
      this.spawnStar();
    }

    // Create a new array to hold stars that remain active
    const activeStars = [];

    // Update and draw each star in a single loop
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      // Update position
      star.x += star.velocity.x;
      star.y += star.velocity.y;

      // Update opacity
      star.opacity -= this.fadeRate;

      // Check if star should remain active
      if (
        star.opacity > 0 &&
        star.x < this.canvas.width + star.size * 2 &&
        star.y < this.canvas.height + star.size * 2 &&
        star.x > -star.size * 2 &&
        star.y > -star.size * 2
      ) {
        // Verify we have a valid image before drawing
        if (
          star.image &&
          star.image.canvas &&
          star.image.canvas.width > 0 &&
          star.image.canvas.height > 0
        ) {
          // Draw the star using pre-rendered image
          this.ctx.save();
          this.ctx.globalAlpha = star.opacity;

          // Translate and rotate to match the star's movement
          this.ctx.translate(star.x, star.y);
          this.ctx.rotate(star.rotation);

          // Draw the pre-rendered star image
          this.ctx.drawImage(
            star.image.canvas,
            -star.image.width + star.size, // Position so the bright end of the trail is at the star's position
            -star.image.height / 2
          );

          this.ctx.restore();
        } else {
          // Fallback drawing method if image is invalid
          this.ctx.save();
          this.ctx.globalAlpha = star.opacity;
          this.ctx.fillStyle = "white";
          this.ctx.beginPath();
          this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        }

        // Keep this star for the next frame
        activeStars.push(star);
      }
    }

    // Replace the stars array with only the active stars
    this.stars = activeStars;
  }

  updateFrequency(frequencyValue) {
    // Adjust the maximum number of stars and spawn rate based on the frequency value
    this.maxStars = Math.floor(50 * frequencyValue);
    this.fadeRate = 0.01 + (1 - frequencyValue) * 0.02; // Faster fade for lower frequency
  }
}

export default ShootingStars;
