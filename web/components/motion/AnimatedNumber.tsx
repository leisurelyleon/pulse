"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  className?: string;
}

/**
 * Tweens from the previous value to the next whenever `value` changes, so live
 * metric updates count smoothly rather than snapping. Jumps instantly under
 * reduced motion.
 */
export function AnimatedNumber({ value, decimals = 0, className }: AnimatedNumberProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(display, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
    // Intentionally animate from the current display to the new value; adding
    // `display` to deps would restart the tween on every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reducedMotion]);

  return <span className={className}>{format(display, decimals)}</span>;
}

function format(value: number, decimals: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
