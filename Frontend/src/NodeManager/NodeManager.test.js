import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import NodeManager from "./NodeManager";
import { createNode } from "./NodeTypes/BaseNode";
import createMouseBlueprint from "./NodeTypes/MouseNode";
import createOSCBlueprint from "./NodeTypes/OSCNode";
import GlobalState from "./GlobalState";

vi.mock("./NodeTypes/BaseNode", () => ({
  createNode: vi.fn(),
}));
vi.mock("./NodeTypes/MouseNode", () => vi.fn());
vi.mock("./NodeTypes/OSCNode", () => vi.fn());
vi.mock("./GlobalState", () => {
  return vi.fn().mockImplementation(() => ({
    updateTime: vi.fn(),
    state: {},
  }));
});

describe("NodeManager", () => {
  let mouseRef;
  let outputRefs;
  let nodeManager;

  beforeEach(() => {
    mouseRef = { current: { mouseX: 0, mouseY: 0 } };
    outputRefs = { current: { osc1: 0, osc2: 0 } };
    nodeManager = new NodeManager(mouseRef, outputRefs);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with mouse and OSC nodes", () => {
    expect(createMouseBlueprint).toHaveBeenCalledWith(
      mouseRef,
      "mouseX",
      "mouseX"
    );
    expect(createMouseBlueprint).toHaveBeenCalledWith(
      mouseRef,
      "mouseY",
      "mouseY"
    );
    expect(createOSCBlueprint).toHaveBeenCalledWith(outputRefs, "osc1");
    expect(createOSCBlueprint).toHaveBeenCalledWith(outputRefs, "osc2");
    expect(createNode).toHaveBeenCalledTimes(4); // 2 mouse nodes + 2 OSC nodes
  });

  it("should update global state and nodes on update", () => {
    const delta = 16;
    const mockNode = { update: vi.fn(), evaluate: vi.fn() };
    nodeManager.nodes = [mockNode];

    nodeManager.update(delta);

    expect(nodeManager.globalState.updateTime).toHaveBeenCalledWith(delta);
    expect(mockNode.update).toHaveBeenCalledWith(nodeManager.globalState.state);
    expect(mockNode.evaluate).toHaveBeenCalledWith(
      nodeManager.globalState.state
    );
  });

  it("should nullify references on destroy", () => {
    nodeManager.destroy();

    expect(nodeManager.mouseRef).toBeNull();
    expect(nodeManager.outputRefs).toBeNull();
  });
});
