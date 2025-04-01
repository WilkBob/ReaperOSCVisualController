import React from "react";
import {
  Grid,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Card,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ParameterItem = ({ param, index, setParameters, removeParameter }) => {
  const updateParameter = (field, value) => {
    setParameters((prev) => {
      const newParams = [...prev];
      newParams[index] = { ...newParams[index], [field]: value };
      return newParams;
    });
  };

  return (
    <Grid item xs={6}>
      <Card
        sx={{ padding: 1, display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Select
          value={param.type}
          onChange={(e) => updateParameter("type", e.target.value)}
          fullWidth
        >
          {["inst", "fx", "vol", "sendvol", "pan"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <TextField
          type="number"
          label="Track #"
          value={param.trackNum}
          onChange={(e) => updateParameter("trackNum", Number(e.target.value))}
          fullWidth
        />
        <TextField
          type="number"
          label="FX #"
          value={param.fxNum}
          onChange={(e) => updateParameter("fxNum", Number(e.target.value))}
          fullWidth
        />
        <TextField
          type="number"
          label="Param #"
          value={param.paramNum}
          onChange={(e) => updateParameter("paramNum", Number(e.target.value))}
          fullWidth
        />
        <Select
          value={param.controlType}
          onChange={(e) => updateParameter("controlType", e.target.value)}
          fullWidth
        >
          {["mouse-x", "mouse-y"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <IconButton onClick={() => removeParameter(index)} color="error">
          <DeleteIcon />
        </IconButton>
      </Card>
    </Grid>
  );
};

export default ParameterItem;
