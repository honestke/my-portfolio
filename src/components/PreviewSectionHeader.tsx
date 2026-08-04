import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PreviewSectionHeader({
  kicker,
  title,
  href,
  linkLabel = "View All",
}: {
  kicker: string;
  title: string;
  href: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display mb-1 text-sm font-semibold uppercase tracking-widest text-emerald">
          {kicker}
        </h2>
        <p className="font-display text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">
          {title}
        </p>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-emerald/40 hover:text-emerald dark:border-white/10 dark:text-neutral-300"
      >
        {linkLabel}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
