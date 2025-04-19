import { useState } from "react";
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
  const [localName, setLocalName] = useState(param.name || "");

  // Prevent click events from bubbling up to the Drawer
  const handleTextFieldClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      {editName ? (
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onClick={handleTextFieldClick}
            onMouseDown={handleTextFieldClick}
            variant="outlined"
            size="small"
            autoFocus
          />
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setEditName(false);
              updateParameter("name", localName);
            }}
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
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setEditName(true);
              setLocalName(param.name || "");
            }}
          >
            <EditIcon />
          </IconButton>
        </Box>
      )}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          removeParameter(index);
        }}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default ParameterHeader;
