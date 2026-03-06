"use client";

import { Html } from "@react-three/drei";

interface BubbleTooltipProps {
  content: string;
  visible: boolean;
}

export function BubbleTooltip({ content, visible }: BubbleTooltipProps) {
  if (!visible) return null;

  return (
    <Html
      center
      distanceFactor={4}
      style={{
        pointerEvents: "none",
        transition: "opacity 0.2s ease",
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="max-w-[220px] rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-center text-xs leading-relaxed text-white/80 shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-sm">
        {content}
      </div>
    </Html>
  );
}
