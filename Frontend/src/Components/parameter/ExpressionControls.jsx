import { Box, TextField, Select, MenuItem, Typography } from "@mui/material";

const ExpressionControls = ({ param, updateRange, updateParameter }) => {
  const controlOptions = [
    { value: "mouse-x", label: "Mouse X" },
    { value: "mouse-y", label: "Mouse Y" },
    { value: "ball-x", label: "Ball X" },
    { value: "ball-y", label: "Ball Y" },
    { value: "click", label: "Mouse Click" },
    { value: "chaos", label: "Chaos" },
  ];

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Parameter Controls
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Control Type
        </Typography>
        <Select
          fullWidth
          size="small"
          value={param.controlType}
          onChange={(e) => updateParameter("controlType", e.target.value)}
          sx={{ mb: 3 }}
        >
          {controlOptions.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Range Limits
      </Typography>
      <Box display="flex" gap={2}>
        <TextField
          size="small"
          type="number"
          label="Min Range"
          value={param.range?.min ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? "" : Number(e.target.value);
            updateRange("min", value);
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          size="small"
          type="number"
          label="Max Range"
          value={param.range?.max ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? "" : Number(e.target.value);
            updateRange("max", value);
          }}
          sx={{ flex: 1 }}
        />
      </Box>
    </Box>
  );
};

export default ExpressionControls;
