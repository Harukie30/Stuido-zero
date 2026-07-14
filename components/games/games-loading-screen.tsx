"use client";

import { HudFrame } from "@/components/landing/hud-frame";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ARCHIVE_LINES = [
  { code: "GM-01", label: "Opening games archive" },
  { code: "GM-02", label: "Syncing diary eras" },
  { code: "GM-03", label: "Loading personal logs" },
  { code: "GM-04", label: "Preparing transmission" },
] as const;

const BOOT_MS = 2400;
const UNLOCKED_HOLD_MS = 900;

type GamesLoadingScreenProps = {
  onComplete?: () => void;
};

/**
 * Clearance overlay when entering Games Diary from the dossier.
 */
export function GamesLoadingScreen({ onComplete }: GamesLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const didComplete = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    let holdTimer = 0;
    let exitTimer = 0;

    const complete = () => {
      if (didComplete.current) return;
      didComplete.current = true;
      onCompleteRef.current?.();
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(100, (elapsed / BOOT_MS) * 100);
      setProgress(next);
      setLineIndex(
        Math.min(
          ARCHIVE_LINES.length - 1,
          Math.floor((next / 100) * ARCHIVE_LINES.length)
        )
      );

      if (next < 100) {
        frame = requestAnimationFrame(tick);
        return;
      }

      setUnlocked(true);
      holdTimer = window.setTimeout(() => {
        exitTimer = window.setTimeout(complete, 350);
      }, UNLOCKED_HOLD_MS);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
    };
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const activeLine = ARCHIVE_LINES[lineIndex] ?? ARCHIVE_LINES[0];
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Loading games diary"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[oklch(0.14_0.035_350)] px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.11_15/0.16),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(oklch(0.95_0.02_350/0.04)_1px,transparent_1px),linear-gradient(90deg,oklch(0.95_0.02_350/0.04)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <HudFrame className="relative z-10 w-full max-w-sm bg-[oklch(0.18_0.04_350/0.92)] px-6 py-7 backdrop-blur-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="hud-label text-primary">
            {unlocked ? "SZ-OPEN" : "SZ-ARCHIVE"}
          </p>
          <p className="hud-label">{Math.round(progress)}%</p>
        </div>

        <p className="font-display text-center text-xl font-semibold tracking-[0.14em] text-foreground">
          GAMES DIARY
        </p>
        <p className="mt-2 text-center font-mono-hud text-[10px] tracking-[0.24em] text-muted-foreground">
          STUDIO ZERO // CHANNEL CH-01
        </p>

        <div className="mt-6 space-y-2">
          {ARCHIVE_LINES.map((line, index) => (
            <div
              key={line.code}
              className={cn(
                "flex items-center justify-between gap-3 border-b border-primary/10 pb-2 font-mono-hud text-[10px] tracking-[0.16em] transition-colors",
                index <= lineIndex
                  ? "text-foreground/85"
                  : "text-muted-foreground/45"
              )}
            >
              <span className="text-primary/70">{line.code}</span>
              <span className="truncate text-right">{line.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-primary/15">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary/70 via-primary to-accent/80"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.12, ease: "linear" }}
          />
        </div>

        <p className="mt-3 font-mono-hud text-[10px] tracking-[0.2em] text-muted-foreground">
          {unlocked ? "Archive unlocked" : activeLine.label}
        </p>
      </HudFrame>

      {unlocked ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-[oklch(0.14_0.035_350/0.78)]" />
          <div className="relative px-6 text-center">
            <p className="hud-label mb-3 text-primary">SZ-AUTH</p>
            <p
              data-glitch="ACCESS GRANTED"
              className="connected-glitch font-display text-2xl font-semibold tracking-[0.18em] text-foreground sm:text-4xl"
            >
              ACCESS GRANTED
            </p>
            <div className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p
              data-glitch="ENTERING GAMES DIARY"
              className="connected-glitch mt-3 font-mono-hud text-[10px] tracking-[0.24em] text-primary"
            >
              ENTERING GAMES DIARY
            </p>
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
