import { Box, ButtonGroup, Typography } from "@mui/material";
import ValueMapper from "./ValueMapper/ValueMapper";
import { useState } from "react";
import ClosedMapper from "./ValueMapper/ClosedMapper";

import { DEFAULT_SETTINGS } from "../controls/Settings/DefaultSettings";
import ExpressionSelect from "./ExpressionSelect";
const ExpressionControls = ({
  param,
  updateParameter,
  updateValueMap,
  visualizer,
}) => {
  const controlOptions = [
    {
      id: "mouse-x",
      name: "Mouse X",
      description: "Mouse X position",
      behavior: "linear",
    },
    {
      id: "mouse-y",
      name: "Mouse Y",
      description: "Mouse Y position",
      behavior: "linear",
    },
    {
      id: "click",
      name: "Mouse Click",
      description: "Whether Mouse is Clicked (0 or 1)",
      behavior: "gate",
    },
  ];
  console.log(visualizer, DEFAULT_SETTINGS[visualizer.id]);
  const [mapperOpen, setMapperOpen] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        gap: 2,
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 0.5, display: "flex", alignItems: "center" }}
      >
        Expression Controls{" "}
        <Typography variant="caption" sx={{ ml: 1 }}>
          - Chosen control value will be interpreted according to the gradient
          (lighter color = higher value)
        </Typography>
      </Typography>
      <ButtonGroup fullWidth size="small">
        {controlOptions.map(({ id, name, description, behavior }) => (
          <ExpressionSelect
            id={id}
            name={name}
            description={description}
            behavior={behavior}
            param={param}
            updateParameter={updateParameter}
          />
        ))}

        {DEFAULT_SETTINGS[visualizer.id].controls.map((control) => (
          <ExpressionSelect
            id={control.id}
            name={control.name}
            description={control.description}
            behavior={control.behavior}
            param={param}
            updateParameter={updateParameter}
          />
        ))}
      </ButtonGroup>

      <Box display="flex" sx={{ width: "100%", height: "100%" }}>
        {mapperOpen ? (
          <ValueMapper
            valueMap={param.valueMap}
            updateValueMap={updateValueMap}
            closeMapper={() => setMapperOpen(false)}
          />
        ) : (
          <ClosedMapper
            valueMap={param.valueMap}
            setMapperOpen={setMapperOpen}
          />
        )}
      </Box>
    </Box>
  );
};

export default ExpressionControls;
