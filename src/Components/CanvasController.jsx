import { Debug } from "./Debug";
import { useEffect, useState, useRef } from "react";
import { createOSCAddress, sendMessage } from "../API/oscService";
import MouseTracker from "./controls/MouseTracker";
import BallControl from "./controls/BallControl";

const CanvasController = ({ params, broadcasting }) => {
  // States to track which control types are in use
  const [useX, setUseX] = useState(false);
  const [useY, setUseY] = useState(false);
  const [useBall, setUseBall] = useState(false);
  const [debug, setDebug] = useState(false);

  // Object to store addresses for each control type
  const [controlAddresses, setControlAddresses] = useState({
    "mouse-x": [],
    "mouse-y": [],
    ball: [],
  });

  // Refs to store current values of each control
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const ballRef = useRef(0);

  // Refs to store the last broadcasted values
  const lastMouseXRef = useRef(null);
  const lastMouseYRef = useRef(null);
  const lastBallRef = useRef(null);

  // Update control states and addresses when params change
  useEffect(() => {
    setUseX(params.some((param) => param.controlType === "mouse-x"));
    setUseY(params.some((param) => param.controlType === "mouse-y"));
    setUseBall(params.some((param) => param.controlType === "ball"));

    const newControlAddresses = {
      "mouse-x": [],
      "mouse-y": [],
      ball: [],
    };

    params.forEach((param) => {
      const address = createOSCAddress(param);
      if (newControlAddresses[param.controlType]) {
        newControlAddresses[param.controlType].push({
          address,
          range: param.range,
        });
      }
    });

    setControlAddresses(newControlAddresses);
  }, [params]);

  // Set up OSC broadcast interval when broadcasting is enabled
  useEffect(() => {
    let interval;

    if (broadcasting) {
      interval = setInterval(() => {
        // Send all mouse-x values if changed
        controlAddresses["mouse-x"].forEach(({ address, range }) => {
          const scaledValue = scaleValue(
            mouseXRef.current,
            0,
            1,
            range.min,
            range.max
          );
          if (scaledValue !== lastMouseXRef.current) {
            sendMessage(address, scaledValue);
            lastMouseXRef.current = scaledValue; // Update last broadcasted value
          }
        });

        // Send all mouse-y values if changed
        controlAddresses["mouse-y"].forEach(({ address, range }) => {
          const scaledValue = scaleValue(
            mouseYRef.current,
            0,
            1,
            range.min,
            range.max
          );
          if (scaledValue !== lastMouseYRef.current) {
            sendMessage(address, scaledValue);
            lastMouseYRef.current = scaledValue; // Update last broadcasted value
          }
        });

        // Send all ball values if changed
        controlAddresses["ball"].forEach(({ address, range }) => {
          const scaledValue = scaleValue(
            ballRef.current,
            0,
            1,
            range.min,
            range.max
          );
          if (scaledValue !== lastBallRef.current) {
            sendMessage(address, scaledValue);
            lastBallRef.current = scaledValue; // Update last broadcasted value
          }
        });
      }, 50); // Update rate - 100ms
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [broadcasting, controlAddresses]);

  // Helper function to scale values between ranges
  const scaleValue = (value, inMin, inMax, outMin, outMax) => {
    return parseFloat(
      (
        ((value - inMin) * (outMax - outMin)) / (inMax - inMin) +
        outMin
      ).toFixed(2)
    );
  };

  return (
    <div className="canvas-controller">
      {/* Render controls based on what's needed */}
      {(useX || useY) && (
        <MouseTracker
          trackX={useX}
          trackY={useY}
          onUpdateX={(val) => (mouseXRef.current = val)}
          onUpdateY={(val) => (mouseYRef.current = val)}
        />
      )}

      {useBall && <BallControl onUpdate={(val) => (ballRef.current = val)} />}

      {debug && (
        <Debug
          params={params}
          useX={useX}
          useY={useY}
          useBall={useBall}
          controlAddresses={controlAddresses}
        />
      )}
    </div>
  );
};

export default CanvasController;
