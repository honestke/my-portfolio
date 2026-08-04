"use client";

import { Star, GitFork, ExternalLink } from "lucide-react";
import type { GitHubRepo } from "@/lib/github";
import { trackEvent } from "@/lib/track-client";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
};

export function GitHubRepoCard({ repo }: { repo: GitHubRepo }) {
  const color = repo.language ? LANGUAGE_COLORS[repo.language] ?? "#8b949e" : null;

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent("outbound_click", { target: repo.html_url })}
      className="glass-panel group flex flex-col rounded-xl p-5 transition hover:border-emerald/30"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display truncate text-sm font-semibold text-neutral-900 dark:text-white">{repo.name}</h3>
        <ExternalLink size={14} className="shrink-0 text-neutral-500 group-hover:text-emerald" />
      </div>

      <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs text-neutral-600 dark:text-neutral-400">
        {repo.description ?? "No description provided."}
      </p>

      <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color ?? undefined }} />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star size={12} />
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <GitFork size={12} />
          {repo.forks_count}
        </span>
      </div>

      <p className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-600">
        Updated {new Date(repo.updated_at).toLocaleDateString()}
      </p>
    </a>
  );
}
