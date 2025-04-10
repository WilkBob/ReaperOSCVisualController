import React from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import PianoIcon from "@mui/icons-material/Piano";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import PercentIcon from "@mui/icons-material/Percent";

import LearnButton from "./LearnButton";

import { createOSCAddress } from "../../API/oscService";
import ExpressionControls from "./ExpressionControls";

const AddressControls = ({ param, updateParameter, updateValueMap }) => {
  const parameterTypes = [
    ["inst", "Instrument", <PianoIcon fontSize="small" />],
    ["fx", "Effect Param", <PercentIcon fontSize="small" />],
    ["vol", "Track Volume", <VolumeUpIcon fontSize="small" />],
    ["sendvol", "Send Volume", <VolumeUpIcon fontSize="small" />],
    ["pan", "Track Pan", <SyncAltIcon fontSize="small" />],
    ["fxWet", "FX Wet/Dry", <PercentIcon fontSize="small" />],
  ];

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid>
        <Typography
          variant="h5"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            mb: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          Address Controls{" "}
          <Typography sx={{ ml: 1 }} variant="caption">
            - {"OSC Address: "}
            {createOSCAddress(param)}
          </Typography>
        </Typography>

        <Grid container spacing={2}>
          <Grid>
            <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
              Parameter Type
            </Typography>
            <Select
              size="small"
              value={param.type}
              onChange={(e) => updateParameter("type", e.target.value)}
              sx={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              renderValue={(selected) => {
                const selectedType = parameterTypes.find(
                  ([value]) => value === selected
                );
                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {selectedType[2]}
                    <Typography variant="body2">{selectedType[1]}</Typography>
                  </Box>
                );
              }}
            >
              {parameterTypes.map(([value, label, icon]) => (
                <MenuItem key={value} value={value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {icon}
                    {label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid>
            <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
              Track #
            </Typography>
            <TextField
              size="small"
              type="number"
              value={param.trackNum}
              onChange={(e) =>
                updateParameter("trackNum", Number(e.target.value))
              }
              sx={{ width: "100%" }}
            />
          </Grid>

          {param.type !== "vol" && param.type !== "pan" && (
            <Grid>
              <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
                {param.type === "sendvol" ? "Send #" : "FX #"}
              </Typography>
              <TextField
                size="small"
                type="number"
                value={param.fxNum}
                onChange={(e) =>
                  updateParameter("fxNum", Number(e.target.value))
                }
                sx={{ width: "100%" }}
              />
            </Grid>
          )}

          {(param.type === "inst" || param.type === "fx") && (
            <Grid>
              <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
                Param #
              </Typography>
              <TextField
                size="small"
                type="number"
                value={param.paramNum}
                onChange={(e) =>
                  updateParameter("paramNum", Number(e.target.value))
                }
                sx={{ width: "100%" }}
              />
            </Grid>
          )}

          {(param.type === "inst" || param.type === "fx") && (
            <Grid>
              <LearnButton param={param} updateParameter={updateParameter} />
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid size={12}>
        <ExpressionControls
          param={param}
          updateValueMap={updateValueMap}
          updateParameter={updateParameter}
        />
      </Grid>
    </Grid>
  );
};

export default AddressControls;
