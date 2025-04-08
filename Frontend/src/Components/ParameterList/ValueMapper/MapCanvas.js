import Stop from "./Stops";

class MapCanvas {
  constructor(canvas, context, width, height, mousePosRef, clickedRef, mapRef) {
    this.canvas = canvas;
    this.context = context;
    this.width = width;
    this.height = height;
    this.mousePosRef = mousePosRef;
    this.clickedRef = clickedRef;
    this.mapRef = mapRef; // Reference to the map object -
    // {stops, -- [
    //   { x: 0.0, y: 0.0 },
    //   { x: 0.3, y: 1.0 },
    //   { x: 0.6, y: 0.5 },
    //   { x: 1.0, y: 1.0 },
    // ]
    // interpolate, invert}
    this.stops = [];
    this.mapRef.current.stops.forEach((stop) => {
      this.stops.push(
        new Stop(context, stop.x, stop.y, clickedRef, mousePosRef)
      );
    });
  }

  draw() {
    // Clear the canvas
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.width, this.height);

    this.stops.forEach((stop) => {
      stop.draw();
    });
  }

  update() {
    this.draw();
  }

  onResize() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.draw(); // Redraw after resizing
  }
}

export default MapCanvas;
