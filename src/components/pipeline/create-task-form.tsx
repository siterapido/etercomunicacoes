"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateTaskFormProps {
  onSubmit: (title: string, priority?: string) => Promise<void>;
  onCancel: () => void;
}

const priorities = [
  { value: "low", label: "Baixa", color: "bg-graphite" },
  { value: "medium", label: "Média", color: "bg-stone" },
  { value: "high", label: "Alta", color: "bg-amber" },
  { value: "urgent", label: "Urgente", color: "bg-crimson" },
];

export function CreateTaskForm({ onSubmit, onCancel }: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [showPriority, setShowPriority] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(trimmed, priority);
      setTitle("");
    } catch {
      // Error is handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const selectedPriority = priorities.find((p) => p.value === priority);

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Título da tarefa..."
        className="w-full px-3 py-2 bg-charcoal border border-graphite rounded-lg text-sm text-marble placeholder:text-stone/50 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/30 transition-all"
        disabled={isSubmitting}
      />

      <div className="flex items-center justify-between gap-2">
        {/* Priority selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPriority(!showPriority)}
            className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-stone hover:text-champagne bg-charcoal border border-graphite rounded-md transition-colors cursor-pointer"
          >
            <span
              className={cn("w-1.5 h-1.5 rounded-full", selectedPriority?.color)}
            />
            {selectedPriority?.label}
            <ChevronDown className="w-3 h-3" />
          </button>

          {showPriority && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowPriority(false)}
              />
              <div className="absolute bottom-full left-0 mb-1 w-28 bg-void border border-graphite rounded-lg shadow-lg z-20 overflow-hidden">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => {
                      setPriority(p.value);
                      setShowPriority(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-champagne hover:bg-teal-light transition-colors cursor-pointer",
                      priority === p.value && "bg-teal-light"
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", p.color)} />
                    {p.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-stone hover:text-champagne transition-colors cursor-pointer"
            title="Cancelar"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider bg-brass text-white rounded-md hover:bg-navy disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            {isSubmitting ? "..." : "Criar"}
          </button>
        </div>
      </div>
    </form>
  );
}
