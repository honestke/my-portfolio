"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Projects", href: "/#projects" },
  { label: "Research", href: "/#research" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
    >
      <nav
        className={`mt-4 flex w-full max-w-3xl items-center justify-between rounded-full px-5 transition-all duration-300 ${
          scrolled
            ? "glass-panel py-2.5 shadow-lg shadow-black/30"
            : "border border-transparent py-3.5"
        }`}
      >
        <Link href="/" className="font-display text-sm font-semibold text-white">
          Honest<span className="text-emerald">.</span>
        </Link>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-300 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
