"use client";

import { useState, useEffect, use } from "react";
import { CheckCircle, XCircle, MessageSquare, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Approval {
  id: string;
  status: string;
  clientName: string | null;
  notes: string | null;
  clientFeedback: string | null;
  task: { title: string; description: string | null } | null;
  project: { name: string } | null;
  requestedByUser: { name: string } | null;
}

export default function ApprovePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [approval, setApproval] = useState<Approval | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [choice, setChoice] = useState<"approved" | "changes_requested" | "rejected" | null>(null);

  useEffect(() => {
    fetch(`/api/approvals/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setApproval(data);
      })
      .catch(() => setError("Falha ao carregar aprovação"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async () => {
    if (!choice) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/approvals/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: choice, clientFeedback: feedback }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSubmitted(true);
        setApproval((prev) => prev ? { ...prev, status: choice } : prev);
      }
    } catch {
      setError("Falha ao enviar resposta");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-brass border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-8xl mb-6">🔒</div>
          <h1 className="text-2xl font-bold text-marble mb-3">Link inválido ou expirado</h1>
          <p className="text-stone">{error}</p>
        </div>
      </div>
    );
  }

  const alreadyAnswered = approval?.status !== "pending";

  return (
    <div className="min-h-screen bg-void flex flex-col">
      {/* Header */}
      <div className="bg-void border-b border-graphite px-6 py-4 flex items-center justify-center">
        <span className="font-bold tracking-[0.3em] text-xl text-marble">
          E T E R<span className="text-brass">.</span>
        </span>
      </div>

      <div className="flex-1 flex items-start justify-center pt-12 px-4 pb-16">
        <div className="w-full max-w-xl">
          {/* Status banner */}
          {alreadyAnswered && !submitted && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-brass/10 border border-brass/30">
              <AlertCircle className="h-5 w-5 text-brass shrink-0" />
              <p className="text-sm text-champagne">
                Esta aprovação já foi respondida como <strong>{
                  approval?.status === "approved" ? "Aprovado" :
                  approval?.status === "changes_requested" ? "Alterações solicitadas" :
                  "Reprovado"
                }</strong>.
              </p>
            </div>
          )}

          {submitted && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <p className="text-sm text-champagne">
                Resposta enviada! Obrigado.
              </p>
            </div>
          )}

          {/* Card */}
          <div className="bg-void border border-graphite rounded-2xl overflow-hidden shadow-xl">
            {/* Project info */}
            <div className="bg-charcoal px-6 py-5 border-b border-graphite">
              <p className="text-xs font-semibold tracking-widest uppercase text-brass mb-1">
                Solicitação de Aprovação
              </p>
              <h1 className="text-xl font-bold text-marble">
                {approval?.task?.title ?? "Material para revisão"}
              </h1>
              <p className="text-sm text-stone mt-1">
                Projeto: <span className="text-champagne">{approval?.project?.name}</span>
              </p>
              {approval?.requestedByUser && (
                <p className="text-sm text-stone mt-0.5">
                  Enviado por: <span className="text-champagne">{approval.requestedByUser.name}</span>
                </p>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* Task description */}
              {approval?.task?.description && (
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-2">Descrição</p>
                  <p className="text-sm text-champagne leading-relaxed">{approval.task.description}</p>
                </div>
              )}

              {/* Notes from team */}
              {approval?.notes && (
                <div className="bg-brass/5 border border-brass/20 rounded-xl p-4">
                  <p className="text-xs font-semibold tracking-widest uppercase text-brass mb-2">Observações da equipe</p>
                  <p className="text-sm text-champagne">{approval.notes}</p>
                </div>
              )}

              {/* Action buttons */}
              {!alreadyAnswered && !submitted && (
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-3">Sua decisão</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "approved" as const, label: "Aprovar", icon: CheckCircle, color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20" },
                      { value: "changes_requested" as const, label: "Alterações", icon: MessageSquare, color: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20" },
                      { value: "rejected" as const, label: "Reprovar", icon: XCircle, color: "border-crimson/40 text-crimson bg-crimson/10 hover:bg-crimson/20" },
                    ].map(({ value, label, icon: Icon, color }) => (
                      <button
                        key={value}
                        onClick={() => setChoice(value)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all cursor-pointer",
                          color,
                          choice === value && "ring-2 ring-offset-2 ring-offset-void ring-current scale-105"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback textarea */}
              {!alreadyAnswered && !submitted && (
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-stone mb-2">
                    Comentário {choice === "approved" ? "(opcional)" : "(descreva as alterações)"}
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={
                      choice === "approved"
                        ? "Observações adicionais (opcional)..."
                        : choice === "changes_requested"
                        ? "Descreva o que deve ser alterado..."
                        : "Motivo da reprovação..."
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-charcoal border border-graphite rounded-xl text-marble placeholder:text-stone/50 text-sm focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/30 resize-none"
                  />
                </div>
              )}

              {/* Submit */}
              {!alreadyAnswered && !submitted && (
                <button
                  onClick={handleSubmit}
                  disabled={!choice || submitting}
                  className={cn(
                    "w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200",
                    choice
                      ? "bg-brass text-white hover:bg-navy cursor-pointer"
                      : "bg-graphite text-stone cursor-not-allowed"
                  )}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Enviando...
                    </span>
                  ) : "Enviar resposta"}
                </button>
              )}

              {/* Already answered display */}
              {(alreadyAnswered || submitted) && approval?.clientFeedback && (
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-2">Seu feedback</p>
                  <p className="text-sm text-champagne bg-charcoal rounded-xl px-4 py-3">{approval.clientFeedback}</p>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-stone/50 mt-6">
            Esta página é destinada exclusivamente para aprovação de materiais.
          </p>
        </div>
      </div>
    </div>
  );
}
