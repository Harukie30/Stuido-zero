"use client";

import { HudFrame } from "@/components/landing/hud-frame";
import { ProtectedImage } from "@/components/landing/protected-image";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CLOSE_LINES = [
  { code: "TX-01", label: "Cutting personal channel" },
  { code: "TX-02", label: "Archiving diary packet" },
  { code: "TX-03", label: "Sealing operator frequency" },
  { code: "TX-04", label: "Handing signal to Studio Zero" },
] as const;

const BOOT_MS = 2400;
/** Keep LINK RESTORED fully visible this long, then hand off to Studio. */
const HOLD_MS = 3000;

type GamesExitLoadingScreenProps = {
  onComplete?: () => void;
};

/**
 * Epic End Transmission — cinematic exit from Games Diary → Studio.
 */
export function GamesExitLoadingScreen({
  onComplete,
}: GamesExitLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const didComplete = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    let holdTimer = 0;

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
          CLOSE_LINES.length - 1,
          Math.floor((next / 100) * CLOSE_LINES.length)
        )
      );

      if (next < 100) {
        frame = requestAnimationFrame(tick);
        return;
      }

      setFinished(true);
      // Stay on LINK RESTORED for the full hold — no early fade-out.
      holdTimer = window.setTimeout(complete, HOLD_MS);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(holdTimer);
    };
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const activeLine = CLOSE_LINES[lineIndex] ?? CLOSE_LINES[0];
  const signalBars = 8;
  const liveBars = Math.max(
    0,
    signalBars - Math.floor((progress / 100) * (signalBars + 1))
  );
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Ending games diary transmission"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[oklch(0.12_0.03_350)] px-4 sm:px-6"
      initial={false}
      animate={{ opacity: 1 }}
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.12_15/0.2),transparent_58%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(oklch(0.95_0.02_350/0.05)_1px,transparent_1px),linear-gradient(90deg,oklch(0.95_0.02_350/0.05)_1px,transparent_1px)] [background-size:56px_56px]"
      />
      <div
        aria-hidden
        className="exit-tx-scan pointer-events-none absolute inset-x-0 z-[1] h-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.1_0.03_350/0.55),transparent_22%,transparent_78%,oklch(0.1_0.03_350/0.65))]"
      />

      {/* Corner HUD rails */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 z-[2] sm:inset-6"
      >
        <span className="absolute top-0 left-0 h-7 w-7 border-t border-l border-primary/50 sm:h-10 sm:w-10" />
        <span className="absolute top-0 right-0 h-7 w-7 border-t border-r border-primary/50 sm:h-10 sm:w-10" />
        <span className="absolute bottom-0 left-0 h-7 w-7 border-b border-l border-primary/50 sm:h-10 sm:w-10" />
        <span className="absolute right-0 bottom-0 h-7 w-7 border-r border-b border-primary/50 sm:h-10 sm:w-10" />
        <p className="absolute top-2 left-10 hud-label text-primary/60 sm:top-3 sm:left-14">
          CH-01 // GAMES
        </p>
        <p className="absolute top-2 right-10 hud-label text-primary/60 sm:top-3 sm:right-14">
          {finished ? "RETURN" : "CLOSING"}
        </p>
      </div>

      {/* Expanding ring pulse on seal */}
      <AnimatePresence>
        {finished ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-[3] size-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/35"
            initial={{ scale: 0.55, opacity: 0.7 }}
            animate={{ scale: 1.35, opacity: 0 }}
            transition={{ duration: 1.1, ease }}
          />
        ) : null}
      </AnimatePresence>

      <HudFrame className="relative z-10 w-full max-w-md bg-[oklch(0.17_0.04_350/0.94)] px-4 py-6 backdrop-blur-md sm:px-8 sm:py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full",
                finished ? "bg-primary" : "bg-primary/80 exit-tx-pulse"
              )}
            />
            <p className="hud-label text-primary">
              {finished ? "SZ-LINK" : "SZ-CLOSE"}
            </p>
          </div>
          <p className="hud-label tabular-nums">{Math.round(progress)}%</p>
        </div>

        <motion.p
          className="font-display text-center text-xl font-semibold tracking-[0.12em] text-foreground sm:text-3xl sm:tracking-[0.16em]"
          initial={false}
          animate={
            finished
              ? { opacity: 0.35, letterSpacing: "0.28em" }
              : { opacity: 1, letterSpacing: "0.16em" }
          }
          transition={{ duration: 0.45, ease }}
        >
          END TRANSMISSION
        </motion.p>
        <p className="mt-2 text-center font-mono-hud text-[10px] tracking-[0.28em] text-muted-foreground">
          STUDIO ZERO // SIGNAL HANDOFF
        </p>

        {/* Signal collapse meters */}
        <div className="mx-auto mt-7 flex h-10 max-w-xs items-end justify-center gap-1.5">
          {Array.from({ length: signalBars }).map((_, i) => {
            const alive = i < liveBars && !finished;
            const height = 28 + ((i * 17) % 36);
            return (
              <motion.span
                key={i}
                aria-hidden
                className={cn(
                  "w-2 rounded-sm origin-bottom",
                  alive ? "bg-primary/75" : "bg-primary/15"
                )}
                initial={false}
                animate={{
                  height: alive ? height : 8,
                  opacity: alive ? 1 : 0.35,
                }}
                transition={{ duration: 0.25, ease }}
              />
            );
          })}
        </div>
        <p className="mt-2 text-center font-mono-hud text-[9px] tracking-[0.22em] text-muted-foreground/70">
          SIGNAL STRENGTH // {finished ? "00" : String(liveBars).padStart(2, "0")}
        </p>

        <div className="mt-7 space-y-2.5">
          {CLOSE_LINES.map((line, index) => {
            const active = index === lineIndex && !finished;
            const done = index < lineIndex || finished;
            return (
              <motion.div
                key={line.code}
                className={cn(
                  "flex items-center justify-between gap-3 border-b border-primary/10 pb-2.5 font-mono-hud text-[10px] tracking-[0.16em]",
                  done
                    ? "text-foreground/80"
                    : active
                      ? "text-foreground"
                      : "text-muted-foreground/40"
                )}
                initial={false}
                animate={{
                  x: active ? 2 : 0,
                  opacity: done || active ? 1 : 0.45,
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-primary/75">{line.code}</span>
                <span className="truncate text-right">{line.label}</span>
                <span
                  className={cn(
                    "ml-1 shrink-0",
                    done ? "text-primary" : "text-muted-foreground/30"
                  )}
                >
                  {done ? "OK" : active ? "···" : "--"}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 h-[2px] overflow-hidden rounded-full bg-primary/15">
          <motion.div
            className="h-full origin-left rounded-full bg-gradient-to-r from-primary/60 via-primary to-accent"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>

        <p className="mt-3 font-mono-hud text-[10px] tracking-[0.22em] text-muted-foreground">
          {finished ? "Archive sealed · studio feed online" : activeLine.label}
        </p>
      </HudFrame>

      {/* Final stamp */}
      <AnimatePresence>
        {finished ? (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="absolute inset-0 bg-[oklch(0.11_0.03_350/0.82)]" />
            <div
              aria-hidden
              className="exit-tx-flash pointer-events-none absolute inset-0"
            />

            <motion.div
              className="relative mb-8 h-14 w-[min(100%,14rem)] sm:h-16 sm:w-64"
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease, delay: 0.08 }}
            >
              <ProtectedImage
                src="/games-img/studio-full.png"
                alt=""
                fill
                sizes="256px"
                priority
                className="object-contain object-center"
              />
            </motion.div>

            <motion.p
              className="relative hud-label mb-4 text-primary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease, delay: 0.12 }}
            >
              SZ-RETURN
            </motion.p>
            <p
              data-glitch="LINK RESTORED"
              className="connected-glitch relative font-display text-2xl font-semibold tracking-[0.14em] text-foreground sm:text-5xl sm:tracking-[0.2em]"
            >
              LINK RESTORED
            </p>
            <motion.div
              aria-hidden
              className="relative mx-auto mt-5 h-px w-36 bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease, delay: 0.2 }}
            />
            <motion.p
              className="relative mt-4 font-mono-hud text-[10px] tracking-[0.28em] text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.28 }}
            >
              WELCOME BACK TO STUDIO ZERO
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
