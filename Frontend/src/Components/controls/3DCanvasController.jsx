import { Suspense } from "react";
import { Box } from "@mui/material";
import useMouseControl from "./UseMouseControl";
import CarHighway3D from "./Highway/CarHighway3D";

const ThreeDCanvasController = ({
  trackX,
  trackY,
  trackBallX,
  trackBallY,
  trackClick,
  trackChaos,
  onUpdateX,
  onUpdateY,
  onUpdateBallX,
  onUpdateBallY,
  onUpdateClick,
  onUpdateChaos,
  visualizerId, //for swapping threeD visualizers / currently only'highway'
}) => {
  const { mousePosRef, ballRef, clickedRef, chaosRef } = useMouseControl({
    trackX,
    trackY,
    trackClick,
    onUpdateX,
    onUpdateY,
    onUpdateClick,
  });
  const controllerArgs = {
    mousePosRef,
    trackMouse: trackX || trackY,

    clickedRef,
    trackClick,

    ballRef,
    trackBall: trackBallX || trackBallY,
    onUpdateBallX,
    onUpdateBallY,

    chaosRef,
    trackChaos,
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
