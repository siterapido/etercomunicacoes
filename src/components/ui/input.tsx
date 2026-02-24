import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
            className="block text-xs font-medium uppercase tracking-widest text-stone"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full h-11 px-4 bg-charcoal border border-graphite rounded-lg text-marble placeholder:text-stone/50 font-[family-name:var(--font-body)] text-base",
            "transition-all duration-200",
            "focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/30",
            error && "border-crimson focus:border-crimson focus:ring-crimson/30",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-crimson mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
