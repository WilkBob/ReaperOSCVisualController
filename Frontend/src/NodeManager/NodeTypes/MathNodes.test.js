import { createNode } from "./BaseNode";
import { describe, it, expect } from "vitest";

import { MinMax, Avg, SinOscillator } from "./MathNodes";

describe("Math Node Blueprints", () => {
  it("should calculate Min or Max correctly", () => {
    const minMaxNode = createNode("minMax", MinMax);

    // Test Min
    minMaxNode.inputs = [0, 3, 7];
    expect(minMaxNode.evaluate()).toBe(3);

    // Test Max
    minMaxNode.inputs = [1, 3, 7];
    expect(minMaxNode.evaluate()).toBe(7);
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
    sinNode.inputs = [2, 1]; // Amplitude = 2, Frequency = 1

    // Evaluate the node
    const output = sinNode.evaluate(globalState);

    // Verify the output (sin(1 * π/2) = 1, so output = 2 * 1 = 2)
    expect(output).toBeCloseTo(2);
  });
});
