"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "rounded-lg border border-void-border bg-void-surface p-0 text-void-text backdrop:bg-black/60 backdrop:backdrop-blur-sm",
        "max-w-md w-full",
        className
      )}
    >
      <div className="p-6">
        <h3 className="text-lg font-medium text-void-heading">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}
