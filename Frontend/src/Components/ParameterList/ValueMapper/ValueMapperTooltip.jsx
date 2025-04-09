import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const ValueMapperTooltip = ({ children }) => {
  return (
    <Tooltip
      arrow
      placement="top"
      title={
        <Box sx={{ maxWidth: 250, p: 1 }}>
          <Typography variant="h6" gutterBottom>
            🎛️ How to Use the Value Mapper
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              👉 Drag a stop to adjust its value.
            </Typography>
            <Typography variant="body2">
              🖱️ Double-click anywhere to add a new stop.
            </Typography>
            <Typography variant="body2">
              ➕ Press <b>+</b> to insert a stop between selected ones.
            </Typography>
            <Typography variant="body2">
              🗑️ Press <b>Delete</b> or <b>Backspace</b> to remove a stop.
            </Typography>
          </Stack>
        </Box>
      }
    >
      {children}
    </Tooltip>
  );
};

export default ValueMapperTooltip;
