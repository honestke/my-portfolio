"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}
