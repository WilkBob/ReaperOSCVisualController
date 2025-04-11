import { useEffect, useRef } from "react";
const useMouseControl = () => {
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });

  const clickedRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth: width, innerHeight: height } = window;
      const x = e.clientX / width;
      const y = e.clientY / height;

      mousePosRef.current = { x, y };

      onUpdateX(x);
      onUpdateY(y);
    };

    const handleMouseWheel = (e) => {
      const ball = ballRef.current;
      const delta = e.deltaY * 0.001;

      // Update fac with clamping and smoothing
      ball.fac = Math.min(1, Math.max(0.001, ball.fac - delta));

      // Optionally, round to 3 decimals for precision
      ball.fac = Math.round(ball.fac * 1000) / 1000;
    };

    const handleMouseDown = () => {
      onUpdateClick(1);
      clickedRef.current = true;
    };

    const handleMouseUp = () => {
      onUpdateClick(0);
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
  }, [onUpdateX, onUpdateY, onUpdateClick, ballRef]);

  return { mousePosRef, clickedRef };
};

export default useMouseControl;
