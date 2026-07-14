"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

type SakuraPetalsProps = {
  active?: boolean;
  count?: number;
};

/**
 * Spread across the upper-right / right edge so the wind fills the screen,
 * each with its own diagonal path toward the lower-left.
 */
const PETAL_SEED = [
  { x: 4, y: -8, delay: 0, duration: 3.5, size: 12, opacity: 0.7, rotate: 20, drift: 0 },
  { x: 12, y: -2, delay: 0.15, duration: 3.1, size: 9, opacity: 0.5, rotate: -25, drift: 12 },
  { x: 22, y: 6, delay: 0.32, duration: 3.9, size: 14, opacity: 0.65, rotate: 40, drift: -8 },
  { x: 8, y: 14, delay: 0.08, duration: 3.3, size: 8, opacity: 0.45, rotate: -15, drift: 20 },
  { x: 28, y: -10, delay: 0.42, duration: 3.7, size: 11, opacity: 0.6, rotate: 10, drift: -14 },
  { x: 18, y: 22, delay: 0.2, duration: 2.9, size: 10, opacity: 0.55, rotate: -35, drift: 6 },
  { x: 2, y: 30, delay: 0.55, duration: 4.1, size: 13, opacity: 0.68, rotate: 28, drift: -18 },
  { x: 35, y: 4, delay: 0.12, duration: 3.4, size: 8, opacity: 0.42, rotate: -8, drift: 16 },
  { x: 15, y: -14, delay: 0.48, duration: 3.2, size: 12, opacity: 0.58, rotate: 55, drift: -4 },
  { x: 40, y: 18, delay: 0.28, duration: 3.8, size: 9, opacity: 0.48, rotate: -42, drift: 22 },
  { x: 6, y: 40, delay: 0.65, duration: 3.0, size: 15, opacity: 0.62, rotate: 12, drift: -10 },
  { x: 25, y: 34, delay: 0.18, duration: 3.6, size: 10, opacity: 0.5, rotate: -20, drift: 8 },
  { x: 32, y: -6, delay: 0.72, duration: 4.0, size: 11, opacity: 0.55, rotate: 33, drift: -22 },
  { x: 10, y: 48, delay: 0.38, duration: 2.8, size: 8, opacity: 0.4, rotate: -50, drift: 14 },
  { x: 45, y: 10, delay: 0.05, duration: 3.5, size: 13, opacity: 0.6, rotate: 18, drift: -6 },
  { x: 20, y: 56, delay: 0.58, duration: 3.3, size: 7, opacity: 0.38, rotate: -12, drift: 18 },
  { x: 38, y: 42, delay: 0.25, duration: 3.9, size: 12, opacity: 0.58, rotate: 45, drift: -16 },
  { x: 0, y: 18, delay: 0.8, duration: 3.1, size: 9, opacity: 0.48, rotate: -30, drift: 4 },
  { x: 30, y: 52, delay: 0.45, duration: 3.7, size: 10, opacity: 0.52, rotate: 22, drift: -12 },
  { x: 14, y: 64, delay: 0.22, duration: 3.0, size: 11, opacity: 0.45, rotate: -18, drift: 10 },
  { x: 42, y: 28, delay: 0.68, duration: 3.4, size: 8, opacity: 0.42, rotate: 36, drift: -20 },
  { x: 5, y: 72, delay: 0.35, duration: 3.8, size: 12, opacity: 0.55, rotate: -40, drift: 7 },
  { x: 24, y: -16, delay: 0.9, duration: 3.2, size: 10, opacity: 0.5, rotate: 15, drift: -9 },
  { x: 48, y: 0, delay: 0.52, duration: 4.2, size: 14, opacity: 0.65, rotate: -28, drift: 15 },
  { x: 16, y: 78, delay: 0.1, duration: 2.7, size: 9, opacity: 0.4, rotate: 48, drift: -5 },
  { x: 36, y: 60, delay: 0.75, duration: 3.5, size: 11, opacity: 0.58, rotate: -22, drift: 11 },
  { x: 9, y: -4, delay: 0.4, duration: 3.6, size: 8, opacity: 0.46, rotate: 8, drift: -15 },
  { x: 44, y: 48, delay: 0.6, duration: 3.3, size: 13, opacity: 0.62, rotate: -45, drift: 19 },
] as const;

export function SakuraPetals({
  active = false,
  count = PETAL_SEED.length,
}: SakuraPetalsProps) {
  const petals = PETAL_SEED.slice(0, count);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key="sakura-wind"
          aria-hidden
          className="sakura-field pointer-events-none absolute inset-0 z-[3] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {petals.map((petal, index) => (
            <span
              key={index}
              className={cn("sakura-petal")}
              style={{
                right: `${petal.x}%`,
                top: `${petal.y}%`,
                width: petal.size,
                height: petal.size * 0.85,
                animationDelay: `${petal.delay}s`,
                animationDuration: `${petal.duration}s`,
                ["--sakura-opacity" as string]: String(petal.opacity),
                ["--sakura-rotate" as string]: `${petal.rotate}deg`,
                ["--sakura-drift" as string]: `${petal.drift}px`,
              }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
