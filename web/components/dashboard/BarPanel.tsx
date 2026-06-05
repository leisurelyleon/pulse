"use client";

import { motion } from "framer-motion";
import type { Category } from "@/lib/ws/types";
import { CATEGORY_COLORS } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface BarPanelProps {
  categories: Category[];
}

/** Live category bars whose heights spring smoothly toward each new value. */
export function BarPanel({ categories }: BarPanelProps) {
  const reducedMotion = usePrefersReducedMotion();
  const max = Math.max(...categories.map((category) => category.value), 1);

  return (
    <div className="flex h-full items-end gap-3">
      {categories.map((category, index) => {
        const pct = (category.value / max) * 100;
        const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
        return (
          <div key={category.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-40 w-full items-end overflow-hidden rounded-lg bg-foreground/5">
              <motion.div
                className="w-full rounded-lg"
                style={{ backgroundColor: color }}
                animate={{ height: `${pct}%` }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 120, damping: 20 }
                }
              />
            </div>
            <span className="text-xs text-foreground/60">{category.label}</span>
            <span className="text-xs font-medium tabular-nums text-foreground/80">
              {category.value.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
