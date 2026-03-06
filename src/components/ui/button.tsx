import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50",
          {
            default:
              "bg-void-white text-void hover:bg-void-text active:bg-void-accent",
            ghost:
              "text-void-muted hover:bg-void-elevated hover:text-void-text",
            danger:
              "bg-void-danger/10 text-void-danger hover:bg-void-danger/20",
            outline:
              "border border-void-border text-void-text hover:border-void-border-hover hover:bg-void-elevated",
          }[variant],
          {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 text-sm",
            lg: "h-12 px-6 text-base",
          }[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
