import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ParameterItem from "./ParameterItem";
import ProfileMenu from "./ProfileMenu";

const ParameterList = ({ parameters, setParameters }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addParameter = () => {
    if (parameters.length < 5) {
      setParameters([
        ...parameters,
        {
          type: "inst",
          trackNum: 1,
          fxNum: 1,
          paramNum: 2,
          controlType: "mouse-x",
          range: { min: 0, max: 1 },
        },
      ]);
    }
  };

  const removeParameter = (index) => {
    if (parameters.length > 1) {
      setParameters(parameters.filter((_, i) => i !== index));
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{ position: "absolute", top: 16, left: 16, color: "white" }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: 2,
            width: "100%",
          },
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant="h6" sx={{ color: "white", flexGrow: 1 }}>
            Parameters
          </Typography>
          <ProfileMenu parameters={parameters} setParameters={setParameters} />
        </Box>

        <List>
          <Grid container spacing={1}>
            {parameters.map((param, index) => (
              <ParameterItem
                key={index}
                param={param}
                index={index}
                setParameters={setParameters}
                removeParameter={removeParameter}
              />
            ))}
          </Grid>
        </List>

        <Button
          onClick={addParameter}
          disabled={parameters.length >= 5}
          fullWidth
        >
          Add Parameter
        </Button>
      </Drawer>
    </>
  );
};

export default ParameterList;
