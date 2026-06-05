/**
 * Wire types — the TypeScript mirror of the Rust `model.rs` shapes serialized
 * over the WebSocket. Kept in deliberate sync with the server by hand.
 */

export interface Series {
  id: string;
  label: string;
  unit: string;
  value: number;
  delta: number;
  history: number[];
}

export interface Category {
  label: string;
  value: number;
}

export interface Snapshot {
  ts: number;
  series: Series[];
  categories: Category[];
}

/** Lifecycle of the live connection, surfaced honestly in the UI. */
export type ConnectionStatus =
  | "connecting"
  | "live"
  | "reconnecting"
  | "offline";

/** A hex color string used for chart strokes and fills. */
export type EngineSeriesColor = string;
