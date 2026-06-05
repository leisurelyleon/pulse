import { Reveal } from "@/components/motion/Reveal";

const stats = [
  { value: "1", label: "Persistent WebSocket" },
  { value: "4", label: "Live metric series" },
  { value: "1s", label: "Server tick interval" },
  { value: "0", label: "Polling requests" },
];

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-32">
      <div className="grid gap-16 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            About
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Streamed, not polled
          </h2>
          <p className="mt-6 text-foreground/70">
            A Rust service on Fly.io advances a set of simulated metric series
            once a second and broadcasts a single JSON snapshot to every
            connected client. The browser opens one WebSocket and simply reacts
            to what arrives.
          </p>
          <p className="mt-4 text-foreground/70">
            There is no interval timer hammering an API. When the connection
            drops, the client reconnects with exponential backoff and the
            dashboard reports its status honestly rather than freezing.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6">
                <div className="font-display text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-foreground/60">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
