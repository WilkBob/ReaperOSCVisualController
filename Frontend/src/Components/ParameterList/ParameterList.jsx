import {
  Drawer,
  IconButton,
  Typography,
  Button,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import ParameterItem from "./ParameterItem";
import ProfileMenu from "../ProfileMenu";
import { useEffect } from "react";

const ParameterList = ({
  parameters,
  setParameters,
  drawerOpen,
  setDrawerOpen,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "p") {
        setDrawerOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setDrawerOpen]);

  const addParameter = () => {
    if (parameters.length < 5) {
      setParameters([
        ...parameters,
        {
          name: "New Parameter",
          type: "inst",
          trackNum: 1,
          fxNum: 1,
          paramNum: 2,
          controlType: "mouse-x",
          valueMap: {
            stops: [
              { x: 0.0, y: 0.0 },
              { x: 1.0, y: 1.0 },
            ],
            interpolate: true,
            invert: false,
          },
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
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          color: "white",
          backgroundColor: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(5px)",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backdropFilter: "blur(15px)",
            backgroundColor: "rgba(20, 20, 20, 0.85)",
            padding: 3,
            paddingBottom: 4,
            width: "100%",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: 10, fontSize: "1.4rem" }}>🎛</span>{" "}
            Parameters
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <ProfileMenu
              parameters={parameters}
              setParameters={setParameters}
            />

            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{
                color: "rgba(255,255,255,0.7)",
                "&:hover": {
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
          {parameters.map((param, index) => (
            <ParameterItem
              param={param}
              index={index}
              setParameters={setParameters}
              removeParameter={removeParameter}
              key={index} // Ensure unique key for each item
            />
          ))}
        </Box>

        <Button
          onClick={addParameter}
          disabled={parameters.length >= 5}
          variant="contained"
          startIcon={<AddCircleIcon />}
        >
          Add Parameter {parameters.length}/5
        </Button>
      </Drawer>
    </>
  );
};

export default ParameterList;
