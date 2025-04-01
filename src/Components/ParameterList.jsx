import React from "react";
import {
  Drawer,
  IconButton,
  List,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ParameterItem from "./ParameterItem";

const ParameterList = ({ parameters, setParameters }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const addParameter = () => {
    if (parameters.length < 4) {
      setParameters([
        ...parameters,
        {
          type: "inst",
          trackNum: 1,
          fxNum: 1,
          paramNum: 2,
          controlType: "mouse-x",
        },
      ]);
    }
  };

  const removeParameter = (index) => {
    if (parameters.length > 1) {
      const newParams = parameters.filter((_, i) => i !== index);
      setParameters(newParams);
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
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: 2,
            width: 300,
          },
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Parameters
        </Typography>
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
          disabled={parameters.length >= 4}
          fullWidth
        >
          Add Parameter
        </Button>
      </Drawer>
    </>
  );
};

export default ParameterList;
