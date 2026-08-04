export function MouseGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/hero:opacity-100"
      style={{
        background:
          "radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in srgb, var(--emerald) 15%, transparent), transparent 60%)",
      }}
    />
  );
}
