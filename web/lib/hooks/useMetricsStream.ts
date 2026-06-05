"use client";

import { useEffect, useState } from "react";
import { MetricsClient } from "@/lib/ws/client";
import type { ConnectionStatus, Snapshot } from "@/lib/ws/types";
import { resolveWsUrl } from "@/lib/constants";

export interface UseMetricsStream {
  snapshot: Snapshot | null;
  status: ConnectionStatus;
}

/**
 * Subscribes to the metrics WebSocket for the lifetime of the component,
 * exposing the latest snapshot and an honest connection status. The single
 * connection is owned here and torn down on unmount.
 */
export function useMetricsStream(): UseMetricsStream {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    const client = new MetricsClient(resolveWsUrl(), {
      onSnapshot: setSnapshot,
      onStatus: setStatus,
    });
    client.connect();
    return () => client.close();
  }, []);

  return { snapshot, status };
}
