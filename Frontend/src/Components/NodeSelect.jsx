import React, { useContext, useEffect } from "react";

import { FormControl, MenuItem, Select, ListSubheader } from "@mui/material";
import Average from "../NodeManager/NodeTypes/Math/AverageNode";
import Constant from "../NodeManager/NodeTypes/Math/ConstantNode";
import MinMax from "../NodeManager/NodeTypes/Math/MinMaxNode";
import GamepadAxisNode from "../NodeManager/NodeTypes/Inputs/GamePadNode";
import SinOscillator from "../NodeManager/NodeTypes/Oscillators/SinNode";
import createOSCBlueprint from "../NodeManager/NodeTypes/Outputs/OSCNode";
import SpaceNodeBlueprints from "../NodeManager/NodeTypes/Space/SpaceNodes"; // Import Space blueprints
import {
  clickGate,
  clickSwell,
  mouseWheel,
  MouseX,
  MouseY,
} from "../NodeManager/NodeTypes/Inputs/MouseNode";
import ParameterListContext from "../Context/ParameterContext";
import FlappyNode from "../NodeManager/NodeTypes/Games/FlappyNode";
const NodeSelect = ({ selectedNodeType, setSelectedNodeType }) => {
  const { parameters } = useContext(ParameterListContext);
  const [outputBlueprints, setOutputBlueprints] = React.useState([]);
  useEffect(() => {
    const blueprints = parameters.map((param) => {
      return {
        name: param.name,
        blueprint: createOSCBlueprint(param.id, param.name),
      };
    });
    setOutputBlueprints(blueprints);
  }, [parameters]);

  // Separate Space nodes based on type (input/output)
  const spaceInputNodes = Object.entries(SpaceNodeBlueprints)
    .filter(([key, bp]) => bp.type === "input")
    .map(([key, bp]) => ({ name: bp.label, blueprint: bp }));

  const spaceOutputNodes = Object.entries(SpaceNodeBlueprints)
    .filter(([key, bp]) => bp.type === "output")
    .map(([key, bp]) => ({ name: bp.label, blueprint: bp }));

  const nodeTypes = {
    Math: [
      { name: "Average", blueprint: Average },
      { name: "MinMax", blueprint: MinMax },
      { name: "Constant", blueprint: Constant },
    ],
    Inputs: [
      { name: "Mouse X", blueprint: MouseX },
      { name: "Mouse Y", blueprint: MouseY },
      { name: "Click Swell", blueprint: clickSwell },
      { name: "Click Gate", blueprint: clickGate },
      { name: "Mouse Wheel", blueprint: mouseWheel },
      { name: "GamePadAxis", blueprint: GamepadAxisNode },
    ],
    SpaceIn: [
      ...spaceInputNodes, // Add Space input nodes here
    ],
    SpaceOut: [
      ...spaceOutputNodes, // Add Space output nodes here
    ],
    Oscillators: [{ name: "Sine", blueprint: SinOscillator }],
    Games: [{ name: "FlappyBird", blueprint: FlappyNode }],
    OSCOutputs: [
      ...outputBlueprints, // Existing OSC outputs
    ],
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
