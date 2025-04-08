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
  }

  draw() {}
  update() {
    // Increment time based on deltaTime
    this.time += 0.007; // Adjust speed with multiplier
    this.draw();
  }

  onResize() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.draw(); // Redraw after resizing
  }
}

export default MapCanvas;
