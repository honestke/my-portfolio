"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Code2, Database, Brain, Blocks, BarChart3 } from "lucide-react";
import { TypingRoles } from "./TypingRoles";
import { ParticleNetwork } from "./ParticleNetwork";
import { MouseGlow } from "./MouseGlow";
import { OrbitingIcons } from "./OrbitingIcons";

const ORBIT_ICONS = [
  { icon: Code2, label: "Full Stack" },
  { icon: Database, label: "Data" },
  { icon: Brain, label: "AI" },
  { icon: Blocks, label: "Blockchain" },
  { icon: BarChart3, label: "Analytics" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [12, -12]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-12, 12]), { stiffness: 150, damping: 15 });

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      sectionRef.current!.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
      sectionRef.current!.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
    }

    const avatarRect = avatarRef.current?.getBoundingClientRect();
    if (avatarRect) {
      mouseX.set((e.clientX - avatarRect.left) / avatarRect.width);
      mouseY.set((e.clientY - avatarRect.top) / avatarRect.height);
    }
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group/hero gradient-mesh-bg relative flex min-h-screen items-center overflow-hidden px-6"
    >
      <ParticleNetwork />
      <MouseGlow />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-emerald/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-40 w-40 sm:h-44 sm:w-44"
          style={{ perspective: 800 }}
        >
          <div className="absolute inset-0 -z-10 rounded-full bg-emerald/40 blur-2xl" />
          <OrbitingIcons icons={ORBIT_ICONS} radius={95} />
          <motion.div
            ref={avatarRef}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="glass-panel flex h-32 w-32 items-center justify-center rounded-full border-emerald/40 text-3xl font-display font-semibold text-neutral-900 dark:text-white sm:h-36 sm:w-36 sm:mx-auto"
          >
            HC
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h1 className="font-display text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-6xl">
            HONEST CO.
          </h1>
          <p className="mt-4 h-8 text-lg font-medium sm:text-2xl">
            <TypingRoles />
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl text-neutral-600 dark:text-neutral-400"
        >
          Building data-driven products and clean, thoughtful software —
          from dashboards to full-stack applications.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/portfolio"
            className="rounded-full bg-emerald px-6 py-3 text-sm font-medium text-black transition hover:scale-105 hover:brightness-110"
          >
            View Portfolio
          </a>
          <a
            href="/contact"
            className="glass-panel rounded-full px-6 py-3 text-sm font-medium text-neutral-900 transition hover:scale-105 hover:border-emerald/40 dark:text-white"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1, duration: 0.6 }, y: { delay: 1.2, duration: 1.8, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-400 dark:text-neutral-600"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
