"use client";

import { Dialog } from "@/components/ui/dialog";

interface LocationPromptProps {
  open: boolean;
  onAllow: () => void;
  onSkip: () => void;
}

export function LocationPrompt({ open, onAllow, onSkip }: LocationPromptProps) {
  return (
    <Dialog open={open} onClose={onSkip} title="Where are you?">
      <p className="text-sm leading-relaxed text-void-muted">
        Your location determines where your vent appears on the globe. It&apos;s
        used once to place your bubble — never stored, never tracked.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={onAllow}
          className="flex-1 rounded-md bg-white/10 px-4 py-2 text-sm text-void-white transition-colors hover:bg-white/20"
        >
          Allow location
        </button>
        <button
          onClick={onSkip}
          className="flex-1 rounded-md border border-void-border px-4 py-2 text-sm text-void-muted transition-colors hover:text-void-text"
        >
          Skip
        </button>
      </div>
    </Dialog>
  );
}
