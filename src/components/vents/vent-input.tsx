"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

const MAX_CHARS = 280;

interface VentInputProps {
  onSend: (content: string) => Promise<void>;
  disabled: boolean;
  cooldownMs: number;
}

export function VentInput({ onSend, disabled, cooldownMs }: VentInputProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cooldownInterval = useRef<NodeJS.Timeout | null>(null);

  const remaining = MAX_CHARS - content.length;
  const canSend = content.trim().length > 0 && !disabled && !sending && cooldown <= 0;

  // Start cooldown timer when cooldownMs changes
  useEffect(() => {
    if (cooldownMs > 0) {
      setCooldown(cooldownMs);
      if (cooldownInterval.current) clearInterval(cooldownInterval.current);
      cooldownInterval.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1000) {
            if (cooldownInterval.current) clearInterval(cooldownInterval.current);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => {
      if (cooldownInterval.current) clearInterval(cooldownInterval.current);
    };
  }, [cooldownMs]);

  const handleSend = useCallback(async () => {
    const text = content.trim();
    if (!text || !canSend) return;

    setSending(true);
    try {
      await onSend(text);
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } finally {
      setSending(false);
    }
  }, [content, canSend, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      if (val.length <= MAX_CHARS) {
        setContent(val);
        // Auto-resize
        const el = e.target;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
      }
    },
    []
  );

  const cooldownSeconds = Math.ceil(cooldown / 1000);

  return (
    <div className="vent-input-bar fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-end gap-3 px-4 py-3">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? "Resolving location..."
                : cooldown > 0
                  ? `The void needs a moment... (${cooldownSeconds}s)`
                  : "Send a thought into the void..."
            }
            disabled={disabled || cooldown > 0}
            rows={1}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-12 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/20 disabled:opacity-40"
            style={{ maxHeight: "120px" }}
          />
          <span
            className={cn(
              "absolute bottom-2.5 right-3 text-xs tabular-nums transition-colors",
              remaining < 20
                ? "text-red-400"
                : remaining < 50
                  ? "text-yellow-400/60"
                  : "text-white/20"
            )}
          >
            {content.length > 0 && remaining}
          </span>
        </div>
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all",
            canSend
              ? "bg-white/10 text-white hover:bg-white/20"
              : "text-white/20"
          )}
          aria-label="Send vent"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
