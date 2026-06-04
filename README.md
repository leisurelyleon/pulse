# pulse

A single-page, real-time **analytics dashboard** streaming live metrics over a WebSocket. A **Rust + axum** service on Fly.io pushes simulated metric series to a **Next.js** frontend on Vercel, which renders hand-drawn SVG charts, animated count-ups, and live filters — never polling.

## Highlights

- **Rust WebSocket backend** — an axum service holds a one-second tick, advances a set of simulated metric series, and broadcasts a JSON snapshot to every connected client over a single fan-out channel.
- **Streamed, not polled** — the frontend opens one WebSocket and reacts to pushes, so the dashboard updates the instant new data is produced.
- **Hand-drawn SVG charts** — the area chart, category bars, and sparklines build their own SVG paths from the data. No charting library, full control over every animation.
- **Resilient client** — the WebSocket client reconnects with exponential backoff and surfaces an honest connection status (connecting, live, reconnecting, offline) rather than failing silently.
- **Animated, real-time** — number count-ups and chart transitions are spring-driven, calming to instant updates under reduced motion.
- **Single-page, scroll-to-section** navigation with an active-link scroll spy, light/dark theming, live filters, and full responsive breakpoints.

## Tech stack

**Frontend:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · hand-drawn SVG
**Backend:** Rust · axum · tokio · serde (deployed on Fly.io)

## Project structure

| Path | Purpose |
| --- | --- |
| `server/src/` | Rust WebSocket service — axum app, WS handler, metric generator, wire types |
| `server/Dockerfile` | Multi-stage release build for Fly.io |
| `server/fly.toml` | Always-on Fly machine configuration |
| `web/app/` | App Router entry — layout, single-page composition, global styles |
| `web/components/dashboard/` | Hand-drawn charts, stat cards, and the filter bar |
| `web/lib/ws/` | Resilient WebSocket client and the shared wire types |
| `web/lib/hooks/` | Metrics stream, scroll spy, theme, and reduced-motion hooks |

## Local development

Run the server and the web app in two terminals.

```bash
# terminal 1 — the metrics service
cd server
cargo run
# serves http://localhost:8080 (WebSocket at /ws)
```

```bash
# terminal 2 — the dashboard
cd web
npm install
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run typecheck` | TypeScript, no emit |
| `cargo run` | Run the metrics service |
| `cargo build --release` | Release build of the server |

## Deployment

- **Backend → Fly.io.** The server deploys from `server/` via its Dockerfile, on an always-on machine so the live stream never cold-starts.
- **Frontend → Vercel** with the project **Root Directory set to `web`**, and the environment variable `NEXT_PUBLIC_WS_URL` set to `wss://<your-app>.fly.dev/ws` (no trailing slash).

## License

MIT — see [LICENSE](./LICENSE).
