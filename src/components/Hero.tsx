"use client";

import { motion } from "framer-motion";
import { TypingRoles } from "./TypingRoles";

export function Hero() {
  return (
    <section
      id="home"
      className="gradient-mesh-bg relative flex min-h-screen items-center overflow-hidden px-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-emerald/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-full bg-emerald/40 blur-2xl" />
          <div className="glass-panel flex h-32 w-32 items-center justify-center rounded-full border-emerald/40 text-3xl font-display font-semibold text-neutral-900 dark:text-white sm:h-36 sm:w-36">
            HM
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h1 className="font-display text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-6xl">
            HONEST MBEHEZE
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
            href="#projects"
            className="rounded-full bg-emerald px-6 py-3 text-sm font-medium text-black transition hover:brightness-110"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="glass-panel rounded-full px-6 py-3 text-sm font-medium text-neutral-900 transition hover:border-emerald/40 dark:text-white"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
