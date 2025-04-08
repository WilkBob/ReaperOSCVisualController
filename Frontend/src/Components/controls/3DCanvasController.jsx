import { Suspense, useRef } from "react";
import { Box } from "@mui/material";
import useMouseControl from "./UseMouseControl";
import CarHighway3D from "./Highway/CarHighway3D";

const ThreeDCanvasController = ({
  onUpdateX,
  onUpdateY,
  onUpdateBallX,
  onUpdateBallY,
  onUpdateClick,
  onUpdateChaos,
  visualizerId, //for swapping threeD visualizers / currently only'highway'
}) => {
  const ballRef = useRef({ x: 0.5, y: 0.5, fac: 0.5 });
  const chaosRef = useRef(0.2); // Assuming chaos is a float between 0 and 1
  const { mousePosRef, clickedRef } = useMouseControl({
    onUpdateX,
    onUpdateY,
    onUpdateClick,
    ballRef,
  });
  const controllerArgs = {
    mousePosRef,
    clickedRef,
    ballRef,

    onUpdateBallX,
    onUpdateBallY,

    chaosRef,

    onUpdateChaos,
  };
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        {visualizerId === "highway" && (
          <CarHighway3D args={controllerArgs}></CarHighway3D>
        )}
      </Suspense>
    </Box>
  );
};

export default ThreeDCanvasController;
