"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2">
      <a
        href={xShareUrl}
        target="_blank"
        rel="noreferrer"
        className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-neutral-300 transition hover:text-white"
        aria-label="Share on X"
      >
        <span className="text-sm font-semibold">X</span>
      </a>
      <a
        href={linkedinShareUrl}
        target="_blank"
        rel="noreferrer"
        className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-neutral-300 transition hover:text-white"
        aria-label="Share on LinkedIn"
      >
        <span className="text-xs font-bold">in</span>
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-neutral-300 transition hover:text-white"
        aria-label="Copy link"
      >
        {copied ? <Check size={16} className="text-emerald" /> : <Link2 size={16} />}
      </button>
    </div>
  );
}
