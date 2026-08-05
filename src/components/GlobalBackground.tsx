"use client";

import { usePathname } from "next/navigation";
import { ParticleNetwork } from "./ParticleNetwork";

export function GlobalBackground() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/login");

  if (isAdminRoute) return null;

  return <ParticleNetwork />;
}
