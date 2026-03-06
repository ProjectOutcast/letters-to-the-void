"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Globe } from "./globe";
import { VentInput } from "./vent-input";
import { LocationPrompt } from "./location-prompt";
import { getLocation, type GeoLocation } from "@/lib/geolocation";
import type { VentBubble } from "./bubble-system";

interface VentData {
  id: string;
  content: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  expiresAt: string;
}

interface VentsViewProps {
  initialVents: VentData[];
}

function ventToBubble(vent: VentData): VentBubble {
  // Create a deterministic seed from the id
  let seed = 0;
  for (let i = 0; i < vent.id.length; i++) {
    seed = ((seed << 5) - seed + vent.id.charCodeAt(i)) | 0;
  }
  return {
    id: vent.id,
    content: vent.content,
    latitude: vent.latitude,
    longitude: vent.longitude,
    createdAt: vent.createdAt,
    seed: Math.abs(seed),
  };
}

export function VentsView({ initialVents }: VentsViewProps) {
  const [bubbles, setBubbles] = useState<VentBubble[]>(() =>
    initialVents.map(ventToBubble)
  );
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationResolved, setLocationResolved] = useState(false);
  const [cooldownMs, setCooldownMs] = useState(0);
  const sseRef = useRef<EventSource | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Check geolocation permission state on mount
  useEffect(() => {
    async function checkPermission() {
      try {
        if (navigator.permissions) {
          const status = await navigator.permissions.query({
            name: "geolocation",
          });
          if (status.state === "granted") {
            // Already granted — resolve silently
            const loc = await getLocation(true);
            setLocation(loc);
            setLocationResolved(true);
          } else if (status.state === "denied") {
            // Denied — use IP fallback silently
            const loc = await getLocation(false);
            setLocation(loc);
            setLocationResolved(true);
          } else {
            // prompt — show our custom dialog
            setShowLocationPrompt(true);
          }
        } else {
          // No permissions API — show prompt
          setShowLocationPrompt(true);
        }
      } catch {
        setShowLocationPrompt(true);
      }
    }
    checkPermission();
  }, []);

  // Connect to SSE stream
  useEffect(() => {
    function connectSSE() {
      const source = new EventSource("/api/vents/stream");
      sseRef.current = source;

      source.onmessage = (event) => {
        try {
          const vent: VentData = JSON.parse(event.data);
          const bubble = ventToBubble(vent);
          setBubbles((prev) => {
            // Don't add duplicates
            if (prev.some((b) => b.id === bubble.id)) return prev;
            return [...prev, bubble];
          });
        } catch {
          // Ignore parse errors
        }
      };

      source.onerror = () => {
        source.close();
        sseRef.current = null;
        // Fallback to polling
        startPolling();
      };
    }

    function startPolling() {
      if (pollRef.current) return;
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch("/api/vents");
          if (res.ok) {
            const vents: VentData[] = await res.json();
            setBubbles((prev) => {
              const existingIds = new Set(prev.map((b) => b.id));
              const newBubbles = vents
                .filter((v) => !existingIds.has(v.id))
                .map(ventToBubble);
              if (newBubbles.length === 0) return prev;
              return [...prev, ...newBubbles];
            });
          }
        } catch {
          // Retry next interval
        }
      }, 10000);
    }

    connectSSE();

    return () => {
      sseRef.current?.close();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleLocationAllow = useCallback(async () => {
    setShowLocationPrompt(false);
    const loc = await getLocation(true);
    setLocation(loc);
    setLocationResolved(true);
  }, []);

  const handleLocationSkip = useCallback(async () => {
    setShowLocationPrompt(false);
    const loc = await getLocation(false);
    setLocation(loc);
    setLocationResolved(true);
  }, []);

  const handleBubbleExpired = useCallback((id: string) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleSend = useCallback(
    async (content: string) => {
      if (!location) return;

      const res = await fetch("/api/vents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setCooldownMs(data.retryAfterMs || 300000);
        return;
      }

      if (res.ok) {
        const vent: VentData = await res.json();
        const bubble = ventToBubble(vent);
        setBubbles((prev) => {
          if (prev.some((b) => b.id === bubble.id)) return prev;
          return [...prev, bubble];
        });
      }
    },
    [location]
  );

  return (
    <div className="fixed inset-0 bg-black">
      {/* Globe fills the screen */}
      <div className="absolute inset-0">
        <Globe bubbles={bubbles} onBubbleExpired={handleBubbleExpired} />
      </div>

      {/* Location prompt */}
      <LocationPrompt
        open={showLocationPrompt}
        onAllow={handleLocationAllow}
        onSkip={handleLocationSkip}
      />

      {/* Input bar */}
      <VentInput
        onSend={handleSend}
        disabled={!locationResolved}
        cooldownMs={cooldownMs}
      />
    </div>
  );
}
