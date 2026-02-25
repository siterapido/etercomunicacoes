"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, MessageSquare, ExternalLink, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { PageTransition } from "@/components/ui/page-transition";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

interface Approval {
  id: string;
  status: "pending" | "approved" | "changes_requested" | "rejected";
  clientName: string | null;
  clientEmail: string | null;
  clientFeedback: string | null;
  notes: string | null;
  publicToken: string;
  createdAt: string;
  respondedAt: string | null;
  task: { id: string; title: string } | null;
  project: { id: string; name: string } | null;
  requestedByUser: { name: string; email: string } | null;
}

const STATUS_CONFIG = {
  pending: { label: "Aguardando", icon: Clock, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  approved: { label: "Aprovado", icon: CheckCircle, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  changes_requested: { label: "Alterações", icon: MessageSquare, color: "text-orange-400 bg-orange-400/10 border-orange-400/30" },
  rejected: { label: "Reprovado", icon: XCircle, color: "text-crimson bg-crimson/10 border-crimson/30" },
};

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Approval["status"]>("all");
  const [copied, setCopied] = useState<string | null>(null);

  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/approvals");
      const data = await res.json();
      if (!data.error) setApprovals(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const copyLink = async (token: string) => {
    const url = `${window.location.origin}/approve/${token}`;
    await navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = filter === "all"
    ? approvals
    : approvals.filter((a) => a.status === filter);

  const counts = {
    all: approvals.length,
    pending: approvals.filter((a) => a.status === "pending").length,
    approved: approvals.filter((a) => a.status === "approved").length,
    changes_requested: approvals.filter((a) => a.status === "changes_requested").length,
    rejected: approvals.filter((a) => a.status === "rejected").length,
  };

  return (
    <PageTransition>
    <div className="px-6 py-12 md:px-16 lg:px-24">
      <div className="flex items-center justify-between mb-8">
        <SectionHeader
          label="Aprovações"
          title="Gestão de Aprovações"
          className="mb-0"
        />
        <button
          onClick={fetchApprovals}
          className="flex items-center gap-2 text-sm text-stone hover:text-brass transition-colors cursor-pointer"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Atualizar
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "approved", "changes_requested", "rejected"] as const).map((status) => {
          const count = counts[status];
          const isActive = filter === status;
          const cfg = status === "all" ? null : STATUS_CONFIG[status];

          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer",
                isActive
                  ? "bg-brass text-white border-brass"
                  : "bg-void text-stone border-graphite hover:border-brass/30 hover:text-marble"
              )}
            >
              {status === "all" ? "Todas" : cfg?.label}
              <span className={cn(
                "text-xs rounded-full px-1.5 py-0.5 font-bold",
                isActive ? "bg-white/20 text-white" : "bg-graphite text-stone"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 rounded-full border-2 border-brass border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
          {filtered.map((approval, i) => {
            const cfg = STATUS_CONFIG[approval.status];
            const Icon = cfg.icon;
            const appUrl = typeof window !== "undefined" ? window.location.origin : "";

            return (
              <motion.div
                key={approval.id}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: i * 0.05 }}
              >
              <Card hoverable>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
                        cfg.color
                      )}>
                        <Icon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </span>
                      <span className="text-xs text-stone">
                        {formatDistanceToNow(new Date(approval.createdAt), { locale: ptBR, addSuffix: true })}
                      </span>
                    </div>

                    <h3 className="font-medium text-marble text-sm mb-1">
                      {approval.task?.title ?? "Tarefa removida"}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-stone">
                      <span>Projeto: <span className="text-champagne">{approval.project?.name ?? "—"}</span></span>
                      {approval.clientName && (
                        <span>Cliente: <span className="text-champagne">{approval.clientName}</span></span>
                      )}
                    </div>

                    {approval.notes && (
                      <p className="mt-2 text-xs text-stone bg-charcoal rounded-md px-3 py-2">
                        {approval.notes}
                      </p>
                    )}

                    {approval.clientFeedback && (
                      <div className="mt-2 text-xs bg-charcoal rounded-md px-3 py-2">
                        <span className="text-brass font-medium">Feedback: </span>
                        <span className="text-champagne">{approval.clientFeedback}</span>
                      </div>
                    )}

                    {approval.respondedAt && (
                      <p className="mt-1.5 text-xs text-stone">
                        Respondido em {format(new Date(approval.respondedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {approval.status === "pending" && (
                      <button
                        onClick={() => copyLink(approval.publicToken)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brass/30 text-xs text-brass hover:bg-brass hover:text-white transition-colors cursor-pointer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {copied === approval.publicToken ? "Copiado!" : "Copiar link"}
                      </button>
                    )}
                    {approval.clientEmail && (
                      <span className="text-xs text-stone px-3 py-2">
                        {approval.clientEmail}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
              </motion.div>
            );
          })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Card className="text-center py-16">
              <p className="text-stone text-sm">
                {filter === "all"
                  ? "Nenhuma aprovação ainda. Envie aprovações a partir do pipeline."
                  : `Nenhuma aprovação com status "${STATUS_CONFIG[filter as keyof typeof STATUS_CONFIG]?.label}".`}
              </p>
            </Card>
            </motion.div>
          )}
        </div>
      )}
    </div>
    </PageTransition>
  );
}
