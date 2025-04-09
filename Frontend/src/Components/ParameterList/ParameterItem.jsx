import React from "react";
import { Box, Card, Divider } from "@mui/material";
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
        px: 2,
        py: 1,
        backgroundColor: "rgba(28, 35, 41, 0.35)",
        color: "white",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        transition: "all 0.2s ease",
        "&:hover": {
          border: "1px solid rgba(255,255,255,0.3)",
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
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 1 }} />
      <Box sx={{ display: "flex", gap: 2, mb: 2, width: "100%" }}>
        <AddressControls
          param={param}
          updateParameter={updateParameter}
          updateValueMap={updateValueMap}
        />
      </Box>
    </Card>
  );
};

export default ParameterItem;
