export type TimelineEntry = {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  description?: string | null;
  bullets?: string[];
};

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative space-y-6 border-l border-black/10 pl-6 dark:border-white/10">
      {entries.map((entry) => (
        <div key={entry.id} className="relative">
          <span className="absolute -left-[29px] top-6 h-2.5 w-2.5 rounded-full bg-emerald ring-4 ring-background" />
          <div className="glass-panel rounded-2xl p-5 transition hover:border-emerald/30">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-neutral-900 dark:text-white">
                {entry.title}
              </h3>
              <span className="text-xs text-neutral-500">{entry.dateRange}</span>
            </div>
            <p className="text-sm text-emerald">{entry.subtitle}</p>
            {entry.description && (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{entry.description}</p>
            )}
            {entry.bullets && entry.bullets.length > 0 && (
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                {entry.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
