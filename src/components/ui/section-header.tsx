import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  className?: string;
}

export function SectionHeader({ label, title, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brass mb-2">
        {label}
      </p>
      <h2 className="font-[family-name:var(--font-display)] text-[clamp(22px,3vw,28px)] font-semibold text-marble">
        {title}
      </h2>
    </div>
  );
}
