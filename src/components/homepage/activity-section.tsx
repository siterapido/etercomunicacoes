"use client";

import { motion } from "framer-motion";
import { Sparkles, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/utils/animations";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

interface Activity {
  id: string;
  userName: string;
  action: string;
  targetName: string;
  time: string;
}

interface ActivitySectionProps {
  activities: Activity[];
}

export function ActivitySection({ activities }: ActivitySectionProps) {
  return (
    <section>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="space-y-5"
      >
        <motion.div variants={fadeInUp}>
          <SectionHeader
            label="Atividade Recente"
            title="O que esta acontecendo"
            className="mb-5"
          />
        </motion.div>

        {/* Activity Timeline */}
        <motion.div variants={fadeInUp}>
          <Card className="p-0">
            <div className="relative pl-8 pr-5 py-5">
              {/* Vertical Line */}
              <div className="absolute left-[18px] top-5 bottom-5 w-px bg-gradient-to-b from-brass via-graphite to-transparent" />

              <div className="space-y-0">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="relative group">
                    {/* Dot */}
                    <div
                      className={cn(
                        "absolute -left-[14px] top-[14px] w-2 h-2 rounded-full border-2 transition-colors",
                        index === 0
                          ? "bg-brass border-brass"
                          : "bg-void border-alabaster group-hover:border-brass"
                      )}
                    />

                    <div className="py-3 pl-3 rounded-lg hover:bg-teal-50 transition-colors">
                      <p className="text-[11px] text-stone mb-0.5">
                        {activity.time}
                      </p>
                      <p className="text-sm text-champagne leading-relaxed">
                        <span className="text-marble font-medium">
                          {activity.userName}
                        </span>{" "}
                        {activity.action}{" "}
                        {activity.targetName && (
                          <span className="text-brass font-medium">
                            {activity.targetName}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Preview */}
        <motion.div variants={fadeInUp}>
          <Card hoverable>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-teal-light">
                <Sparkles className="w-4 h-4 text-brass" />
              </div>
              <div>
                <p className="text-sm font-medium text-marble">
                  Assistente IA
                </p>
                <p className="text-[11px] text-stone">
                  Ultima geracao
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-brass mb-2">
                Legenda gerada
              </p>
              <p className="text-[11px] tracking-[0.1em] uppercase text-stone mb-2">
                Construtora Apex - Instagram
              </p>
            </div>

            <div className="bg-teal-50 border border-graphite rounded-lg p-4 mb-3">
              <p className="text-sm text-champagne leading-relaxed">
                &quot;Cada detalhe importa. Do concreto ao acabamento, a
                Construtora Apex transforma visoes em enderecos. Conheca
                nosso novo empreendimento.&quot;
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald" />
                <span className="text-[11px] text-stone">
                  Variacao 1 de 3
                </span>
              </div>
              <button className="flex items-center gap-1.5 text-[11px] text-stone hover:text-brass transition-colors cursor-pointer">
                <Copy className="w-3.5 h-3.5" />
                Copiar
              </button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
