import type { ConnectionStatus, Snapshot } from "@/lib/ws/types";

interface MetricsClientHandlers {
  onSnapshot: (snapshot: Snapshot) => void;
  onStatus: (status: ConnectionStatus) => void;
}

const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 15000;
const MAX_RETRIES_BEFORE_OFFLINE = 6;

/**
 * A resilient WebSocket client for the metrics stream.
 *
 * Connects, parses each snapshot, and on an unexpected close reconnects with
 * exponential backoff (capped, with jitter). Status is reported through a
 * callback so the UI can show connecting / live / reconnecting / offline
 * honestly instead of silently freezing.
 */
export class MetricsClient {
  private readonly url: string;
  private readonly handlers: MetricsClientHandlers;

  private socket: WebSocket | null = null;
  private retries = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;

  constructor(url: string, handlers: MetricsClientHandlers) {
    this.url = url;
    this.handlers = handlers;
  }

  /** Open the connection (or reconnect). Safe to call once per instance. */
  connect(): void {
    if (typeof window === "undefined" || typeof WebSocket === "undefined") {
      this.handlers.onStatus("offline");
      return;
    }

    this.stopped = false;
    this.handlers.onStatus(this.retries === 0 ? "connecting" : "reconnecting");

    let socket: WebSocket;
    try {
      socket = new WebSocket(this.url);
    } catch {
      this.scheduleReconnect();
      return;
    }
    this.socket = socket;

    socket.onopen = () => {
      this.retries = 0;
      this.handlers.onStatus("live");
    };

    socket.onmessage = (event) => {
      try {
        const snapshot = JSON.parse(event.data as string) as Snapshot;
        this.handlers.onSnapshot(snapshot);
      } catch {
        // Ignore malformed frames rather than tearing down the connection.
      }
    };

    socket.onerror = () => {
      // onerror is followed by onclose; let onclose drive reconnection.
      socket.close();
    };

    socket.onclose = () => {
      this.socket = null;
      if (!this.stopped) {
        this.scheduleReconnect();
      }
    };
  }

  private scheduleReconnect(): void {
    if (this.stopped) {
      return;
    }
    this.retries += 1;
    this.handlers.onStatus(
      this.retries >= MAX_RETRIES_BEFORE_OFFLINE ? "offline" : "reconnecting",
    );

    const backoff = Math.min(
      BASE_DELAY_MS * 2 ** (this.retries - 1),
      MAX_DELAY_MS,
    );
    const jitter = Math.random() * 300;

    this.clearTimer();
    this.reconnectTimer = setTimeout(() => this.connect(), backoff + jitter);
  }

  private clearTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /** Permanently close the client and stop reconnecting. */
  close(): void {
    this.stopped = true;
    this.clearTimer();
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
    }
  }
}
