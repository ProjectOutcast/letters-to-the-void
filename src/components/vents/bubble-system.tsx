"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BubbleTooltip } from "./bubble";

const GLOBE_RADIUS = 1;
const RISE_DURATION = 5000; // ms
const ANTICIPATION_DURATION = 600; // ms
const FADE_DURATION = 1200; // ms
const TOTAL_DURATION = ANTICIPATION_DURATION + RISE_DURATION + FADE_DURATION;
const RISE_HEIGHT = 3;
const BUBBLE_SCALE = 0.07;

export interface VentBubble {
  id: string;
  content: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  seed: number;
}

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// World up direction — bubbles always rise upward visually
const WORLD_UP = new THREE.Vector3(0, 1, 0);

interface BubbleMeshProps {
  bubble: VentBubble;
  startTime: number;
  onExpired: (id: string) => void;
}

function BubbleMesh({ bubble, startTime, onExpired }: BubbleMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  const pauseTimeRef = useRef(0);
  const totalPausedRef = useRef(0);

  const origin = useMemo(
    () => latLonToVec3(bubble.latitude, bubble.longitude, GLOBE_RADIUS),
    [bubble.latitude, bubble.longitude]
  );

  // Rise direction: mostly upward (Y+), with a slight outward push from globe surface
  const riseDirection = useMemo(() => {
    const outward = origin.clone().normalize();
    // Blend: 70% world up + 30% outward from surface
    const dir = WORLD_UP.clone()
      .multiplyScalar(0.7)
      .add(outward.multiplyScalar(0.3));
    return dir.normalize();
  }, [origin]);

  // Random drift values seeded per bubble
  const drift = useMemo(() => {
    const s = bubble.seed;
    return {
      freqX: 0.5 + (s % 100) / 100,
      freqZ: 0.3 + ((s * 7) % 100) / 100,
      ampX: 0.1 + ((s * 13) % 100) / 400,
      ampZ: 0.08 + ((s * 17) % 100) / 400,
      phaseX: ((s % 50) / 50) * Math.PI * 2,
      phaseZ: (((s * 3) % 50) / 50) * Math.PI * 2,
    };
  }, [bubble.seed]);

  const handlePointerOver = useCallback(() => {
    hoveredRef.current = true;
    setHovered(true);
    pauseTimeRef.current = performance.now();
  }, []);

  const handlePointerOut = useCallback(() => {
    hoveredRef.current = false;
    setHovered(false);
    totalPausedRef.current += performance.now() - pauseTimeRef.current;
  }, []);

  const handleClick = useCallback(() => {
    // Mobile: toggle hover
    if (hoveredRef.current) {
      hoveredRef.current = false;
      setHovered(false);
      totalPausedRef.current += performance.now() - pauseTimeRef.current;
    } else {
      hoveredRef.current = true;
      setHovered(true);
      pauseTimeRef.current = performance.now();
    }
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const now = performance.now();
    const currentPaused = hoveredRef.current
      ? totalPausedRef.current + (now - pauseTimeRef.current)
      : totalPausedRef.current;

    const elapsed = now - startTime - currentPaused;

    if (elapsed >= TOTAL_DURATION) {
      onExpired(bubble.id);
      return;
    }

    let scale = 1;
    let opacity = 1;

    if (elapsed < ANTICIPATION_DURATION) {
      // Act 1: Anticipation — pulse/grow at origin
      const t = elapsed / ANTICIPATION_DURATION;
      scale = 0.3 + 0.7 * Math.sin(t * Math.PI * 0.5); // grow in
      opacity = 0.4 + 0.6 * t;
      meshRef.current.position.copy(origin);
    } else if (elapsed < ANTICIPATION_DURATION + RISE_DURATION) {
      // Act 2: Rise upward
      const riseElapsed = elapsed - ANTICIPATION_DURATION;
      const riseProgress = riseElapsed / RISE_DURATION;
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - riseProgress, 3);

      scale = 1 + 0.15 * eased; // grow slightly as it rises
      opacity = 1;

      // Begin fading in the last 30% of rise
      if (riseProgress > 0.7) {
        opacity = 1 - (riseProgress - 0.7) / 0.3;
      }

      const height = eased * RISE_HEIGHT;
      const pos = origin
        .clone()
        .add(riseDirection.clone().multiplyScalar(height));

      // Add organic sin/cos drift
      const driftTime = riseElapsed / 1000;
      pos.x +=
        Math.sin(driftTime * drift.freqX + drift.phaseX) *
        drift.ampX *
        eased;
      pos.z +=
        Math.cos(driftTime * drift.freqZ + drift.phaseZ) *
        drift.ampZ *
        eased;

      meshRef.current.position.copy(pos);
    } else {
      // Act 3: Final dissolve
      const fadeElapsed = elapsed - ANTICIPATION_DURATION - RISE_DURATION;
      const fadeProgress = fadeElapsed / FADE_DURATION;
      opacity = 1 - fadeProgress;
      scale = (1 + 0.15) - 0.4 * fadeProgress; // shrink as it dissolves

      const pos = origin
        .clone()
        .add(riseDirection.clone().multiplyScalar(RISE_HEIGHT));
      meshRef.current.position.copy(pos);
    }

    meshRef.current.scale.setScalar(Math.max(scale * BUBBLE_SCALE, 0.001));

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.max(opacity, 0);
  });

  return (
    <mesh
      ref={meshRef}
      position={origin.toArray()}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
        depthWrite={false}
      />
      <BubbleTooltip content={bubble.content} visible={hovered} />
    </mesh>
  );
}

interface BubbleSystemProps {
  bubbles: VentBubble[];
  onBubbleExpired: (id: string) => void;
}

export function BubbleSystem({ bubbles, onBubbleExpired }: BubbleSystemProps) {
  const startTimesRef = useRef<Map<string, number>>(new Map());

  return (
    <group>
      {bubbles.map((bubble) => {
        if (!startTimesRef.current.has(bubble.id)) {
          startTimesRef.current.set(bubble.id, performance.now());
        }
        return (
          <BubbleMesh
            key={bubble.id}
            bubble={bubble}
            startTime={startTimesRef.current.get(bubble.id)!}
            onExpired={(id) => {
              startTimesRef.current.delete(id);
              onBubbleExpired(id);
            }}
          />
        );
      })}
    </group>
  );
}
