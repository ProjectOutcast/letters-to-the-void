"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { WireframeEarth } from "./wireframe-earth";
import { BubbleSystem, type VentBubble } from "./bubble-system";

interface GlobeSceneProps {
  bubbles: VentBubble[];
  onBubbleExpired: (id: string) => void;
}

export function GlobeScene({ bubbles, onBubbleExpired }: GlobeSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
      <WireframeEarth />
      <BubbleSystem bubbles={bubbles} onBubbleExpired={onBubbleExpired} />
    </Canvas>
  );
}
