"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-white/5"
    >
      {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy citation"}
    </button>
  );
}
