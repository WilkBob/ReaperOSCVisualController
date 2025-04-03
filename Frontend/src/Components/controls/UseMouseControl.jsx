import { useEffect, useRef } from "react";

const useMouseControl = ({
  trackX,
  trackY,
  trackBallX,
  trackBallY,
  trackClick,
  onUpdateX,
  onUpdateY,
  onUpdateClick,
}) => {
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const ballRef = useRef({ x: 0.5, y: 0.5, fac: 0.5, vx: 0.008, vy: 0.006 });
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
      const delta = e.deltaY * 0.001; // Adjust sensitivity as needed

      // Update fac with clamping and smoothing
      ball.fac = Math.min(1, Math.max(0.001, ball.fac - delta));

      // Optionally, round to 3 decimals for precision
      ball.fac = Math.round(ball.fac * 1000) / 1000;

      if (trackBallX) onUpdateX(ball.fac); // Example: Update X if tracking ball
      if (trackBallY) onUpdateY(ball.fac); // Example: Update Y if tracking ball
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
    onUpdateClick,
  ]);

  return { mousePosRef, ballRef, clickedRef };
};

export default useMouseControl;
