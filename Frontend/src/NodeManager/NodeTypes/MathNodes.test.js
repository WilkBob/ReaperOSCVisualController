import { createNode } from "./BaseNode";
import { describe, it, expect } from "vitest";

import { MinMax, Avg, SinOscillator } from "./MathNodes";

describe("Math Node Blueprints", () => {
  it("should calculate Min or Max correctly", () => {
    const minMaxNode = createNode("minMax", MinMax);

    // Test Min
    minMaxNode.setRawInput(0, 0); // Switch
    minMaxNode.setRawInput(1, 0.3); // Input 1
    minMaxNode.setRawInput(2, 0.7); // Input 2
    expect(minMaxNode.evaluate()).toBeCloseTo(0.3);

    // Test Max
    minMaxNode.setRawInput(0, 1); // Switch
    minMaxNode.setRawInput(1, 0.3); // Input 1
    minMaxNode.setRawInput(2, 0.7); // Input 2
    expect(minMaxNode.evaluate()).toBeCloseTo(0.7);
  });

  it("should calculate Average correctly", () => {
    const avgNode = createNode("average", Avg);

    avgNode.inputs = [4, 6];
    expect(avgNode.evaluate()).toBe(5);
  });
});

// Add a test for the SinOscillator node
describe("Sin Oscillator Node", () => {
  it("should calculate the sine wave output correctly", () => {
    const sinNode = createNode("sinOscillator", SinOscillator);

    // Mock globalState with a time property
    const globalState = { time: Math.PI / 2 };

    // Set inputs for amplitude and frequency
    sinNode.setRawInput(0, 1); // Amplitude = 1
    sinNode.setRawInput(1, 1); // Frequency = 1

    // Evaluate the node
    const output = sinNode.evaluate(globalState);

    // Verify the output (sin(1 * π/2) = 1, normalized to (1 + 1) / 2 = 1)
    expect(output).toBeCloseTo(1);
  });
});
