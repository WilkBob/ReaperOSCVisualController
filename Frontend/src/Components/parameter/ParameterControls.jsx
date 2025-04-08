import React from "react";
import { Grid, Select, MenuItem, TextField, Button } from "@mui/material";
import LearnButton from "./LearnButton";
import useLearnParam from "../useLearnParam";

const ParameterControls = ({ param, updateParameter }) => {
  const { isLearning, learn } = useLearnParam();
  return (
    <>
      <Grid item xs={12} sm={6}>
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

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label="Track #"
          value={param.trackNum}
          onChange={(e) => updateParameter("trackNum", Number(e.target.value))}
        />
      </Grid>

      {param.type !== "vol" && param.type !== "pan" && (
        <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
          <LearnButton
            learn={learn}
            param={param}
            updateParameter={updateParameter}
            isLearning={isLearning}
          />
          /
        </>
      )}
    </>
  );
};

export default ParameterControls;
