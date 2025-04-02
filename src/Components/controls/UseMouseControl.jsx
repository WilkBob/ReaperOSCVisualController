import { useEffect, useRef } from "react";

const useMouseControl = ({
  trackX,
  trackY,
  trackBallX,
  trackBallY,
  trackClick,
  onUpdateX,
  onUpdateY,
  onUpdateBallX,
  onUpdateBallY,
  onUpdateClick,
}) => {
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const ballRef = useRef({ x: 0.5, y: 0.5, vx: 0.004, vy: 0.001 });
  const clickedRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth: width, innerHeight: height } = window;
      const x = e.clientX / width;
      const y = e.clientY / height;

      mousePosRef.current = { x, y };

      if (trackX) onUpdateX(x);
      if (trackY) onUpdateY(y);
    };

    const handleMouseWheel = (e) => {
      const ball = ballRef.current;
      const delta = e.deltaY * 0.00001;

      // Update velocities and round to 3 decimal places
      ball.vx = parseFloat(
        Math.max(-0.02, Math.min(0.02, ball.vx + delta)).toFixed(3)
      );
      ball.vy = parseFloat(
        Math.max(-0.02, Math.min(0.02, ball.vy + delta)).toFixed(3)
      );
    };

    const handleMouseDown = () => {
      if (trackClick) onUpdateClick(1);
      clickedRef.current = true;
    };

    const handleMouseUp = () => {
      if (trackClick) onUpdateClick(0);
      clickedRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleMouseWheel);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleMouseWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    trackX,
    trackY,
    trackBallX,
    trackBallY,
    trackClick,
    onUpdateX,
    onUpdateY,
    onUpdateBallX,
    onUpdateBallY,
    onUpdateClick,
  ]);

  return { mousePosRef, ballRef, clickedRef };
};

export default useMouseControl;
