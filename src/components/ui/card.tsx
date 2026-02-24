import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-void border border-graphite rounded-xl p-6 relative overflow-hidden transition-all duration-300",
        hoverable && [
          "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[2px] before:bg-brass before:scale-x-0 before:origin-left before:transition-transform before:duration-300",
          "hover:border-brass/30 hover:shadow-md hover:-translate-y-0.5 hover:before:scale-x-100",
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
