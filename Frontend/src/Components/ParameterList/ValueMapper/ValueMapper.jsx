import { useCallback, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RemoveIcon from "@mui/icons-material/Remove";
import QuestionMark from "@mui/icons-material/QuestionMark";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import MapCanvas from "./MapCanvas";
import useCanvasMouse from "./useCanvasMouse";
import ValueMapperTooltip from "./ValueMapperTooltip";

const ValueMapper = ({ valueMap, updateValueMap, closeMapper }) => {
  const canvasRef = useRef(null);
  const stopsRef = useRef([...valueMap.stops]);

  const { mousePosRef, clickedRef } = useCanvasMouse(canvasRef);
  const controllerRef = useRef(null);
  const setMapFromRef = useCallback(() => {
    // Ensure stops are sorted by x value and round x, y to 2 decimal places
    const stops = stopsRef.current
      .map((stop) => ({
        x: Math.round(stop.x * 100) / 100,
        y: Math.round(stop.y * 100) / 100,
      }))
      .sort((a, b) => a.x - b.x);

    //console.log("Rounded Stops:", stops); // Debug log
    updateValueMap({ ...valueMap, stops: [...stops] });
    closeMapper(); // Close the mapper after saving
  }, [valueMap, updateValueMap, closeMapper]);
  const setInterpolate = (e) => {
    const newValueMap = { ...valueMap, interpolate: e.target.checked };
    updateValueMap(newValueMap);
  };
  const setInvert = (e) => {
    const newValueMap = { ...valueMap, invert: e.target.checked };
    updateValueMap(newValueMap);
  };

  const setActive = (active) => {
    const newValueMap = { ...valueMap, enabled: active };
    updateValueMap(newValueMap);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const controller = new MapCanvas(
      canvas,
      ctx,
      canvas.width,
      canvas.height,
      mousePosRef,
      clickedRef,
      stopsRef,
      valueMap.interpolate,
      valueMap.invert
    );
    // const drawTrackingInfo = (ctx, mousePos) => {
    //   ctx.fillStyle = "black";
    //   ctx.font = "12px Arial";
    //   ctx.fillText(`Mouse X: ${mousePos.x}`, 10, 20);
    //   ctx.fillText(`Mouse Y: ${mousePos.y}`, 10, 40);
    //   ctx.fillText(`Clicked: ${clickedRef.current}`, 10, 60);
    //   // draw mapref's stops xy pairs
    //   ctx.fillText("Stops (ref):", 10, 80);
    //   stopsRef.current.forEach((stop, index) => {
    //     ctx.fillText(
    //       `Stop ${index}: (${stop.x}, ${stop.y})`,
    //       10,
    //       100 + index * 20
    //     );
    //   });
    // };
    controllerRef.current = controller; // Store the controller reference
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      controller.onResize(); // Optionally pass new width/height if needed
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("keydown", controller.handleKeyDown);
    canvas.addEventListener("dblclick", controller.handleDoubleClick);
    canvas.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        setMapFromRef();
      }
    });

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      controller.update();
      // drawTrackingInfo(ctx, mousePosRef.current);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("keydown", controller.handleKeyDown);
      canvas.removeEventListener("dblclick", controller.handleDoubleClick);
      cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    };
  }, [mousePosRef, clickedRef, valueMap, setMapFromRef]);

  const actions = [
    {
      title: "Delete Stop",
      icon: <RemoveIcon />,
      onClick: () => controllerRef.current.deleteSelectedStop(),
    },
    {
      title: "Add Stop",
      icon: <AddIcon />,
      onClick: () => {
        if (stopsRef.current.some((stop) => stop.x === 0.5)) {
          return; // Stop already exists at (0.5, 0.5)
        }
        controllerRef.current.addStopAtPosition(0.5, 0.5); // Add a stop at the center of the canvas
      },
    },
    {
      title: "Save Map",
      icon: <SaveIcon />,
      onClick: setMapFromRef,
    },
    {
      title: "Discard Changes",
      icon: <CloseIcon color="error" />,
      onClick: closeMapper,
    },
    {
      title: "Reset to Default",
      icon: <RefreshIcon />,
      onClick: () => {
        controllerRef.current.reset();
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 1, flexWrap: "wrap" }}>
        <Typography variant="h5" sx={{ display: "flex", alignItems: "center" }}>
          <Switch
            component={"span"}
            checked={valueMap.enabled}
            onChange={(e) => setActive(e.target.checked)}
            color="primary"
          />
          Value Mapper
        </Typography>
        <Tooltip
          enterDelay={1000}
          title="Whether the value smoothly or sharply
          transitions between stops - Off is useful for gates."
          arrow
        >
          <FormControlLabel
            control={
              <Switch
                checked={valueMap.interpolate}
                onChange={setInterpolate}
                color="primary"
                disabled={!valueMap.enabled}
              />
            }
            label="Interpolate:"
            labelPlacement="start"
          />
        </Tooltip>

        <Tooltip
          enterDelay={1000}
          title="Whether the gradient is inverted - switches the diretion of the gradient."
          arrow
        >
          <FormControlLabel
            control={
              <Switch
                checked={valueMap.invert}
                onChange={setInvert}
                color="primary"
                disabled={!valueMap.enabled}
              />
            }
            label="Invert:"
            labelPlacement="start"
          />
        </Tooltip>

        <Divider orientation="vertical" flexItem />
        {/* ACTIONS */}
        {actions.map((action, index) => (
          <>
            <Tooltip
              key={index + action.title}
              enterDelay={1000}
              title={action.title}
              arrow
            >
              <IconButton
                onClick={action.onClick}
                style={{}}
                disabled={!valueMap.enabled}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
            {index < actions.length - 1 && (
              <Divider orientation="vertical" flexItem />
            )}
          </>
        ))}
        <ValueMapperTooltip>
          <IconButton sx={{ ml: "auto" }} color="info">
            <QuestionMark />
          </IconButton>
        </ValueMapperTooltip>
      </Box>
      {/* Canvas */}
      <Box sx={{ position: "relative", width: "100%" }}>
        <Box
          component={"canvas"}
          tabIndex={0}
          ref={canvasRef}
          sx={{
            border: "2px solid rgba(255, 255, 255, 0.4)",
            borderRadius: "8px",
            width: "100%",
            height: "100px",
          }}
        />
      </Box>
    </Box>
  );
};

export default ValueMapper;
