import { makeBlueprint } from "../BaseNode";
import * as THREE from "three";

const SinOscillator = makeBlueprint({
  type: "transform",
  label: "Sin Oscillator",
  inputDefs: [
    { name: "Amplitude", defaultValue: 1 },
    { name: "Frequency", defaultValue: 1 },
  ],
  outputDef: { name: "Output", label: "Sin" },
  evaluate: (inputs, globalState) => {
    const [amplitude, frequency] = inputs;
    const { time } = globalState;
    const phase = time * frequency * 2 * Math.PI; // Scale frequency to represent Hz
    return (amplitude * Math.sin(phase) + 1) / 2;
  },
  update: (globalState, localState) => {
    const { width, height } = localState.ui;
    const [amplitude, frequency] = localState.evaluatedInputs || [1, 1];
    const { time } = globalState;

    // Update renderer size if needed
    if (
      localState.renderer.getSize(new THREE.Vector2()).width !== width ||
      localState.renderer.getSize(new THREE.Vector2()).height !== height
    ) {
      localState.renderer.setSize(width, height, false);
      localState.camera.aspect = width / height;
      localState.camera.updateProjectionMatrix();
    }

    // Update sine wave geometry
    const points = [];
    const segments = 200;
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 2 - 1; // [-1, 1]
      const t = (i / segments) * (2 * Math.PI);
      const phase = (t + time) * frequency * 2 * Math.PI;
      const y = amplitude * Math.sin(phase);
      points.push(new THREE.Vector3(x, y * 0.5, 0));
    }
    localState.line.geometry.setFromPoints(points);

    // Render scene
    localState.renderer.render(localState.scene, localState.camera);
  },
  init: (globalState, localState) => {
    const { width, height } = localState.ui;
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 2;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height, false);
    // Create sine wave line
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    // Store references
    localState.scene = scene;
    localState.camera = camera;
    localState.renderer = renderer;
    localState.line = line;
    localState.drawImage = renderer.domElement;
    localState.evaluatedInputs = [1, 1];
  },
  destroy: (localState) => {
    // Dispose Three.js objects
    if (localState.line) {
      localState.line.geometry.dispose();
      localState.line.material.dispose();
    }
    if (localState.renderer) {
      localState.renderer.dispose();
    }
    localState.scene = null;
    localState.camera = null;
    localState.renderer = null;
    localState.line = null;
    localState.drawImage = null;
  },
});

export default SinOscillator;
