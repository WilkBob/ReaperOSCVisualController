import GradientBackground from "./GradientBackground";

class MapCanvas {
  constructor(
    canvas,
    context,
    width,
    height,
    mousePosRef,
    clickedRef,
    stopsRef,
    interpolate,
    invert
  ) {
    this.canvas = canvas;
    this.context = context;
    this.width = width;
    this.height = height;

    this.mousePosRef = mousePosRef;
    this.clickedRef = clickedRef;
    this.stopsRef = stopsRef;
    this.interpolate = interpolate;
    this.invert = invert;

    this.gradientBackground = new GradientBackground(
      context,
      stopsRef.current,
      interpolate,
      invert
    );

    // State management
    this.selectedStopIndex = null;
    this.isDragging = false;
    this.lastClickTime = 0; // For double-click detection
    this.stopRadius = 7;
    this.selectionDistance = 10;

    // Make sure canvas can receive keyboard events
    this.canvas.tabIndex = 0;
  }

  // Convert between screen and normalized coordinates
  screenToNormalized(x, y) {
    return {
      x: x / this.width,
      y: 1 - y / this.height, // Invert Y
    };
  }

  normalizedToScreen(x, y) {
    return {
      x: x * this.width,
      y: (1 - y) * this.height, // Invert Y
    };
  }

  // Stop management methods
  selectStopAtPosition(x, y) {
    const mousePos = { x, y };

    // First try to select an existing stop
    for (let i = 0; i < this.stopsRef.current.length; i++) {
      const stop = this.stopsRef.current[i];
      const stopPos = this.normalizedToScreen(stop.x, stop.y);

      const distance = Math.sqrt(
        Math.pow(mousePos.x * this.width - stopPos.x, 2) +
          Math.pow(mousePos.y * this.height - stopPos.y, 2)
      );

      if (distance < this.selectionDistance) {
        this.selectedStopIndex = i;
        this.isDragging = true;
        return true;
      }
    }

    // If no stop was selected, deselect current selection
    this.selectedStopIndex = null;
    return false;
  }

  addStopAtPosition(x, y) {
    if (this.stopsRef.current.length >= 10) {
      // Limit the number of stops to 10
      return false;
    }
    const newStop = this.screenToNormalized(x * this.width, y * this.height);

    // Find insert position to maintain left-to-right order
    let insertIndex = this.stopsRef.current.length;
    for (let i = 0; i < this.stopsRef.current.length; i++) {
      if (newStop.x < this.stopsRef.current[i].x) {
        insertIndex = i;
        break;
      }
    }

    this.stopsRef.current.splice(insertIndex, 0, newStop);
    this.selectedStopIndex = insertIndex;
    return insertIndex;
  }

  deleteSelectedStop() {
    if (this.selectedStopIndex !== null) {
      // Don't allow deleting if we only have 2 or fewer stops
      if (this.stopsRef.current.length <= 2) {
        return false;
      }

      this.stopsRef.current.splice(this.selectedStopIndex, 1);
      this.selectedStopIndex = null;
      return true;
    }
    return false;
  }

  moveSelectedStop(x, y) {
    if (this.selectedStopIndex === null) return false;

    // Update the position
    this.stopsRef.current[this.selectedStopIndex] = this.screenToNormalized(
      x * this.width,
      y * this.height
    );

    // Sort stops to maintain order (optional)
    // this.sortStops();

    return true;
  }

  sortStops() {
    // Sort stops by x position
    const selectedStop =
      this.selectedStopIndex !== null
        ? { ...this.stopsRef.current[this.selectedStopIndex] }
        : null;

    this.stopsRef.current.sort((a, b) => a.x - b.x);

    // Update selected index after sorting
    if (selectedStop) {
      this.selectedStopIndex = this.stopsRef.current.findIndex(
        (stop) => stop.x === selectedStop.x && stop.y === selectedStop.y
      );
    }
  }

  // Event handlers
  handleKeyDown = (event) => {
    if (event.key === "Delete" || event.key === "Backspace") {
      this.deleteSelectedStop();
    } else if (event.key === "+") {
      this.addStopAtPosition(0.5, 0.5); // Add a stop at the center
    } else if (event.key === "Escape") {
      this.selectedStopIndex = null;
    }
    if (event.key === "ArrowUp") {
      if (this.selectedStopIndex === null) return;

      // Move selected stop up
      const selectedStop = this.stopsRef.current[this.selectedStopIndex];
      const newY = Math.min(selectedStop.y + 0.01, 1.0); // Ensure y is within bounds
      this.stopsRef.current[this.selectedStopIndex] = {
        ...selectedStop,
        y: newY,
      };
    }
    if (event.key === "ArrowDown") {
      if (this.selectedStopIndex === null) return;

      // Move selected stop down
      const selectedStop = this.stopsRef.current[this.selectedStopIndex];
      const newY = Math.max(selectedStop.y - 0.01, 0.0); // Ensure y is within bounds
      this.stopsRef.current[this.selectedStopIndex] = {
        ...selectedStop,
        y: newY,
      };
    }

    if (event.key === "ArrowLeft") {
      if (this.selectedStopIndex === null) return;
      if (event.ctrlKey) {
        // Move selected stop left
        const selectedStop = this.stopsRef.current[this.selectedStopIndex];
        const newX = Math.max(selectedStop.x - 0.01, 0.0); // Ensure x is within bounds
        this.stopsRef.current[this.selectedStopIndex] = {
          ...selectedStop,
          x: newX,
        };
        return;
      }
      // Otherwise select the previous stop
      this.selectedStopIndex = Math.max(this.selectedStopIndex - 1, 0);
    }
    if (event.key === "ArrowRight") {
      if (this.selectedStopIndex === null) return;
      if (event.ctrlKey) {
        // Move selected stop right
        const selectedStop = this.stopsRef.current[this.selectedStopIndex];
        const newX = Math.min(selectedStop.x + 0.01, 1.0); // Ensure x is within bounds
        this.stopsRef.current[this.selectedStopIndex] = {
          ...selectedStop,
          x: newX,
        };
        return;
      }

      //otherwise select the next stop
      this.selectedStopIndex = Math.min(
        this.selectedStopIndex + 1,
        this.stopsRef.current.length - 1
      );
    }
  };

  handleDoubleClick = (event) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / this.width;
    const y = (event.clientY - rect.top) / this.height;

    // if we're on or near a stop, delete it
    for (let i = 0; i < this.stopsRef.current.length; i++) {
      const stop = this.stopsRef.current[i];
      const stopPos = this.normalizedToScreen(stop.x, stop.y);
      const distance = Math.sqrt(
        Math.pow(x * this.width - stopPos.x, 2) +
          Math.pow(y * this.height - stopPos.y, 2)
      );
      if (distance < this.selectionDistance) {
        this.selectedStopIndex = i;
        this.deleteSelectedStop();
        return;
      }
    }
    this.addStopAtPosition(x, y);
  };

  canDelete() {
    return this.stopsRef.current.length > 2;
  }

  update() {
    // Update gradient background
    this.gradientBackground.drawGradient(this.width, this.height);

    // Handle interactions
    this.handleInteractions();

    // Draw the stops
    this.drawStops();
  }

  handleInteractions() {
    const { x: mouseX, y: mouseY } = this.mousePosRef.current;
    const isClicked = this.clickedRef.current;

    if (isClicked && !this.isDragging) {
      // Start new selection/drag
      this.selectStopAtPosition(mouseX, mouseY);
    } else if (isClicked && this.isDragging) {
      // Continue dragging
      this.moveSelectedStop(mouseX, mouseY);
    } else if (!isClicked && this.isDragging) {
      // End dragging
      this.isDragging = false;
      // Optionally sort stops after drag
      this.sortStops();
    }
  }

  drawStops() {
    const ctx = this.context;

    this.stopsRef.current.forEach((stop, index) => {
      const { x, y } = this.normalizedToScreen(stop.x, stop.y);
      const isSelected = index === this.selectedStopIndex;

      // Draw the vertical line
      ctx.strokeStyle = isSelected ? "white" : "#0fa7c3";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();

      // Draw the handle circle
      ctx.fillStyle = isSelected ? "white" : "#0fa7c3";
      ctx.beginPath();
      ctx.arc(x, y, this.stopRadius, 0, Math.PI * 2);
      ctx.fill();

      //draw valueY if selected
      if (isSelected) {
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        const text = `(${stop.y.toFixed(2)})`;
        const textWidth = ctx.measureText(text).width;
        const textX = x < this.width / 2 ? x + 15 : x - textWidth - 15;
        ctx.fillText(text, textX, stop.y <= 0.5 ? y - 10 : y + 15);
      }

      // Add a border to the handle for better visibility
      ctx.strokeStyle = isSelected ? "#0fa7c3" : "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  reset() {
    this.stopsRef.current = [
      { x: 0.0, y: 0.0 },
      { x: 1.0, y: 1.0 },
    ];
    this.gradientBackground.stops = this.stopsRef.current;
    this.selectedStopIndex = null;
    this.isDragging = false;
  }

  onResize() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }
}

export default MapCanvas;
