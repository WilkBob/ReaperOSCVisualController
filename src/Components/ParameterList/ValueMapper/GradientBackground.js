  drawGradient(width, height) {
    if (this.interpolate) {
      // Create a linear gradient from left to right
      const gradient = this.context.createLinearGradient(0, 0, width, 0);

      // Add color stops based on the y values of the stops
      this.stops.forEach((stop) => {
        const colorValue = Math.round((this.invert ? 1 - stop.y : stop.y) * 255); // Invert y if needed
        gradient.addColorStop(
          stop.x,
          `rgb(${colorValue}, ${colorValue}, ${colorValue})`
        );
      });

      // Apply the gradient as the background
      this.context.fillStyle = gradient;
      this.context.fillRect(0, 0, width, height);
    } else {
      // Draw hard color cutoffs
      this.stops.forEach((stop, index) => {
        const colorValue = Math.round((this.invert ? 1 - stop.y : stop.y) * 255); // Invert y if needed
        this.context.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

        const startX = stop.x * width;
        const endX =
          index < this.stops.length - 1
            ? this.stops[index + 1].x * width
            : width;

        this.context.fillRect(startX, 0, endX - startX, height);
      });
    }
  }