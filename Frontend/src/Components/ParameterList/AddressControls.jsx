import React from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import LearnButton from "./LearnButton";
import { createOSCAddress } from "../../API/oscService";

const AddressControls = ({ param, updateParameter }) => {
  const parameterTypes = [
    ["inst", "Instrument"],
    ["fx", "Effect Param"],
    ["vol", "Track Volume"],
    ["sendvol", "Send Volume"],
    ["pan", "Track Pan"],
    ["fxWet", "FX Wet/Dry"],
  ];

  return (
    <Box
      sx={{
        mb: 3,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        padding: "16px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color: "rgba(255, 255, 255, 0.8)",
          mb: 2,
          textTransform: "uppercase",
        }}
      >
        Address Controls{" "}
        <Tooltip
          title={`Choose a signal destination for the parameter. Current: ${createOSCAddress(
            param
          )}`}
        >
          <span style={{ fontSize: "0.8rem" }}>ℹ️</span>
        </Tooltip>
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ minWidth: 180 }}>
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
          >
            {parameterTypes.map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", md: "block" } }}
        />

        <Box sx={{ minWidth: 100 }}>
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
        </Box>

        {param.type !== "vol" && param.type !== "pan" && (
          <Box sx={{ minWidth: 100 }}>
            <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
              {param.type === "sendvol" ? "Send #" : "FX #"}
            </Typography>
            <TextField
              size="small"
              type="number"
              value={param.fxNum}
              onChange={(e) => updateParameter("fxNum", Number(e.target.value))}
              sx={{ width: "100%" }}
            />
          </Box>
        )}

        {(param.type === "inst" || param.type === "fx") && (
          <>
            <Box sx={{ minWidth: 100 }}>
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
              />
            </Box>

            <LearnButton param={param} updateParameter={updateParameter} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default AddressControls;
