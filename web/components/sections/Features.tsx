import { Reveal } from "@/components/motion/Reveal";

const features = [
  {
    title: "Rust WebSocket backend",
    body: "An axum service holds a one-second tick, advances simulated metric series, and fans a JSON snapshot out to every client over a single broadcast channel.",
  },
  {
    title: "Streamed, never polled",
    body: "The frontend opens one WebSocket and reacts to pushes, so the dashboard reflects new data the instant the server produces it.",
  },
  {
    title: "Hand-drawn SVG charts",
    body: "The area chart, sparklines, and category bars build their own SVG paths from the data. No charting dependency, full control over every animation.",
  },
  {
    title: "Resilient by design",
    body: "The client reconnects with capped exponential backoff and surfaces an honest status: connecting, live, reconnecting, or offline.",
  },
  {
    title: "Animated in real time",
    body: "Values count up smoothly and bars spring to new heights, calming to instant updates when reduced motion is requested.",
  },
  {
    title: "Interactive filters",
    body: "Choose which metric the large chart plots; the selection reshapes the view live without interrupting the stream.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-6 py-32">
      <Reveal>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Features
        </p>
        <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          A full-stack pipeline, end to end
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={(index % 3) * 0.08}>
            <article className="group h-full rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-7 transition-colors hover:border-accent/40">
              <div className="mb-4 h-1 w-10 rounded-full bg-gradient-to-r from-emerald via-sky to-amber transition-all group-hover:w-16" />
              <h3 className="font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                {feature.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
