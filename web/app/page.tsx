/**
 * Single-page composition. Sections are added in subsequent batches; this
 * minimal hero locks a green build first and shows the theme + fonts wired up.
 */
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pulse-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/30 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-foreground/70 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Live over WebSocket
        </p>

        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-7xl md:text-8xl">
          Metrics that
          <span className="block bg-gradient-to-r from-emerald via-sky to-amber bg-clip-text text-transparent">
            move in real time
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-foreground/70 sm:text-lg">
          A single-page dashboard streaming live data from a Rust service over a
          WebSocket, rendered with hand-drawn SVG charts.
        </p>
      </section>
    </main>
  );
}
