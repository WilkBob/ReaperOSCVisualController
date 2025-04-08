import { useRef, useEffect } from "react";

const useCanvasMouse = (canvasRef) => {
  const mousePosRef = useRef({ x: 0, y: 0 });
  const clickedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: parseFloat(((event.clientX - rect.left) / rect.width).toFixed(2)), // Normalize and round x to 2 decimal points
        y: parseFloat(((event.clientY - rect.top) / rect.height).toFixed(2)), // Normalize and round y to 2 decimal points
      };
    };

    const handleMouseDown = () => {
      clickedRef.current = true;
    };

    const handleMouseUp = () => {
      clickedRef.current = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasRef]);

  return { mousePosRef, clickedRef };
};

export default useCanvasMouse;
