import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Car = ({ ballRef }) => {
  const carRef = useRef(null);

  // Load the car model using the regular GLTFLoader
  const { scene } = useGLTF("/car.glb");

  useFrame((_, delta) => {
    const fac = ballRef?.current?.fac ?? 0;
    const target = -5 + 10 * fac;
    const speed = 5;

    if (carRef.current) {
      ballRef.current.x += (target - ballRef.current.x) * speed * delta;
      ballRef.current.x = Math.max(-10, Math.min(10, ballRef.current.x)); // Clamp x to [-10, 10]
      carRef.current.position.x = ballRef.current.x;
    }
  });

  return (
    <group ref={carRef}>
      {scene && (
        <primitive
          object={scene}
          position={[0, 0, 0]}
          rotation={[0, Math.PI / 2, 0]} // Rotate -90 degrees on the Y-axis
        />
      )}
      <pointLight
        position={[0.2, 0.9, 2.0]} // Adjust the position of the light as needed
        intensity={2}
        distance={2}
        color={"red"}
      />
      <pointLight
        position={[-0.2, 0.9, 2.0]} // Adjust the position of the light as needed
        intensity={2}
        distance={2}
        color={"red"}
      />
    </group>
  );
};

export default Car;
