export default function createMouseBlueprint(mouseRef, key, name) {
  // mouseRef is a ref to the mouse object
  // key is the key to use for the mouseRef object
  // e.g mouseRef.current.x, mouseRef.current.y, mouseRef.current.click, mouseRef.current.wheel
  // return a blueprint for the mouse node
  return {
    type: "input",
    label: name,
    inputDefs: [],
    evaluate: () => mouseRef.current[key],
    outputDef: { name: name, label: name },
  };
}
