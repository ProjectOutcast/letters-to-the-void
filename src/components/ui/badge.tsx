import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          default: "bg-void-elevated text-void-subtle",
          success: "bg-emerald-500/10 text-emerald-400",
          warning: "bg-amber-500/10 text-amber-400",
          danger: "bg-void-danger/10 text-void-danger",
        }[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
