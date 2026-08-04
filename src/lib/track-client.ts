"use client";

export function trackEvent(kind: "pageview" | "download" | "outbound_click", extra: { path?: string; target?: string } = {}) {
  const body = JSON.stringify({ kind, ...extra });

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
    return;
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
