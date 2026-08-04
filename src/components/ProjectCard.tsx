"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Download, ExternalLink, GitBranch } from "lucide-react";
import type { Project } from "@/lib/types";
import { projectAssetUrl } from "@/lib/supabase/storage";
import { trackEvent } from "@/lib/track-client";

export function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  const thumbnailUrl = projectAssetUrl(project.thumbnail_path);
  const fileUrl = projectAssetUrl(project.file_path);
  const date = project.project_date
    ? new Date(project.project_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : null;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-emerald/10"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-600">
            No thumbnail
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          {project.category && (
            <span className="rounded-full bg-emerald/15 px-2.5 py-0.5 text-xs font-medium text-emerald">
              {project.category}
            </span>
          )}
          {date && <span className="text-xs text-neutral-500">{date}</span>}
        </div>

        <h3 className="font-display mt-3 text-lg font-semibold text-white">
          {project.title}
        </h3>

        {project.description && (
          <p className="mt-2 line-clamp-3 text-sm text-neutral-400">
            {project.description}
          </p>
        )}

        {project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-neutral-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2 pt-1">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("outbound_click", { target: project.demo_url! })}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald px-3 py-1.5 text-xs font-medium text-black transition hover:brightness-110"
            >
              <ExternalLink size={14} />
              Preview
            </a>
          )}
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("download", { target: project.title })}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-white/5"
            >
              <Download size={14} />
              Download
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("outbound_click", { target: project.github_url! })}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-white/5"
            >
              <GitBranch size={14} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
