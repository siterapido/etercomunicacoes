"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/utils/animations";

interface HeroSectionProps {
  userName: string;
  pendingTasks: number;
  pendingApprovals: number;
  upcomingDeadlines: number;
}

export function HeroSection({
  userName,
  pendingTasks,
  pendingApprovals,
  upcomingDeadlines,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentDate, setCurrentDate] = useState("");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  const [firstName, lastName] = userName.split(" ");

  const summaryItems = [
    { icon: CheckCircle, label: "tarefas pendentes", value: pendingTasks },
    { icon: Clock, label: "aprovacoes", value: pendingApprovals },
    { icon: AlertTriangle, label: "prazo esta semana", value: upcomingDeadlines },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Video Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: videoScale }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.3) contrast(1.1)" }}
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-aerial-view-of-modern-architecture-2461/1080p.mp4"
            type="video/mp4"
          />
        </video>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-void/60 via-transparent to-void" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        style={{ y: contentY, opacity }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Greeting */}
          <motion.p
            variants={fadeInUp}
            className="text-[13px] font-semibold tracking-[0.3em] uppercase text-champagne mb-6"
          >
            Bem-vindo de volta
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={fadeInUp}
            className="font-[family-name:var(--font-display)] text-[clamp(48px,8vw,96px)] leading-[0.95] font-bold mb-8"
          >
            <span className="text-marble">{firstName}</span>
            <br />
            <span className="text-brass italic">{lastName}</span>
          </motion.h1>

          {/* Summary */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-6 mb-8 flex-wrap justify-center"
          >
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-champagne/80"
              >
                <item.icon className="w-4 h-4 text-brass" />
                <span className="text-sm font-[family-name:var(--font-body)]">
                  <span className="text-marble font-semibold">{item.value}</span>{" "}
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Date */}
          <motion.p
            variants={fadeInUp}
            className="text-[13px] tracking-[0.15em] text-stone"
          >
            {currentDate}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-stone">
          Scroll
        </span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-brass to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <ChevronDown className="w-4 h-4 text-stone animate-bounce" />
      </motion.div>
    </section>
  );
}
