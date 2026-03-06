"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const RADIUS = 1;
const SEGMENTS = 64;
const GRATICULE_STEP = 15; // degrees
const LINE_COLOR = "#1a1a1a";
const LINE_WIDTH = 0.5;

function createMeridian(lon: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let lat = -90; lat <= 90; lat += 180 / SEGMENTS) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    points.push([
      -RADIUS * Math.sin(phi) * Math.cos(theta),
      RADIUS * Math.cos(phi),
      RADIUS * Math.sin(phi) * Math.sin(theta),
    ]);
  }
  return points;
}

function createParallel(lat: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let lon = -180; lon <= 180; lon += 360 / SEGMENTS) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    points.push([
      -RADIUS * Math.sin(phi) * Math.cos(theta),
      RADIUS * Math.cos(phi),
      RADIUS * Math.sin(phi) * Math.sin(theta),
    ]);
  }
  return points;
}

export function WireframeEarth() {
  const lines = useMemo(() => {
    const result: [number, number, number][][] = [];

    // Meridians (longitude lines)
    for (let lon = -180; lon < 180; lon += GRATICULE_STEP) {
      result.push(createMeridian(lon));
    }

    // Parallels (latitude lines)
    for (let lat = -90 + GRATICULE_STEP; lat < 90; lat += GRATICULE_STEP) {
      result.push(createParallel(lat));
    }

    return result;
  }, []);

  return (
    <group>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={LINE_COLOR}
          lineWidth={LINE_WIDTH}
          transparent
          opacity={0.6}
        />
      ))}
      {/* Faint glow sphere inside */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.99, 32, 32]} />
        <meshBasicMaterial
          color="#0a0a0a"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
