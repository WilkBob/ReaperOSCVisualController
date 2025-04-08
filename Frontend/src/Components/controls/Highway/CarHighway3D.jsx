import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Car from "./Car";
import { OrbitControls } from "@react-three/drei";

const CarHighway3D = ({ args }) => {
  const {
    mousePosRef,
    trackMouse,
    clickedRef,
    trackClick,
    ballRef,
    trackBall,
    onUpdateBallX,
    onUpdateBallY,
    chaosRef,
    trackChaos,
    onUpdateChaos,
  } = args;

  // useFrame(() => {
  return (
    <>
      <Canvas
        camera={{
          position: [0, 5, 10], // [x, y, z]
          fov: 60, // field of view in degrees
          near: 0.1,
          far: 100,
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} />
        <Car ballRef={ballRef} />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default CarHighway3D;
