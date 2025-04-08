import React from "react";
import { Card, Box, Grid } from "@mui/material";
import ParameterHeader from "./ParameterHeader";
import ParameterControls from "./ParameterControls";
import ParameterRange from "./ParameterRange";

const ParameterItem = ({ param, index, setParameters, removeParameter }) => {
  const updateParameter = (key, value) => {
    setParameters((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [key]: value } : p))
    );
  };

  const updateRange = (key, value) => {
    setParameters((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, range: { ...p.range, [key]: value } } : p
      )
    );
  };

  return (
    <Card
      sx={{
        p: 3,
        mb: 2,
        backgroundColor: "rgba(30, 30, 30, 0.9)",
        color: "white",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(42, 42, 42, 0.9)",
          transform: "translateY(-2px)",
        },
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <ParameterHeader
        param={param}
        index={index}
        updateParameter={updateParameter}
        removeParameter={removeParameter}
      />
      <Grid container spacing={2}>
        <ParameterControls param={param} updateParameter={updateParameter} />
      </Grid>
      <ParameterRange param={param} updateRange={updateRange} />
    </Card>
  );
};

export default ParameterItem;
