"use client";

import { useState } from "react";
import { X, Calendar, Flag, Send, CheckSquare, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubtasksPanel } from "./subtasks-panel";
import { SendApprovalModal } from "./send-approval-modal";
import { cn } from "@/lib/utils";

interface TaskData {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  dueDate?: string | null;
  position: number;
  columnId: string;
  createdBy?: string | null;
}

interface TaskDetailModalProps {
  task: TaskData | null;
  onClose: () => void;
}

const priorityLabels: Record<string, string> = {
  urgent: "Urgente",
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isOverdue(dueDate: string): boolean {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  if (!task) return null;

  const overdue = task.dueDate ? isOverdue(task.dueDate) : false;
  const priorityVariant = task.priority as "urgent" | "high" | "medium" | "low";

  return (
    <AnimatePresence>
      {task && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 48 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-void border-l border-graphite shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-void border-b border-graphite px-6 py-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-marble leading-snug">
                  {task.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-1.5 rounded-lg text-stone hover:text-marble hover:bg-teal-light transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Meta info */}
              <div className="flex flex-wrap gap-3">
                <Badge variant={priorityVariant} className="flex items-center gap-1.5">
                  <Flag className="h-3 w-3" />
                  {priorityLabels[task.priority] ?? task.priority}
                </Badge>

                {task.dueDate && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border",
                      overdue
                        ? "text-crimson border-crimson/30 bg-crimson/5"
                        : "text-stone border-graphite bg-charcoal"
                    )}
                  >
                    <Calendar className="h-3 w-3" />
                    {overdue ? "Atrasado · " : ""}
                    {formatDueDate(task.dueDate)}
                  </span>
                )}
              </div>

              {/* Description */}
              {task.description && (
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-2">
                    Descrição
                  </p>
                  <p className="text-sm text-champagne leading-relaxed whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-graphite" />

              {/* Subtasks */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="h-4 w-4 text-brass" />
                  <p className="text-xs font-semibold tracking-widest uppercase text-stone">
                    Subtarefas
                  </p>
                </div>
                <SubtasksPanel taskId={task.id} />
              </div>

              {/* Divider */}
              <div className="border-t border-graphite" />

              {/* Approval section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ExternalLink className="h-4 w-4 text-brass" />
                  <p className="text-xs font-semibold tracking-widest uppercase text-stone">
                    Aprovação do Cliente
                  </p>
                </div>
                <p className="text-xs text-stone mb-4">
                  Envie esta tarefa para aprovação do cliente via link ou email.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowApprovalModal(true)}
                  className="w-full"
                >
                  <Send className="h-4 w-4" />
                  Solicitar aprovação
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Approval modal layered on top */}
          {showApprovalModal && (
            <SendApprovalModal
              taskId={task.id}
              taskTitle={task.title}
              onClose={() => setShowApprovalModal(false)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
