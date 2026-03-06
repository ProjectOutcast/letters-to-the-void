import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-medium text-void-subtle"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-md border border-void-border bg-void-surface px-3 py-2 text-sm text-void-text placeholder:text-void-muted transition-colors focus:border-void-border-hover focus:outline-none focus:ring-1 focus:ring-void-border-hover",
            error && "border-void-danger focus:border-void-danger focus:ring-void-danger",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-void-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
