import type { Series } from "@/lib/ws/types";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { Sparkline } from "@/components/dashboard/Sparkline";
import { SERIES_COLORS, DEFAULT_SERIES_COLOR } from "@/lib/constants";

interface StatCardProps {
  series: Series;
}

/** A single metric tile: animated value, delta indicator, and a sparkline. */
export function StatCard({ series }: StatCardProps) {
  const color = SERIES_COLORS[series.id] ?? DEFAULT_SERIES_COLOR;
  const rising = series.delta >= 0;

  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground/60">{series.label}</span>
        <span
          className={`text-xs font-medium tabular-nums ${rising ? "text-emerald" : "text-rose"}`}
        >
          {rising ? "+" : ""}
          {series.delta.toFixed(1)}
        </span>
      </div>

      <div className="mt-2 flex items-end gap-1.5">
        <AnimatedNumber
          value={series.value}
          decimals={series.unit === "%" ? 1 : 0}
          className="font-display text-3xl font-bold tabular-nums text-foreground"
        />
        <span className="pb-1 text-xs text-foreground/50">{series.unit}</span>
      </div>

      <div className="mt-3 h-9">
        <Sparkline data={series.history} color={color} />
      </div>
    </div>
  );
}
