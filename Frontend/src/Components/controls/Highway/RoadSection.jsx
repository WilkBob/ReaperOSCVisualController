import { useMemo } from "react";
import { Line } from "@react-three/drei";

const RoadSection = ({ z = 0, fac = 0, index = 0 }) => {
  const width = 4;
  const length = 10;

  // Calculate height using sine wave with amplitude affected by fac
  // The amplitude increases as fac increases (0-1)
  const baseFrequency = 0.15; // Controls how many "waves" appear
  const maxAmplitude = 2.5; // Maximum height variation
  const amplitude = fac * maxAmplitude;
  const offset = index * length; // Use the section index for continuous waves

  // Calculate the y positions at the start and end of this section
  const yStart = amplitude * Math.sin(baseFrequency * (offset - length / 2));
  const yEnd = amplitude * Math.sin(baseFrequency * (offset + length / 2));

  // Positions for the side lines and center dashed line with height variation
  const leftLine = useMemo(
    () => [
      [-width / 2, yStart, -length / 2],
      [-width / 2, yEnd, length / 2],
    ],
    [yStart, yEnd]
  );

  const rightLine = useMemo(
    () => [
      [width / 2, yStart, -length / 2],
      [width / 2, yEnd, length / 2],
    ],
    [yStart, yEnd]
  );

  const centerLine = useMemo(
    () => [
      [0, yStart + 0.01, -length / 2],
      [0, yEnd + 0.01, length / 2],
    ],
    [yStart, yEnd]
  );

  // Create visual road surface (optional)
  const roadSurface = useMemo(
    () => [
      [-width / 2, yStart, -length / 2],
      [width / 2, yStart, -length / 2],
      [width / 2, yEnd, length / 2],
      [-width / 2, yEnd, length / 2],
    ],
    [yStart, yEnd, width, length]
  );

  return (
    <group position-z={z}>
      {/* Dark gray road surface */}
      <mesh>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Solid white lines for road edges */}
      <Line points={leftLine} color="white" lineWidth={2} />
      <Line points={rightLine} color="white" lineWidth={2} />

      {/* Dashed center line */}
      <Line
        points={centerLine}
        color="white"
        lineWidth={1}
        dashed
        dashSize={1}
        gapSize={1}
      />
    </group>
  );
};

export default RoadSection;
