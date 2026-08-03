export function PlaceholderSection({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <div className="mt-8 rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
        <p className="text-sm text-neutral-400">
          This section hasn&apos;t been built yet — it&apos;s coming in a
          later phase.
        </p>
      </div>
    </div>
  );
}
