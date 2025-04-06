import React from "react";
import {
  Card,
  Typography,
  IconButton,
  Grid,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ParameterItem = ({
  param,
  index,
  setParameters,
  removeParameter,
  isLearning,
  learn,
}) => {
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
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2.5}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}
        >
          <span style={{ marginRight: 8 }}>🎛</span> Parameter {index + 1}
        </Typography>
        <IconButton
          onClick={() => removeParameter(index)}
          sx={{
            color: "rgba(255,80,80,0.8)",
            "&:hover": {
              color: "rgba(255,80,80,1)",
              backgroundColor: "rgba(255,80,80,0.1)",
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Controls */}
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={2}>
          <Select
            fullWidth
            variant="outlined"
            value={param.type}
            onChange={(e) => updateParameter("type", e.target.value)}
            sx={{
              backgroundColor: "rgba(0,0,0,0.2)",
              color: "white",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.2)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6f9eff",
              },
            }}
          >
            {[
              ["inst", "Instrument"],
              ["fx", "Effect Param"],
              ["vol", "Track Volume"],
              ["sendvol", "Send Volume"],
              ["pan", "Track Pan"],
              ["fxWet", "FX Wet/Dry"],
            ].map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <TextField
            fullWidth
            type="number"
            label="Track #"
            value={param.trackNum}
            onChange={(e) =>
              updateParameter("trackNum", Number(e.target.value))
            }
            InputLabelProps={{
              shrink: true,
              sx: { color: "rgba(255,255,255,0.7)" },
            }}
            InputProps={{ sx: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(0,0,0,0.2)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#6f9eff" },
              },
            }}
          />
        </Grid>

        {param.type !== "vol" && param.type !== "pan" && (
          <Grid item xs={6} sm={4} md={2}>
            <TextField
              fullWidth
              type="number"
              label={param.type === "sendvol" ? "Send #" : "FX #"}
              value={param.fxNum}
              onChange={(e) => updateParameter("fxNum", Number(e.target.value))}
              InputLabelProps={{
                shrink: true,
                sx: { color: "rgba(255,255,255,0.7)" },
              }}
              InputProps={{ sx: { color: "white" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&.Mui-focused fieldset": { borderColor: "#6f9eff" },
                },
              }}
            />
          </Grid>
        )}

        {(param.type === "inst" || param.type === "fx") && (
          <>
            <Grid item xs={6} sm={4} md={2}>
              <TextField
                fullWidth
                type="number"
                label="Param #"
                value={param.paramNum}
                onChange={(e) =>
                  updateParameter("paramNum", Number(e.target.value))
                }
                InputLabelProps={{
                  shrink: true,
                  sx: { color: "rgba(255,255,255,0.7)" },
                }}
                InputProps={{ sx: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(0,0,0,0.2)",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6f9eff" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Button
                fullWidth
                variant={isLearning ? "outlined" : "contained"}
                sx={{
                  height: "100%",
                  backgroundColor: isLearning
                    ? "transparent"
                    : "rgba(111, 158, 255, 0.8)",
                  borderColor: "rgba(111, 158, 255, 0.8)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: isLearning
                      ? "rgba(111, 158, 255, 0.1)"
                      : "rgba(111, 158, 255, 1)",
                  },
                }}
                onClick={async () => {
                  const result = await learn(param.trackNum, param.fxNum);
                  if (result) {
                    updateParameter("type", result.type);
                    updateParameter("trackNum", result.trackNum);
                    updateParameter("fxNum", result.fxNum);
                    updateParameter("paramNum", result.paramNum);
                  }
                }}
              >
                {isLearning ? "🧠 Listening..." : "🔍 Learn"}
              </Button>
            </Grid>
          </>
        )}

        <Grid item xs={6} sm={4} md={2}>
          <Select
            fullWidth
            value={param.controlType}
            onChange={(e) => updateParameter("controlType", e.target.value)}
            sx={{
              backgroundColor: "rgba(0,0,0,0.2)",
              color: "white",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.2)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6f9eff",
              },
            }}
          >
            {[
              ["mouse-x", "Mouse X"],
              ["mouse-y", "Mouse Y"],
              ["ball-x", "Ball X"],
              ["ball-y", "Ball Y"],
              ["click", "Mouse Click"],
              ["chaos", "Chaos"],
            ].map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {/* Range */}
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
          InputLabelProps={{
            shrink: true,
            sx: { color: "rgba(255,255,255,0.7)" },
          }}
          InputProps={{ sx: { color: "white" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(0,0,0,0.2)",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&.Mui-focused fieldset": { borderColor: "#6f9eff" },
            },
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
          InputLabelProps={{
            shrink: true,
            sx: { color: "rgba(255,255,255,0.7)" },
          }}
          InputProps={{ sx: { color: "white" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(0,0,0,0.2)",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&.Mui-focused fieldset": { borderColor: "#6f9eff" },
            },
          }}
        />
      </Box>
    </Card>
  );
};

export default ParameterItem;
