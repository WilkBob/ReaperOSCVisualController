import React from "react";
import { Card } from "@mui/material";
import ParameterHeader from "./ParameterHeader";
import AddressControls from "./AddressControls";

import ExpressionControls from "./ExpressionControls";

const ParameterItem = ({ param, index, setParameters, removeParameter }) => {
  const updateParameter = (key, value) => {
    setParameters((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [key]: value } : p))
    );
  };

  const updateValueMap = (valueMap) => {
    setParameters((prev) =>
      prev.map((p, i) => (i === index ? { ...p, valueMap } : p))
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
          backgroundColor: "rgba(42, 42, 42, 0.7)",
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

      <AddressControls param={param} updateParameter={updateParameter} />

      <ExpressionControls
        param={param}
        updateValueMap={updateValueMap}
        updateParameter={updateParameter}
      />
    </Card>
  );
};

export default ParameterItem;
