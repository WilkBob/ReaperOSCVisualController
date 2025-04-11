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
import ProfileMenu from "./ProfileMenu";
import { useContext, useEffect } from "react";
import ParameterListContext from "../../Context/ParameterContext";

const ParameterList = ({ drawerOpen, setDrawerOpen }) => {
  const { parameters, setParameters } = useContext(ParameterListContext);

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
    if (parameters.length < 10) {
      setParameters([
        ...parameters,
        {
          name: "New Parameter",
          address: `/track/${parameters.length + 1}/volume`,

          valueMap: {
            enabled: true,
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
        color="white"
        sx={{ zIndex: 1000 }}
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

        <Divider />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}>
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
          disabled={parameters.length >= 10}
          variant="contained"
          startIcon={<AddCircleIcon />}
        >
          Add Parameter {parameters.length}/10
        </Button>
      </Drawer>
    </>
  );
};

export default ParameterList;
