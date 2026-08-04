"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type OrbitIcon = {
  icon: LucideIcon;
  label: string;
};

export function OrbitingIcons({
  icons,
  radius,
  duration = 24,
}: {
  icons: OrbitIcon[];
  radius: number;
  duration?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {icons.map(({ icon: Icon, label }, i) => {
        const angle = (360 / icons.length) * i;
        return (
          <motion.div
            key={label}
            className="absolute left-1/2 top-1/2 h-9 w-9 -ml-[18px] -mt-[18px]"
            animate={{ rotate: 360 }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute left-1/2 top-1/2 -ml-[18px] -mt-[18px] h-9 w-9"
              style={{ transform: `rotate(${angle}deg) translateX(${radius}px)` }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration, repeat: Infinity, ease: "linear" }}
                className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-emerald shadow-lg"
                title={label}
              >
                <Icon size={16} />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
