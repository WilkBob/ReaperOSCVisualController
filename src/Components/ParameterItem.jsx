import React from "react";
import {
  Grid,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Card,
  Typography,
  Box,
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

  const updateRange = (key, value) => {
    setParameters((prev) => {
      const newParams = [...prev];
      newParams[index] = {
        ...newParams[index],
        range: { ...newParams[index].range, [key]: value },
      };
      return newParams;
    });
  };

  return (
    <Grid item xs={12} sm={6}>
      <Card
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#ffffff11",
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" color="white">
            Parameter {index + 1}
          </Typography>
          <IconButton onClick={() => removeParameter(index)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
        <Select
          value={param.type}
          onChange={(e) => updateParameter("type", e.target.value)}
          fullWidth
          sx={{
            backgroundColor: "#2e2e2e",
            color: "white",
            "& .MuiSelect-icon": { color: "white" },
          }}
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
          InputProps={{
            style: { color: "white" },
          }}
          InputLabelProps={{
            style: { color: "gray" },
          }}
          sx={{ backgroundColor: "#2e2e2e", borderRadius: 1 }}
        />
        <TextField
          type="number"
          label="FX #"
          value={param.fxNum}
          onChange={(e) => updateParameter("fxNum", Number(e.target.value))}
          fullWidth
          InputProps={{
            style: { color: "white" },
          }}
          InputLabelProps={{
            style: { color: "gray" },
          }}
          sx={{ backgroundColor: "#2e2e2e", borderRadius: 1 }}
        />
        <TextField
          type="number"
          label="Param #"
          value={param.paramNum}
          onChange={(e) => updateParameter("paramNum", Number(e.target.value))}
          fullWidth
          InputProps={{
            style: { color: "white" },
          }}
          InputLabelProps={{
            style: { color: "gray" },
          }}
          sx={{ backgroundColor: "#2e2e2e", borderRadius: 1 }}
        />
        <Select
          value={param.controlType}
          onChange={(e) => updateParameter("controlType", e.target.value)}
          fullWidth
          sx={{
            backgroundColor: "#2e2e2e",
            color: "white",
            "& .MuiSelect-icon": { color: "white" },
          }}
        >
          {["mouse-x", "mouse-y", "ball"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <TextField
            type="number"
            label="Min Range"
            value={param.range?.min || 0}
            onChange={(e) => updateRange("min", Number(e.target.value))}
            fullWidth
            InputProps={{
              style: { color: "white" },
            }}
            InputLabelProps={{
              style: { color: "gray" },
            }}
            sx={{ backgroundColor: "#2e2e2e", borderRadius: 1 }}
          />
          <TextField
            type="number"
            label="Max Range"
            value={param.range?.max || 1}
            onChange={(e) => updateRange("max", Number(e.target.value))}
            fullWidth
            InputProps={{
              style: { color: "white" },
            }}
            InputLabelProps={{
              style: { color: "gray" },
            }}
            sx={{ backgroundColor: "#2e2e2e", borderRadius: 1 }}
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default ParameterItem;
