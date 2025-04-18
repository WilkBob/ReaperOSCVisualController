import React, { useEffect } from "react";

import { FormControl, MenuItem, Select, ListSubheader } from "@mui/material";
import Average from "../NodeManager/NodeTypes/Math/AverageNode";
import Constant from "../NodeManager/NodeTypes/Math/ConstantNode";
import MinMax from "../NodeManager/NodeTypes/Math/MinMaxNode";
import GamepadAxisNode from "../NodeManager/NodeTypes/Inputs/GamePadNode";
import SinOscillator from "../NodeManager/NodeTypes/Oscillators/SinNode";
import { MouseX } from "../NodeManager/NodeTypes/Inputs/MouseNode";
const NodeSelect = ({ selectedNodeType, setSelectedNodeType }) => {
  const nodeTypes = {
    Math: [
      { name: "Average", blueprint: Average },
      { name: "MinMax", blueprint: MinMax },

      { name: "Constant", blueprint: Constant },
    ],
    Inputs: [
      { name: "Mouse", blueprint: MouseX },
      { name: "GamePadAxis", blueprint: GamepadAxisNode },
    ],
    Oscillators: [{ name: "Sine", blueprint: SinOscillator }],
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
