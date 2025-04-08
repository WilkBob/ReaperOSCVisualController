import React from "react";
import { Box, TextField } from "@mui/material";

const ParameterRange = ({ param, updateRange }) => {
  return (
    <Box mt={3} display="flex" gap={2}>
      <TextField
        fullWidth
        type="number"
        label="Min Range"
        value={param.range?.min ?? ""}
        onChange={(e) => {
          const value = e.target.value === "" ? "" : Number(e.target.value);
          updateRange("min", value);
        }}
      />
      <TextField
        fullWidth
        type="number"
        label="Max Range"
        value={param.range?.max ?? ""}
        onChange={(e) => {
          const value = e.target.value === "" ? "" : Number(e.target.value);
          updateRange("max", value);
        }}
      />
    </Box>
  );
};

export default ParameterRange;
