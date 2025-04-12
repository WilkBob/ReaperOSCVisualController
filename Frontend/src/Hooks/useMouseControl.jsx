import { useRef, useEffect } from "react";

const useMouseControl = ({ clickSwell = false, swellRate = 0.02 } = {}) => {
  const mouseRef = useRef({ x: 0, y: 0, click: 0, wheel: 0.5 });
  const isMouseDown = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };

    const handleMouseDown = () => {
      isMouseDown.current = true;
      if (!clickSwell) mouseRef.current.click = 1;
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
      if (!clickSwell) mouseRef.current.click = 0;
    };

    const handleWheel = (e) => {
      // Normalize scroll delta and clamp
      const delta = e.deltaY * -0.001;
      mouseRef.current.wheel = Math.max(
        0,
        Math.min(1, mouseRef.current.wheel + delta)
      );
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("wheel", handleWheel);

    let frameId;
    const animateClick = () => {
      if (clickSwell) {
        const clickVal = mouseRef.current.click;
        const target = isMouseDown.current ? 1 : 0;
        const diff = target - clickVal;
        if (Math.abs(diff) > 0.001) {
          mouseRef.current.click += diff * swellRate;
        }
      }
      frameId = requestAnimationFrame(animateClick);
    };

    if (clickSwell) {
      frameId = requestAnimationFrame(animateClick);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("wheel", handleWheel);
      if (clickSwell) cancelAnimationFrame(frameId);
    };
  }, [clickSwell, swellRate]);

  return mouseRef;
};

export default useMouseControl;
