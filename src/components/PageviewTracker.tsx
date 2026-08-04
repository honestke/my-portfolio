"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/track-client";

export function PageviewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/login")) return;
    trackEvent("pageview", { path: pathname });
  }, [pathname]);

  return null;
}
