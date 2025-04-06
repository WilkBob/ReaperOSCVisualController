import React, { useState } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import useLearnParam from "./useLearnParam";

const ParameterItem = ({ param, index, setParameters, removeParameter }) => {
  const [editName, setEditName] = useState(false);
  const { isLearning, learn } = useLearnParam();
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
        {editName ? (
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              value={param.name || ""}
              onChange={(e) => updateParameter("name", e.target.value)}
              variant="outlined"
              size="small"
            />
            <IconButton
              onClick={() => setEditName(false)}
              sx={{
                color: "rgba(111, 158, 255, 0.8)",
                "&:hover": {
                  color: "rgba(111, 158, 255, 1)",
                  backgroundColor: "rgba(111, 158, 255, 0.1)",
                },
              }}
            >
              <SaveIcon />
            </IconButton>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}
            >
              <span style={{ marginRight: 8 }}>🎛</span>{" "}
              {param.name || `Parameter ${index + 1}`}
            </Typography>
            <IconButton onClick={() => setEditName(true)}>
              <EditIcon />
            </IconButton>
          </Box>
        )}
        <IconButton onClick={() => removeParameter(index)} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Controls */}
      <Grid container spacing={2}>
        <Grid>
          <Select
            fullWidth
            variant="outlined"
            value={param.type}
            onChange={(e) => updateParameter("type", e.target.value)}
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

        <Grid>
          <TextField
            fullWidth
            type="number"
            label="Track #"
            value={param.trackNum}
            onChange={(e) =>
              updateParameter("trackNum", Number(e.target.value))
            }
          />
        </Grid>

        {param.type !== "vol" && param.type !== "pan" && (
          <Grid>
            <TextField
              fullWidth
              type="number"
              label={param.type === "sendvol" ? "Send #" : "FX #"}
              value={param.fxNum}
              onChange={(e) => updateParameter("fxNum", Number(e.target.value))}
            />
          </Grid>
        )}

        {(param.type === "inst" || param.type === "fx") && (
          <>
            <Grid>
              <TextField
                fullWidth
                type="number"
                label="Param #"
                value={param.paramNum}
                onChange={(e) =>
                  updateParameter("paramNum", Number(e.target.value))
                }
              />
            </Grid>
            <Grid>
              <Button
                fullWidth
                variant={isLearning ? "outlined" : "contained"}
                color={isLearning ? "warning" : "secondary"}
                sx={{
                  height: "100%",
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

        <Grid>
          <Select
            fullWidth
            value={param.controlType}
            onChange={(e) => updateParameter("controlType", e.target.value)}
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
    </Card>
  );
};

export default ParameterItem;
