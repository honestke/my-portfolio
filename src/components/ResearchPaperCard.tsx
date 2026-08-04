import Link from "next/link";
import type { ResearchPaper } from "@/lib/types";

export function ResearchPaperCard({ paper }: { paper: ResearchPaper }) {
  const date = paper.publish_date
    ? new Date(paper.publish_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : null;

  return (
    <Link
      href={`/research/${paper.slug}`}
      className="glass-panel group flex flex-col rounded-2xl p-6 transition hover:border-emerald/30"
    >
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        {date && <span>{date}</span>}
        {paper.authors && (
          <>
            <span>·</span>
            <span>{paper.authors}</span>
          </>
        )}
      </div>

      <h3 className="font-display mt-3 text-lg font-semibold text-white">{paper.title}</h3>

      {paper.abstract && (
        <p className="mt-2 line-clamp-3 text-sm text-neutral-400">{paper.abstract}</p>
      )}

      {paper.keywords.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {paper.keywords.slice(0, 4).map((kw) => (
            <span
              key={kw}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-neutral-300"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      <span className="font-display mt-4 text-sm font-medium text-emerald">Read paper →</span>
    </Link>
  );
}
