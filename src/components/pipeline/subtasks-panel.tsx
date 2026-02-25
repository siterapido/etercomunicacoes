"use client";

import { useState, useEffect } from "react";
import { Plus, Check, Trash2, CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface SubtasksPanelProps {
  taskId: string;
}

export function SubtasksPanel({ taskId }: SubtasksPanelProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetch(`/api/tasks/${taskId}/subtasks`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setSubtasks(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [taskId]);

  const addSubtask = async () => {
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      const data = await res.json();
      if (!data.error) {
        setSubtasks((prev) => [...prev, data]);
        setNewTitle("");
        setShowInput(false);
      }
    } catch {
      /* ignore */
    } finally {
      setAdding(false);
    }
  };

  const toggleSubtask = async (id: string, completed: boolean) => {
    // Optimistic update
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !completed } : s))
    );
    try {
      await fetch(`/api/tasks/${taskId}/subtasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
    } catch {
      // Revert
      setSubtasks((prev) =>
        prev.map((s) => (s.id === id ? { ...s, completed } : s))
      );
    }
  };

  const deleteSubtask = async (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`/api/tasks/${taskId}/subtasks/${id}`, { method: "DELETE" });
    } catch {
      /* ignore */
    }
  };

  const completedCount = subtasks.filter((s) => s.completed).length;
  const total = subtasks.length;
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="h-5 w-5 rounded-full border-2 border-brass border-t-transparent animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      {total > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs text-stone mb-1.5">
            <span>{completedCount} de {total} concluídas</span>
            <span className="text-brass font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-graphite rounded-full overflow-hidden">
            <div
              className="h-full bg-brass rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtask list */}
      <div className="space-y-1">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-teal-light group transition-colors"
          >
            <button
              onClick={() => toggleSubtask(subtask.id, subtask.completed)}
              className="shrink-0 text-stone hover:text-brass transition-colors cursor-pointer"
            >
              {subtask.completed ? (
                <CheckSquare className="h-4 w-4 text-brass" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </button>
            <span
              className={cn(
                "flex-1 text-sm transition-colors",
                subtask.completed
                  ? "text-stone line-through"
                  : "text-champagne"
              )}
            >
              {subtask.title}
            </span>
            <button
              onClick={() => deleteSubtask(subtask.id)}
              className="shrink-0 text-stone hover:text-crimson transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add input */}
      {showInput ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addSubtask();
              if (e.key === "Escape") { setShowInput(false); setNewTitle(""); }
            }}
            placeholder="Nova subtarefa..."
            className="flex-1 h-8 px-3 bg-charcoal border border-graphite rounded-lg text-sm text-marble placeholder:text-stone/50 focus:outline-none focus:border-brass"
          />
          <button
            onClick={addSubtask}
            disabled={!newTitle.trim() || adding}
            className="h-8 px-3 bg-brass text-white text-sm rounded-lg hover:bg-navy transition-colors disabled:opacity-50 cursor-pointer"
          >
            {adding ? (
              <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin block" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => { setShowInput(false); setNewTitle(""); }}
            className="h-8 px-2 text-stone hover:text-marble transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-2 text-xs text-stone hover:text-brass transition-colors cursor-pointer py-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar subtarefa
        </button>
      )}
    </div>
  );
}
