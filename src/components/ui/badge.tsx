import { cn } from "@/lib/utils";

type BadgeVariant =
  | "urgent"
  | "high"
  | "medium"
  | "low"
  | "active"
  | "paused"
  | "completed"
  | "pending"
  | "approved"
  | "rejected";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  urgent: "bg-crimson/12 text-crimson",
  high: "bg-amber/12 text-amber",
  medium: "bg-stone/12 text-stone",
  low: "bg-graphite text-stone",
  active: "bg-brass/12 text-champagne",
  paused: "bg-amber/12 text-amber",
  completed: "bg-emerald/12 text-emerald",
  pending: "bg-amber/12 text-amber",
  approved: "bg-emerald/12 text-emerald",
  rejected: "bg-crimson/12 text-crimson",
};

const dotColors: Record<BadgeVariant, string> = {
  urgent: "bg-crimson",
  high: "bg-amber",
  medium: "bg-stone",
  low: "bg-graphite",
  active: "bg-brass",
  paused: "bg-amber",
  completed: "bg-emerald",
  pending: "bg-amber",
  approved: "bg-emerald",
  rejected: "bg-crimson",
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />
      {children}
    </span>
  );
}
