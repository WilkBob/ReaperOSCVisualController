import NodeEditor from "./NodeEditor/NodeEditor";

class Simulator {
  constructor(canvas, mouseRef, outputRefs) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.mouseRef = mouseRef; //current.{x (normalized), y (normalized), click, wheel} all 0-1
    this.outputRefs = outputRefs; //current[name] = { current, last, name } for each parameter -do not update last value here, only in the broadcast loop
    this.nodeEditor = new NodeEditor(mouseRef, outputRefs); //current[name] = { current, last, name } for each parameter -do not update last value here, only in the broadcast loop
    this.height = canvas.height;
    this.width = canvas.width;

    this.rafID = null;
  }
  resize() {
    this.height = this.canvas.height = window.innerHeight;
    this.width = this.canvas.width = window.innerWidth;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.outputRefs.current["Parameter1"].current = this.mouseRef.current.x; //normalized
    //draw mouse pos and ref value
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(
      this.mouseRef.current.x * this.width,
      this.mouseRef.current.y * this.height,
      10,
      10
    );

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      this.outputRefs.current["Parameter 1"].current * this.width,
      this.mouseRef.current.y * this.height,
      10,
      10
    );

    this.rafID = requestAnimationFrame(this.animate.bind(this));
  }

  destroy() {
    this.canvas = null;
    this.ctx = null;
    this.mouseRef = null;
    this.outputRefs = null;
    this.nodeEditor.destroy();
    this.nodeEditor = null;
    this.rafID = null;
    this.app = null;
  }
}
export default Simulator;
