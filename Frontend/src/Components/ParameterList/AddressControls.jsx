import { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
  Button,
  Tooltip,
} from "@mui/material";
import PianoIcon from "@mui/icons-material/Piano";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import PercentIcon from "@mui/icons-material/Percent";
import ErrorIcon from "@mui/icons-material/Error";
import LearnButton from "./LearnButton";

import {
  createOSCAddress,
  extractParametersFromAddress,
} from "../../API/oscService";

const AddressControls = ({ address, updateAddress, index }) => {
  const [type, setType] = useState("inst");
  const [trackNum, setTrackNum] = useState(1);
  const [fxNum, setFxNum] = useState(1);
  const [paramNum, setParamNum] = useState(1);
  const [customAddress, setCustomAddress] = useState("");
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const { type, trackNum, fxNum, paramNum } =
      extractParametersFromAddress(address);
    if (!type) setType("custom");
    setType(type);
    setTrackNum(trackNum);
    setFxNum(fxNum || 1);
    setParamNum(paramNum || 1);
  }, [address]);

  const handleEdit = () => {
    setEdited(true);
  };

  const saveChanges = () => {
    if (!edited) return;
    if (type === "custom") {
      setTrackNum(0);
      setFxNum(0);
      setParamNum(0);
      updateAddress(customAddress);
      setEdited(false);
      return;
    }

    const newAddress = createOSCAddress({
      type,
      trackNum,
      fxNum,
      paramNum,
    });
    updateAddress(newAddress);
    setEdited(false);
  };

  const parameterTypes = [
    ["inst", "Instrument", <PianoIcon fontSize="small" />],
    ["fx", "Effect Param", <PercentIcon fontSize="small" />],
    ["vol", "Track Volume", <VolumeUpIcon fontSize="small" />],
    ["sendvol", "Send Volume", <VolumeUpIcon fontSize="small" />],
    ["pan", "Track Pan", <SyncAltIcon fontSize="small" />],
    ["fxWet", "FX Wet/Dry", <PercentIcon fontSize="small" />],
    ["custom", "Custom", <ErrorIcon fontSize="small" />],
  ];

  return (
    <Grid
      sx={{
        backgroundColor: edited ? "rgba(255, 94, 94, 0.16)" : "transparent",
        width: "100%",
        p: 2,
        borderRadius: 2,
      }}
    >
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
          {address}
        </Typography>{" "}
        {edited && (
          <Button
            variant="contained"
            color="primary"
            onClick={saveChanges}
            sx={{ ml: 2 }}
          >
            Save Changes
          </Button>
        )}
      </Typography>

      <Grid container spacing={2}>
        <Grid>
          <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
            Parameter Type
          </Typography>
          <Select
            size="small"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              handleEdit();
            }}
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
        {type !== "custom" && (
          <Grid>
            <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
              Track #
            </Typography>
            <TextField
              size="small"
              type="number"
              value={trackNum}
              onChange={(e) => {
                setTrackNum(Number(e.target.value));
                handleEdit();
              }}
              sx={{ width: "100%" }}
            />
          </Grid>
        )}
        {type !== "vol" && type !== "pan" && type !== "custom" && (
          <Grid>
            <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
              {type === "sendvol" ? "Send #" : "FX #"}
            </Typography>
            <TextField
              size="small"
              type="number"
              value={fxNum}
              onChange={(e) => {
                setFxNum(Number(e.target.value));
                handleEdit();
              }}
              sx={{ width: "100%" }}
            />
          </Grid>
        )}

        {(type === "inst" || type === "fx") && (
          <Grid>
            <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
              Param #
            </Typography>
            <TextField
              size="small"
              type="number"
              value={paramNum}
              onChange={(e) => {
                setParamNum(Number(e.target.value));
                handleEdit();
              }}
              sx={{ width: "100%" }}
            />
          </Grid>
        )}

        {(type === "inst" || type === "fx") && (
          <Grid>
            <LearnButton
              index={index}
              param={{
                type,
                trackNum,
                fxNum,
                paramNum,
              }}
              setParamNum={setParamNum}
            />
          </Grid>
        )}

        {type === "custom" && (
          <TextField
            fullWidth
            label="Custom Address"
            placeholder="/example/custom/address"
            slotProps={{
              input: {
                endAdornment: (
                  <Tooltip
                    title="WARNING: Custom addresses are not validated"
                    arrow
                  >
                    <ErrorIcon color="warning" />
                  </Tooltip>
                ),
              },
            }}
            size="small"
            value={customAddress}
            onChange={(e) => {
              setCustomAddress(e.target.value);
              handleEdit();
            }}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default AddressControls;
