"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

type SakuraPetalsProps = {
  active?: boolean;
  count?: number;
};

/**
 * Full-viewport wind — petals spawn across the top + right edge,
 * then blow diagonally toward the lower-left so the whole screen fills.
 */
const PETAL_SEED = [
  // Top edge — across full width (right % from near-left to off-screen right)
  { x: -6, y: -10, delay: 0, duration: 3.8, size: 12, opacity: 0.65, rotate: 20, drift: 8 },
  { x: 8, y: -8, delay: 0.2, duration: 3.4, size: 9, opacity: 0.5, rotate: -25, drift: -12 },
  { x: 18, y: -12, delay: 0.45, duration: 4.0, size: 14, opacity: 0.7, rotate: 40, drift: 16 },
  { x: 28, y: -6, delay: 0.1, duration: 3.6, size: 8, opacity: 0.45, rotate: -15, drift: -6 },
  { x: 38, y: -14, delay: 0.55, duration: 3.9, size: 11, opacity: 0.6, rotate: 10, drift: 20 },
  { x: 48, y: -8, delay: 0.3, duration: 3.2, size: 10, opacity: 0.55, rotate: -35, drift: -18 },
  { x: 58, y: -11, delay: 0.7, duration: 4.2, size: 13, opacity: 0.68, rotate: 28, drift: 10 },
  { x: 68, y: -5, delay: 0.15, duration: 3.5, size: 8, opacity: 0.42, rotate: -8, drift: -14 },
  { x: 78, y: -13, delay: 0.5, duration: 3.7, size: 12, opacity: 0.58, rotate: 55, drift: 4 },
  { x: 88, y: -7, delay: 0.35, duration: 4.1, size: 9, opacity: 0.5, rotate: -42, drift: -22 },
  { x: 96, y: -10, delay: 0.6, duration: 3.3, size: 15, opacity: 0.62, rotate: 12, drift: 14 },
  { x: 102, y: -4, delay: 0.25, duration: 3.8, size: 10, opacity: 0.48, rotate: -20, drift: -8 },
  // Mid / upper-right band
  { x: -2, y: 8, delay: 0.4, duration: 3.6, size: 11, opacity: 0.55, rotate: 33, drift: 12 },
  { x: 12, y: 14, delay: 0.8, duration: 4.0, size: 8, opacity: 0.4, rotate: -50, drift: -10 },
  { x: 24, y: 6, delay: 0.12, duration: 3.4, size: 13, opacity: 0.65, rotate: 18, drift: 18 },
  { x: 36, y: 18, delay: 0.65, duration: 3.9, size: 7, opacity: 0.38, rotate: -12, drift: -16 },
  { x: 50, y: 10, delay: 0.28, duration: 3.5, size: 12, opacity: 0.58, rotate: 45, drift: 6 },
  { x: 62, y: 20, delay: 0.75, duration: 4.1, size: 9, opacity: 0.48, rotate: -30, drift: -20 },
  { x: 74, y: 12, delay: 0.42, duration: 3.7, size: 10, opacity: 0.52, rotate: 22, drift: 10 },
  { x: 86, y: 22, delay: 0.18, duration: 3.2, size: 11, opacity: 0.45, rotate: -18, drift: -4 },
  // Far right edge — along full height so left half still gets filled as they blow across
  { x: -8, y: 28, delay: 0.52, duration: 3.8, size: 8, opacity: 0.5, rotate: 36, drift: 15 },
  { x: -4, y: 38, delay: 0.22, duration: 4.0, size: 12, opacity: 0.58, rotate: -40, drift: -12 },
  { x: -10, y: 48, delay: 0.85, duration: 3.4, size: 10, opacity: 0.46, rotate: 15, drift: 8 },
  { x: -6, y: 58, delay: 0.38, duration: 3.9, size: 14, opacity: 0.62, rotate: -28, drift: -18 },
  { x: -12, y: 68, delay: 0.68, duration: 3.5, size: 9, opacity: 0.42, rotate: 48, drift: 12 },
  { x: -5, y: 76, delay: 0.48, duration: 4.2, size: 11, opacity: 0.55, rotate: -22, drift: -6 },
  { x: 5, y: 32, delay: 0.9, duration: 3.6, size: 8, opacity: 0.44, rotate: 8, drift: 20 },
  { x: 15, y: 44, delay: 0.32, duration: 3.8, size: 13, opacity: 0.6, rotate: -45, drift: -14 },
  { x: 30, y: 36, delay: 0.58, duration: 3.3, size: 10, opacity: 0.5, rotate: 25, drift: 4 },
  { x: 44, y: 52, delay: 0.14, duration: 4.0, size: 9, opacity: 0.48, rotate: -16, drift: -10 },
  { x: 56, y: 42, delay: 0.72, duration: 3.7, size: 12, opacity: 0.56, rotate: 38, drift: 16 },
  { x: 70, y: 56, delay: 0.26, duration: 3.5, size: 8, opacity: 0.4, rotate: -32, drift: -8 },
  { x: 82, y: 46, delay: 0.62, duration: 3.9, size: 11, opacity: 0.52, rotate: 14, drift: 12 },
  { x: 94, y: 62, delay: 0.4, duration: 3.4, size: 10, opacity: 0.46, rotate: -38, drift: -20 },
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
          className="sakura-field pointer-events-none fixed inset-0 z-[3] overflow-hidden"
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
