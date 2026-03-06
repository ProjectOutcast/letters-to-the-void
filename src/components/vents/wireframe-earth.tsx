"use client";

import { useMemo } from "react";
import * as THREE from "three";

const RADIUS = 1;
const SEGMENTS = 64;
const GRATICULE_STEP = 15; // degrees
const LINE_COLOR = new THREE.Color("#444444");

function latLonToXYZ(
  lat: number,
  lon: number,
  r: number
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

export function WireframeEarth() {
  const geometry = useMemo(() => {
    const vertices: number[] = [];

    // Meridians (longitude lines)
    for (let lon = -180; lon < 180; lon += GRATICULE_STEP) {
      const step = 180 / SEGMENTS;
      for (let lat = -90; lat < 90; lat += step) {
        const [x1, y1, z1] = latLonToXYZ(lat, lon, RADIUS);
        const [x2, y2, z2] = latLonToXYZ(lat + step, lon, RADIUS);
        vertices.push(x1, y1, z1, x2, y2, z2);
      }
    }

    // Parallels (latitude lines)
    for (
      let lat = -90 + GRATICULE_STEP;
      lat < 90;
      lat += GRATICULE_STEP
    ) {
      const step = 360 / SEGMENTS;
      for (let lon = -180; lon < 180; lon += step) {
        const [x1, y1, z1] = latLonToXYZ(lat, lon, RADIUS);
        const [x2, y2, z2] = latLonToXYZ(lat, lon + step, RADIUS);
        vertices.push(x1, y1, z1, x2, y2, z2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    return geo;
  }, []);

  return (
    <group>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={LINE_COLOR} transparent opacity={0.7} />
      </lineSegments>
      {/* Faint fill sphere to give depth */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.99, 32, 32]} />
        <meshBasicMaterial
          color="#0d0d0d"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
