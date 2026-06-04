# pulse
Real-time analytics dashboard streaming live metrics over a WebSocket. A Rust + axum service on Fly.io pushes simulated random-walk series to a Next.js frontend that renders hand-drawn SVG charts, animated count-ups, and live filters — with exponential-backoff reconnect and an honest connection status. TypeScript + Tailwind, deployed on Vercel.
