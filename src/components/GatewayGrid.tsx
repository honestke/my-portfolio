"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, LayoutGrid, Gamepad2, BookOpen, Mail, GitBranch } from "lucide-react";
import { trackEvent } from "@/lib/track-client";

type GatewayItem = {
  icon: typeof LayoutGrid;
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

function buildItems(githubUsername: string): GatewayItem[] {
  return [
    {
      icon: LayoutGrid,
      title: "Portfolio",
      description: "Skills, experience, projects, certifications & research.",
      href: "/portfolio",
    },
    {
      icon: Gamepad2,
      title: "Funzone",
      description: "Games, calculators & interactive experiments.",
      href: "/funzone",
    },
    {
      icon: BookOpen,
      title: "Blog",
      description: "Writing on data, engineering & everything between.",
      href: "/blog",
    },
    {
      icon: Mail,
      title: "Contact",
      description: "Let's talk about opportunities or collaborations.",
      href: "/contact",
    },
    {
      icon: GitBranch,
      title: "GitHub",
      description: "Open source work and live repository activity.",
      href: `https://github.com/${githubUsername}`,
      external: true,
    },
  ];
}

export function GatewayGrid({ githubUsername }: { githubUsername: string }) {
  const items = buildItems(githubUsername);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const Icon = item.icon;
        const card = (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="glass-panel group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 transition hover:border-emerald/40 hover:shadow-2xl hover:shadow-emerald/10"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="glass-panel flex h-11 w-11 items-center justify-center rounded-xl text-emerald">
                  <Icon size={20} />
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-neutral-400 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald dark:text-neutral-600"
                />
              </div>
              <h3 className="font-display mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
            </div>
          </motion.div>
        );

        if (item.external) {
          return (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("outbound_click", { target: item.href })}
            >
              {card}
            </a>
          );
        }

        return (
          <Link key={item.title} href={item.href}>
            {card}
          </Link>
        );
      })}
    </div>
  );
}
