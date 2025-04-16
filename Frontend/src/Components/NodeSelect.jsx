import React, { useEffect } from "react";
import {
  Avg,
  MinMax,
  SinOscillator,
  Constant,
} from "../NodeManager/NodeTypes/MathNodes";
import GamepadAxisNode from "../NodeManager/NodeTypes/GamePadNode";
import createMouseBlueprint from "../NodeManager/NodeTypes/MouseNode";
import { FormControl, MenuItem, Select, ListSubheader } from "@mui/material";

const NodeSelect = ({ mouseRef, selectedNodeType, setSelectedNodeType }) => {
  const nodeTypes = {
    Math: [
      { name: "Average", blueprint: Avg },
      { name: "MinMax", blueprint: MinMax },
      { name: "SinOscillator", blueprint: SinOscillator },
      { name: "Constant", blueprint: Constant },
    ],
    Mouse: [
      {
        name: "MouseX",
        blueprint: createMouseBlueprint(mouseRef, "x", "Mouse X"),
      },
      {
        name: "MouseY",
        blueprint: createMouseBlueprint(mouseRef, "y", "Mouse Y"),
      },
      {
        name: "MouseWheel",
        blueprint: createMouseBlueprint(mouseRef, "wheel", "Wheel"),
      },
      {
        name: "MouseClick",
        blueprint: createMouseBlueprint(mouseRef, "click", "Click"),
      },
    ],
    GamePad: [{ name: "GamePadAxis", blueprint: GamepadAxisNode }],
  };

  // Set default node type on component mount
  useEffect(() => {
    // Set first Math node as default if no node is selected
    if (!selectedNodeType) {
      setSelectedNodeType(nodeTypes.Math[0]);
    }
  }, [selectedNodeType, setSelectedNodeType, nodeTypes.Math]);

  const handleNodeTypeChange = (e) => {
    const [category, nodeName] = e.target.value.split(":");
    const selectedNode = nodeTypes[category].find(
      (node) => node.name === nodeName
    );
    setSelectedNodeType(selectedNode);
  };

  // Find current category of selected node type
  const getCurrentCategory = () => {
    if (!selectedNodeType) return "";
    const category = Object.keys(nodeTypes).find((key) =>
      nodeTypes[key].some((node) => node.name === selectedNodeType.name)
    );
    return category ? `${category}:${selectedNodeType.name}` : "";
  };

  return (
    <FormControl sx={{ minWidth: 150 }}>
      <Select
        value={getCurrentCategory()}
        onChange={handleNodeTypeChange}
        displayEmpty
      >
        {Object.entries(nodeTypes)
          .map(([category, nodes]) => [
            <ListSubheader key={category}>{category}</ListSubheader>,
            ...nodes.map((node) => (
              <MenuItem
                key={`${category}:${node.name}`}
                value={`${category}:${node.name}`}
              >
                {node.name}
              </MenuItem>
            )),
          ])
          .flat()}
      </Select>
    </FormControl>
  );
};

export default NodeSelect;
