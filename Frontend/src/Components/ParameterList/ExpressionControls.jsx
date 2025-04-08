import { Box, TextField, Select, MenuItem, Typography } from "@mui/material";
import ValueMapper from "./ValueMapper/ValueMapper";

const ExpressionControls = ({ param, updateParameter, updateValueMap }) => {
  const controlOptions = [
    { value: "mouse-x", label: "Mouse X" },
    { value: "mouse-y", label: "Mouse Y" },
    { value: "ball-x", label: "Ball X" },
    { value: "ball-y", label: "Ball Y" },
    { value: "click", label: "Mouse Click" },
    { value: "chaos", label: "Chaos" },
  ];

  return (
    <Box
      sx={{
        mt: 4,
        mb: 2,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        padding: "16px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Expression Controls
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
          sx={{
            mb: 3,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {controlOptions.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Value Mapping - Ranges
      </Typography>
      <Box display="flex" gap={2}>
        <ValueMapper
          valueMap={param.valueMap}
          updateValueMap={updateValueMap}
        />
      </Box>
    </Box>
  );
};

export default ExpressionControls;
