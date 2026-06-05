"use client";

import { useState } from "react";
import { useMetricsStream } from "@/lib/hooks/useMetricsStream";
import { StatCard } from "@/components/dashboard/StatCard";
import { AreaChart } from "@/components/dashboard/AreaChart";
import { BarPanel } from "@/components/dashboard/BarPanel";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { SERIES_COLORS, DEFAULT_SERIES_COLOR } from "@/lib/constants";
import type { ConnectionStatus } from "@/lib/ws/types";

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connecting: "Connecting",
  live: "Live",
  reconnecting: "Reconnecting",
  offline: "Offline",
};

const STATUS_COLOR: Record<ConnectionStatus, string> = {
  connecting: "bg-amber",
  live: "bg-emerald",
  reconnecting: "bg-amber",
  offline: "bg-rose",
};

function StatusPill({ status }: { status: ConnectionStatus }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/40 px-3 py-1 text-xs font-medium text-foreground/70">
      <span
        className={`h-2 w-2 rounded-full ${STATUS_COLOR[status]} ${status === "live" ? "animate-pulse" : ""}`}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

/**
 * The centerpiece. Owns the single metrics stream and lays out the live stat
 * tiles, the selectable area chart, and the categorical bar panel.
 */
export function Dashboard() {
  const { snapshot, status } = useMetricsStream();
  const [selectedId, setSelectedId] = useState("rps");

  const series = snapshot?.series ?? [];
  const categories = snapshot?.categories ?? [];
  const selected = series.find((s) => s.id === selectedId) ?? series[0];
  const selectedColor = selected
    ? (SERIES_COLORS[selected.id] ?? DEFAULT_SERIES_COLOR)
    : DEFAULT_SERIES_COLOR;

  return (
    <section id="dashboard" className="relative mx-auto max-w-6xl px-6 py-32">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            Dashboard
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Live, the moment it happens
          </h2>
        </div>
        <StatusPill status={status} />
      </div>

      {series.length === 0 ? (
        <div className="grid-texture flex h-64 items-center justify-center rounded-3xl border border-foreground/10 bg-foreground/[0.02] text-sm text-foreground/50">
          {status === "offline"
            ? "Stream offline — start the server or check NEXT_PUBLIC_WS_URL."
            : "Waiting for the first snapshot..."}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {series.map((item) => (
              <StatCard key={item.id} series={item} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6 lg:col-span-2">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {selected ? selected.label : "Metric"} over time
                </h3>
                <FilterBar
                  series={series}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
              <div className="h-56">
                <AreaChart
                  data={selected ? selected.history : []}
                  color={selectedColor}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6">
              <h3 className="mb-5 font-display text-lg font-semibold text-foreground">
                Traffic by region
              </h3>
              <BarPanel categories={categories} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
