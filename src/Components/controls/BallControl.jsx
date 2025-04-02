import { useEffect, useRef, useState } from "react";

const BallControl = ({ onUpdate }) => {
  const [position, setPosition] = useState(0.5); // Start in middle
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [speed, setSpeed] = useState(0.005); // Speed of ball movement
  const animationRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      setPosition((prev) => {
        const newPos = prev + direction * speed;

        // Change direction when hitting edges
        if (newPos >= 0.98 || newPos <= 0.02) {
          setDirection((d) => -d);
        }

        // Ensure position stays within bounds
        const clampedPos = Math.max(0, Math.min(1, newPos));
        onUpdate(clampedPos);
        return clampedPos;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [direction, speed, onUpdate]);

  const handleSpeedChange = (e) => {
    setSpeed(parseFloat(e.target.value));
  };

  return (
    <div className="ball-control">
      <div
        className="ball-container"
        style={{
          width: "100%",
          height: "80px",
          backgroundColor: "rgba(0,0,0,0.1)",
          border: "1px solid #333",
          borderRadius: "4px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="ball"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "#4285f4",
            position: "absolute",
            top: "50%",
            left: `${position * 100}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 0.05s linear",
          }}
        />
      </div>
      <div className="speed-control" style={{ marginTop: "10px" }}>
        <label htmlFor="speed">Speed: </label>
        <input
          type="range"
          id="speed"
          min="0.001"
          max="0.01"
          step="0.001"
          value={speed}
          onChange={handleSpeedChange}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default BallControl;
