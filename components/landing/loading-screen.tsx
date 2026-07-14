"use client";

import { HoverCollage } from "@/components/landing/hover-collage";
import { HudFrame } from "@/components/landing/hud-frame";
import { ProtectedImage } from "@/components/landing/protected-image";
import { SakuraPetals } from "@/components/landing/sakura-petals";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  { code: "SYS-01", label: "Booting Studio Zero" },
  { code: "SYS-02", label: "Syncing game archive" },
  { code: "SYS-03", label: "Linking anime feed" },
  { code: "SYS-04", label: "Connecting worlds" },
] as const;

const MIN_DURATION_MS = 2400;
const EXPAND_MS = 620;
const BUTTON_DELAY_MS = 280;

type LoadingScreenProps = {
  onComplete?: () => void;
};

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showEnter, setShowEnter] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [showArt, setShowArt] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const didComplete = useRef(false);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(100);
      setExpanded(true);
      const t = window.setTimeout(() => setShowEnter(true), 120);
      return () => window.clearTimeout(t);
    }

    const start = performance.now();
    let frame = 0;
    let expandTimer = 0;
    let buttonTimer = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(100, (elapsed / MIN_DURATION_MS) * 100);
      setProgress(next);
      setLineIndex(
        Math.min(
          BOOT_LINES.length - 1,
          Math.floor((next / 100) * BOOT_LINES.length)
        )
      );

      if (next < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        expandTimer = window.setTimeout(() => {
          setExpanded(true);
          buttonTimer = window.setTimeout(() => {
            setShowEnter(true);
          }, EXPAND_MS + BUTTON_DELAY_MS);
        }, 180);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(expandTimer);
      window.clearTimeout(buttonTimer);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const triggerGlitch = () => {
    if (reduceMotion) return;
    setIsGlitching(false);
    requestAnimationFrame(() => setIsGlitching(true));
  };

  const revealArt = () => {
    setShowArt(true);
    triggerGlitch();
  };

  const hideArt = () => {
    setShowArt(false);
    setIsGlitching(false);
  };

  const finish = () => {
    if (didComplete.current) return;
    didComplete.current = true;
    onComplete?.();
  };

  const enterStudio = () => {
    setShowArt(false);
    setIsGlitching(false);
    setVisible(false);
    window.setTimeout(finish, 700);
  };

  const activeLine = BOOT_LINES[lineIndex] ?? BOOT_LINES[0];
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible ? (
        <motion.div
          key="studio-boot"
          role="status"
          aria-live="polite"
          aria-label={
            showEnter
              ? "Studio ready"
              : expanded
                ? "Expanding Studio Zero"
                : "Loading Studio Zero"
          }
          className="bg-tactical fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(6px)",
            transition: { duration: 0.55, ease },
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.96_0.025_350/0.18),transparent_65%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/3 right-0 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-accent/10 blur-3xl"
          />

          {!reduceMotion ? <SakuraPetals active={showArt} /> : null}

          {!reduceMotion && !expanded ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              initial={{ top: "8%", opacity: 0 }}
              animate={{ top: ["8%", "92%"], opacity: [0, 0.7, 0] }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ) : null}

          {/* Left hover art — reserved for a later design pass */}

          {/* Right hover — full-side games + anime collage */}
          <HoverCollage active={showArt} />

          <motion.div
            layout
            className="relative z-10 max-w-[calc(100vw-2rem)]"
            initial={false}
            animate={
              reduceMotion
                ? undefined
                : {
                    width: expanded ? 384 : 196,
                  }
            }
            transition={{
              layout: { duration: EXPAND_MS / 1000, ease },
              width: { duration: EXPAND_MS / 1000, ease },
            }}
          >
            <HudFrame
              className={cn(
                "overflow-hidden transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                expanded ? "px-6 py-8 sm:px-8 sm:py-10" : "px-5 py-6"
              )}
            >
              {/* Compact header — always present, denser while loading */}
              <div
                className={cn(
                  "flex items-center justify-between gap-3",
                  expanded ? "mb-6" : "mb-4"
                )}
              >
                <p className="hud-label text-primary">
                  {showEnter ? "SZ-READY" : expanded ? "SZ-OPEN" : "SZ-BOOT"}
                </p>
                <p className="hud-label">{Math.round(progress)}%</p>
              </div>

              <motion.div
                layout
                className={cn(
                  "relative mx-auto",
                  expanded
                    ? "mb-6 h-14 w-[min(100%,16rem)]"
                    : "mb-4 h-10 w-[8.5rem]"
                )}
                transition={{ layout: { duration: EXPAND_MS / 1000, ease } }}
              >
                <ProtectedImage
                  src="/games-img/studio-full.png"
                  alt="Studio Zero"
                  fill
                  sizes="256px"
                  priority
                  className="object-contain object-center"
                />
              </motion.div>

              {/* Progress — compact core */}
              <div className="space-y-2">
                <div className="h-[2px] overflow-hidden rounded-full bg-primary/15">
                  <motion.div
                    className="h-full origin-left bg-gradient-to-r from-primary/70 via-primary to-accent"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {!expanded ? (
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono-hud truncate text-[11px] text-foreground/80">
                      {activeLine.label}
                    </p>
                    <p className="hud-label shrink-0">LOADING</p>
                  </div>
                ) : null}
              </div>

              {/* Expanded body */}
              <AnimatePresence>
                {expanded ? (
                  <motion.div
                    key="expanded-body"
                    initial={
                      reduceMotion ? false : { opacity: 0, height: 0 }
                    }
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{
                      duration: EXPAND_MS / 1000,
                      ease,
                      opacity: { duration: 0.4, delay: 0.12 },
                    }}
                    className="overflow-hidden"
                  >
                    <p className="font-display mt-6 text-center text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                      Where{" "}
                      <span className="text-gradient-tactical">
                        Anime and Games
                      </span>{" "}
                      Connect
                    </p>

                    <div className="mt-6 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="hud-label text-primary/80">SYS-OK</p>
                        <p className="mt-1 font-mono-hud truncate text-sm text-foreground/90">
                          Archive online enter when ready
                        </p>
                      </div>
                      <p className="hud-label shrink-0 pt-0.5">READY</p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Enter button — after expand settles */}
              <AnimatePresence>
                {showEnter ? (
                  <motion.div
                    key="enter"
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 14, scale: 0.96 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.4, ease }}
                    className="mt-8"
                  >
                    <div
                      className={cn(
                        "enter-glitch-shell",
                        isGlitching && "is-active"
                      )}
                    >
                      <Button
                        type="button"
                        size="lg"
                        data-glitch="Enter Studio"
                        className={cn(
                          "relative z-10 w-full rounded-sm px-6 cursor-pointer",
                          isGlitching && "enter-glitch"
                        )}
                        onMouseEnter={revealArt}
                        onMouseLeave={hideArt}
                        onFocus={() => setShowArt(true)}
                        onBlur={hideArt}
                        onClick={enterStudio}
                        onAnimationEnd={(event) => {
                          if (
                            event.target === event.currentTarget &&
                            event.animationName.includes("enter-glitch-shake")
                          ) {
                            setIsGlitching(false);
                          }
                        }}
                      >
                        
                        ENTER STUDIO 
                      </Button>
                    </div>
                    <p className="mt-3 text-center hud-label">
                      Click to enter the studio
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </HudFrame>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
