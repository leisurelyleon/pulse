import type { EngineSeriesColor } from "@/lib/ws/types";

export interface NavItem {
  id: string;
  label: string;
}

/**
 * Single source of truth for the nav and the scroll-spy. Exported as a stable
 * module-level constant so hooks can depend on it without re-running effects.
 */
export const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "dashboard", label: "Dashboard" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "contact", label: "Contact" },
];

export const SECTION_IDS: string[] = NAV_ITEMS.map((item) => item.id);

/**
 * Resolve the WebSocket endpoint. In production this comes from the Vercel
 * environment variable; locally it falls back to the dev server.
 */
export function resolveWsUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WS_URL;
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv;
  }
  return "ws://localhost:8080/ws";
}

/** One hue per metric series, matching the Tailwind fixed palette. */
export const SERIES_COLORS: Record<string, EngineSeriesColor> = {
  rps: "#34d399",
  latency: "#38bdf8",
  cpu: "#fbbf24",
  active: "#fb7185",
};

export const DEFAULT_SERIES_COLOR: EngineSeriesColor = "#34d399";

/** Colors for the categorical bar panel, in order. */
export const CATEGORY_COLORS: EngineSeriesColor[] = [
  "#34d399",
  "#38bdf8",
  "#fbbf24",
  "#fb7185",
];
