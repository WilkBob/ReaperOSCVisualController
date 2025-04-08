import React, { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import RoadSection from "./RoadSection";

// RoadManager handles multiple road sections and creates a scrolling effect
const RoadManager = ({ ballRef }) => {
  const sectionCount = 8; // Number of sections to display at once
  const sectionLength = 10; // Length of each section (must match RoadSection)
  const scrollSpeed = 5; // Speed of scrolling

  const sectionsRef = useRef([]);
  const scrollOffsetRef = useRef(0);

  // Initialize sections
  useEffect(() => {
    sectionsRef.current = Array(sectionCount)
      .fill()
      .map((_, i) => ({
        index: i,
        z: -i * sectionLength,
      }));
  }, []);

  // Update sections position on each frame
  useFrame((state, delta) => {
    // Get current fac value from ballRef
    const fac = ballRef?.current?.fac ?? 0;

    // Update scroll offset
    scrollOffsetRef.current += scrollSpeed * delta;

    // If we've scrolled past a section length, reset the counter
    if (scrollOffsetRef.current >= sectionLength) {
      scrollOffsetRef.current -= sectionLength;

      // Recycle the first section to the end
      const sections = [...sectionsRef.current];
      const firstSection = sections.shift();

      // Move the first section to the end and update its index
      firstSection.index += sectionCount;
      firstSection.z = sections[sections.length - 1].z - sectionLength;

      sections.push(firstSection);
      sectionsRef.current = sections;
    }
  });

  return (
    <group position={[0, 0, scrollOffsetRef.current]}>
      {sectionsRef.current.map((section) => (
        <RoadSection
          key={section.index}
          z={section.z}
          index={section.index}
          fac={ballRef?.current?.fac ?? 0}
        />
      ))}
    </group>
  );
};

export default RoadManager;
