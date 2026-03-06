"use client";

import dynamic from "next/dynamic";
import type { VentBubble } from "./bubble-system";

const GlobeScene = dynamic(
  () => import("./globe-scene").then((mod) => mod.GlobeScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-ping rounded-full border border-white/10" />
          <div className="absolute inset-2 animate-pulse rounded-full border border-white/20" />
          <div className="absolute inset-4 rounded-full border border-white/30" />
        </div>
      </div>
    ),
  }
);

interface GlobeProps {
  bubbles: VentBubble[];
  onBubbleExpired: (id: string) => void;
}

export function Globe({ bubbles, onBubbleExpired }: GlobeProps) {
  return (
    <div className="h-full w-full">
      <GlobeScene bubbles={bubbles} onBubbleExpired={onBubbleExpired} />
    </div>
  );
}
