import React, { useState } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const ParameterHeader = ({
  param,
  index,
  updateParameter,
  removeParameter,
}) => {
  const [editName, setEditName] = useState(false);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
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
  );
};

export default ParameterHeader;
