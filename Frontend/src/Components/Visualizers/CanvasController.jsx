import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import useOSCController from "../../Hooks/useOSCController";
import useMouseControl from "../../Hooks/useMouseControl";

const CanvasController = ({ broadcasting }) => {
  const OSCOutputRefs = useOSCController(broadcasting);
  const mouseControl = useMouseControl({ clickSwell: true, swellRate: 0.01 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      if (OSCOutputRefs.current && mouseControl.current) {
        OSCOutputRefs.current["Parameter 1"].current = mouseControl.current.x;
      }
      requestAnimationFrame(animate);
    };

    animate();
  }, [OSCOutputRefs, mouseControl]);

  return (
    <></>
    // <Box
    //   component={"canvas"}
    //   ref={canvasRef}
    //   sx={{
    //     position: "absolute",
    //     top: 0,
    //     left: 0,
    //     width: "100%",
    //     height: "100vh",
    //   }}
    // />
  );
};

export default CanvasController;
