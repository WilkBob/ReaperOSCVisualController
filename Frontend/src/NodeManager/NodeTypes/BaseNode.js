class BaseNode {
  constructor({
    id,
    type,
    label,
    inputDefs,
    outputDef,
    evaluate,
    update,
    init,
    destroy,
  }) {
    this.id = id;
    this.type = type;
    this.label = label;

    this.inputDefs = inputDefs; // array of { name, defaultValue }
    this.outputDef = outputDef; // { name, label }

    this.inputs = new Array(inputDefs.length).fill(null);
    this.evaluateFn = evaluate;
    this.updateFn = update || (() => {}); // default to a no-op function //callback for updating state
    this.initFn = init || (() => {}); // default to a no-op function //callback for setting initial state
    this.destroyFn = destroy || (() => {}); // default to a no-op function //callback for tearing down state
    this.localState = {
      state: "init",
      drawImage: null,
      evaluatedInputs: Array(inputDefs.length).fill(null),
      ui: { position: { x: 0, y: 0 }, size: { x: 200, y: 200 } }, // UI state for the node
    }; // local state for the node, can be used in update and init functions
    this.output = 0; // default output value
    this.outputNodes = []; // array of output connections

    this.cache = { cycleId: null, output: null }; // Cache for evaluation output
  }

  connectInput(index, node) {
    this.inputs[index] = node;
    // Check if the node is already in the outputNodes array of the connected node
    if (!node.outputNodes.includes(this)) {
      node.outputNodes.push(this); // Add this node to the outputNodes of the connected node
    }
  }

  disconnectAllInputs() {
    this.inputs.forEach((input) => {
      if (input instanceof BaseNode) {
        input.disconnectOutput(this); // Disconnect this node from the connected node
      }

      this.inputs = new Array(this.inputDefs.length).fill(null); // Reset inputs to null
    });
  }

  disconnectInput(index) {
    if (this.inputs[index] instanceof BaseNode) {
      this.inputs[index].disconnectOutput(this); // Disconnect this node from the connected node
    }
    this.inputs[index] = null;
  }

  disconnectOutput(node) {
    const index = this.outputNodes.indexOf(node);
    if (index > -1) {
      this.outputNodes.splice(index, 1); // Remove the node from the outputNodes array
    }
  }

  setRawInput(index, value) {
    this.inputs[index] = value;
  }

  update(globalState) {
    if (this.updateFn) {
      this.updateFn(globalState, this.localState);
    }
  }

  init(globalState) {
    if (this.initFn) {
      this.initFn(globalState, this.localState);
    }
  }
  destroy() {
    if (this.destroyFn) {
      this.destroyFn(this.localState);
    }
  }

  evaluate(globalState) {
    // Check if the output is already cached for the current cycle
    const cycleId = globalState.cycleId;
    if (this.cache.cycleId === cycleId) {
      return this.cache.output;
    }

    const evaluatedInputs = this.inputs.map((input, i) => {
      if (input instanceof BaseNode) {
        return input.evaluate(globalState, cycleId);
      }
      return input ?? this.inputDefs[i].defaultValue ?? 0; // fallback to default or 0
    });
    this.localState.evaluatedInputs = [...evaluatedInputs]; // Store evaluated inputs in local state
    this.output = this.evaluateFn(
      evaluatedInputs,
      globalState,
      this.localState
    );

    // Update the cache with the new output and cycleId
    this.cache = { cycleId, output: this.output };

    return this.output;
  }
}

export default BaseNode;

function createNode(id, blueprint) {
  return new BaseNode({
    id,
    type: blueprint.type,
    label: blueprint.label,
    inputDefs: blueprint.inputDefs,
    outputDef: blueprint.outputDef,
    evaluate: blueprint.evaluate,
    update: blueprint.update,
    init: blueprint.init,
    destroy: blueprint.destroy,
  });
}

function makeBlueprint({
  type,
  label,
  inputDefs,
  outputDef = { name: "out", label: "Output" },
  evaluate = () => {
    // default evaluate function does nothing
  },
  update = () => {
    // default update function does nothing
  },
  init = () => {
    // default init function does nothing
  },
  destroy = () => {
    // default destroy function does nothing
  },
}) {
  return {
    type,
    label,
    inputDefs,
    outputDef,
    evaluate,
    update,
    init,
    destroy,
  };
}

export { createNode, makeBlueprint };
