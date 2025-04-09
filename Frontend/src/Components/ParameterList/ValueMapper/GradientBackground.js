class GradientBackground {
  constructor(context, stops, interpolate, invert) {
    this.context = context;
    this.stops = stops; // Array of { x, y } objects
    this.interpolate = interpolate;
    this.invert = invert; // boolean

    // Precompute gradient type and color transformation
    this.gradientType = interpolate ? "linear" : "hard";
    this.colorTransform = invert
      ? (y) => Math.round((1 - y) * 255)
      : (y) => Math.round(y * 255);
  }

  drawGradient(width, height) {
    if (this.gradientType === "linear") {
      // Create a linear gradient from left to right
      const gradient = this.context.createLinearGradient(0, 0, width, 0);

      // Dynamically add stops at 0 and 1 if not present
      const dynamicStops = [...this.stops];
      if (dynamicStops.length > 0 && dynamicStops[0].x > 0) {
        dynamicStops.unshift({ x: 0, y: dynamicStops[0].y });
      }
      if (
        dynamicStops.length > 0 &&
        dynamicStops[dynamicStops.length - 1].x < 1
      ) {
        dynamicStops.push({ x: 1, y: dynamicStops[dynamicStops.length - 1].y });
      }

      // Add color stops based on the y values of the stops
      dynamicStops.forEach((stop) => {
        const colorValue = this.colorTransform(stop.y);
        gradient.addColorStop(
          stop.x,
          `rgba(${colorValue}, ${colorValue}, ${colorValue}, 0.7)`
        );
      });

      // Apply the gradient as the background
      this.context.fillStyle = gradient;
      this.context.fillRect(0, 0, width, height);
    } else {
      // Draw hard color cutoffs

      this.stops.forEach((stop, index) => {
        const colorValue = this.colorTransform(stop.y);
        this.context.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

        const startX = index > 0 ? stop.x * width : 0;
        const endX =
          index < this.stops.length - 1
            ? this.stops[index + 1].x * width
            : width;

        this.context.fillRect(startX, 0, endX - startX, height);
      });
    }
  }
}

export default GradientBackground;
