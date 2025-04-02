import { useEffect, useRef } from "react";

const MouseTracker = ({ trackX, trackY, onUpdateX, onUpdateY }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();

      // Calculate normalized values (0-1)
      if (trackX) {
        const x = (e.clientX - rect.left) / rect.width;
        onUpdateX(Math.max(0, Math.min(1, x))); // Clamp between 0-1
      }

      if (trackY) {
        const y = (e.clientY - rect.top) / rect.height;
        onUpdateY(Math.max(0, Math.min(1, y))); // Clamp between 0-1
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [trackX, trackY, onUpdateX, onUpdateY]);

  return (
    <div
      ref={containerRef}
      className="mouse-tracker"
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "rgba(0,0,0,0.1)",
        border: "1px solid #333",
        borderRadius: "4px",
        position: "relative",
      }}
    >
      <div className="tracker-label" style={{ padding: "10px", color: "#fff" }}>
        {trackX && trackY
          ? "Move mouse to control X/Y"
          : trackX
          ? "Move mouse horizontally to control X"
          : "Move mouse vertically to control Y"}
      </div>
    </div>
  );
};

export default MouseTracker;
