"use client";

import { motion } from "framer-motion";
import {
  Layers,
  CheckSquare,
  CalendarClock,
  Sparkles,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/utils/animations";
import { Card } from "@/components/ui/card";

interface MetricsSectionProps {
  metrics: {
    tasksInProduction: number;
    pendingApprovals: number;
    deadlinesThisWeek: number;
    aiGenerations: number;
  };
}

const metricCards = [
  {
    key: "tasksInProduction" as const,
    label: "Tarefas em producao",
    icon: Layers,
    change: +3,
    changeLabel: "vs. ontem",
    bgAccent: "bg-teal-light",
  },
  {
    key: "pendingApprovals" as const,
    label: "Aprovacoes pendentes",
    icon: CheckSquare,
    change: -2,
    changeLabel: "vs. ontem",
    bgAccent: "bg-amber/10",
  },
  {
    key: "deadlinesThisWeek" as const,
    label: "Prazos esta semana",
    icon: CalendarClock,
    change: 0,
    changeLabel: "sem alteracao",
    bgAccent: "bg-crimson/10",
  },
  {
    key: "aiGenerations" as const,
    label: "Geracoes com IA",
    icon: Sparkles,
    change: +12,
    changeLabel: "vs. semana passada",
    bgAccent: "bg-emerald/10",
  },
];

export function MetricsSection({ metrics }: MetricsSectionProps) {
  return (
    <section>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metricCards.map((card) => (
            <motion.div key={card.key} variants={fadeInUp}>
              <Card hoverable className="group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${card.bgAccent} transition-colors`}>
                    <card.icon className="w-5 h-5 text-brass" />
                  </div>
                </div>

                <p className="font-[family-name:var(--font-display)] text-[40px] leading-none font-bold text-marble mb-1">
                  {metrics[card.key]}
                </p>

                <p className="text-[13px] text-stone tracking-wide mb-3">
                  {card.label}
                </p>

                <div className="flex items-center gap-1.5 text-xs">
                  {card.change > 0 ? (
                    <>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald" />
                      <span className="text-emerald font-medium">+{card.change}</span>
                    </>
                  ) : card.change < 0 ? (
                    <>
                      <TrendingDown className="w-3.5 h-3.5 text-crimson" />
                      <span className="text-crimson font-medium">{card.change}</span>
                    </>
                  ) : (
                    <span className="text-stone">--</span>
                  )}
                  <span className="text-stone">{card.changeLabel}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
