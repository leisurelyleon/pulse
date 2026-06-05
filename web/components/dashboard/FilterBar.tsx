"use client";

import type { Series } from "@/lib/ws/types";

interface FilterBarProps {
  series: Series[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/** Pick which metric the large area chart plots. */
export function FilterBar({ series, selectedId, onSelect }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {series.map((item) => {
        const selected = item.id === selectedId;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(item.id)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              selected
                ? "border-accent bg-accent/15 text-accent"
                : "border-foreground/15 text-foreground/60 hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
