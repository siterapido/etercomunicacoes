"use client";

import { useState } from "react";
import { X, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SendApprovalModalProps {
  taskId: string;
  taskTitle: string;
  defaultEmail?: string;
  defaultClientName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SendApprovalModal({
  taskId,
  taskTitle,
  defaultEmail = "",
  defaultClientName = "",
  onClose,
  onSuccess,
}: SendApprovalModalProps) {
  const [clientEmail, setClientEmail] = useState(defaultEmail);
  const [clientName, setClientName] = useState(defaultClientName);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [approvalLink, setApprovalLink] = useState("");

  const handleSend = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, clientEmail, clientName, notes }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        const link = `${window.location.origin}/approve/${data.publicToken}`;
        setApprovalLink(link);
        setSuccess(true);
        onSuccess?.();
      }
    } catch {
      setError("Falha ao criar aprovação");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(approvalLink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-void border border-graphite rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-graphite">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brass/10 rounded-lg">
              <Send className="h-4 w-4 text-brass" />
            </div>
            <div>
              <h2 className="font-semibold text-marble text-sm">Enviar para aprovação</h2>
              <p className="text-xs text-stone truncate max-w-48">{taskTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone hover:text-marble hover:bg-teal-light transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-400">Aprovação criada!</p>
                  <p className="text-xs text-stone mt-0.5">
                    {clientEmail ? `Email enviado para ${clientEmail}` : "Link gerado com sucesso"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-stone mb-2">Link de aprovação</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={approvalLink}
                    className="flex-1 h-9 px-3 bg-charcoal border border-graphite rounded-lg text-xs text-stone focus:outline-none"
                  />
                  <button
                    onClick={copyLink}
                    className="px-3 py-2 bg-brass text-white text-xs rounded-lg hover:bg-navy transition-colors cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <Button variant="outline" onClick={onClose} className="w-full">
                Fechar
              </Button>
            </div>
          ) : (
            <>
              <Input
                id="client-name"
                label="Nome do cliente (opcional)"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: João Silva / Construtora Apex"
              />
              <Input
                id="client-email"
                type="email"
                label="Email do cliente (opcional)"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="cliente@empresa.com"
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-widest text-stone">
                  Observações (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contexto adicional para o cliente..."
                  rows={3}
                  className="w-full px-4 py-3 bg-charcoal border border-graphite rounded-lg text-marble placeholder:text-stone/50 text-sm focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/30 resize-none"
                />
              </div>

              {error && <p className="text-sm text-crimson">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" onClick={onClose} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSend} loading={loading} className="flex-1">
                  <Send className="h-4 w-4" />
                  {clientEmail ? "Enviar email" : "Gerar link"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
