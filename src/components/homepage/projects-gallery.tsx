"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/utils/animations";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";

interface Project {
  id: string;
  clientName: string;
  name: string;
  progress: number;
  remainingTasks: number;
  coverImage: string;
}

interface ProjectsGalleryProps {
  projects: Project[];
}

export function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  return (
    <section>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeInUp}
          className="flex items-end justify-between mb-5"
        >
          <SectionHeader
            label="Portfolio Ativo"
            title="Projetos em andamento"
            className="mb-0"
          />

          <Link
            href="/projects"
            className="group flex items-center gap-1.5 text-[13px] font-medium text-brass hover:text-navy transition-colors no-underline"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="no-underline block group"
    >
      <Card hoverable className="p-0 overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-36 overflow-hidden">
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/80">
              {project.clientName}
            </p>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white leading-tight">
              {project.name}
            </h3>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center justify-between text-[12px] text-stone mb-2">
            <span>Progresso</span>
            <span className="text-brass font-semibold">{project.progress}%</span>
          </div>
          <div className="h-1.5 bg-graphite rounded-full overflow-hidden">
            <div
              className="h-full bg-brass rounded-full transition-all duration-700"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="text-[12px] text-stone mt-2">
            {project.remainingTasks}{" "}
            {project.remainingTasks === 1
              ? "tarefa restante"
              : "tarefas restantes"}
          </p>
        </div>
      </Card>
    </Link>
  );
}
