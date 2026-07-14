"use client";

import { HoverCollage } from "@/components/landing/hover-collage";
import { HudFrame } from "@/components/landing/hud-frame";
import { ProtectedImage } from "@/components/landing/protected-image";
import { SakuraPetals } from "@/components/landing/sakura-petals";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  { code: "SYS-01", label: "Booting Studio Zero" },
  { code: "SYS-02", label: "Syncing game archive" },
  { code: "SYS-03", label: "Linking anime feed" },
  { code: "SYS-04", label: "Connecting worlds" },
] as const;

const MIN_DURATION_MS = 2400;
const CONNECTED_GLITCH_MS = 700;
const CONNECTED_HOLD_MS = 480;
const SYSTEM_ONLINE_MS = 1100;
const ACCESS_GRANTED_MS = 980;
/** Hold after the scan/auth beat before blur exit */
const ACCESS_GRANTED_HOLD_MS = 2000;
const EXPAND_MS = 620;
const BUTTON_DELAY_MS = 280;

type LoadingScreenProps = {
  onComplete?: () => void;
};

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [showConnected, setShowConnected] = useState(false);
  const [showSystemOnline, setShowSystemOnline] = useState(false);
  const [showAccessGranted, setShowAccessGranted] = useState(false);
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
      setShowConnected(true);
      setShowSystemOnline(true);
      const onlineTimer = window.setTimeout(() => {
        setShowSystemOnline(false);
        setExpanded(true);
        setShowEnter(true);
      }, 200);
      return () => window.clearTimeout(onlineTimer);
    }

    const start = performance.now();
    let frame = 0;
    let connectedTimer = 0;
    let systemTimer = 0;
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
        // CONNECTED glitch → SYSTEM ONLINE overlay → expand
        connectedTimer = window.setTimeout(() => {
          setShowConnected(true);
          systemTimer = window.setTimeout(() => {
            setShowSystemOnline(true);
            expandTimer = window.setTimeout(() => {
              setShowSystemOnline(false);
              setExpanded(true);
              buttonTimer = window.setTimeout(() => {
                setShowEnter(true);
              }, EXPAND_MS + BUTTON_DELAY_MS);
            }, SYSTEM_ONLINE_MS);
          }, CONNECTED_GLITCH_MS + CONNECTED_HOLD_MS);
        }, 160);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(connectedTimer);
      window.clearTimeout(systemTimer);
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

  // Idle glitch pulse on Enter Studio every 3s
  useEffect(() => {
    if (!showEnter || reduceMotion) return;

    const pulse = window.setInterval(() => {
      setIsGlitching(false);
      requestAnimationFrame(() => setIsGlitching(true));
    }, 4500);

    return () => window.clearInterval(pulse);
  }, [showEnter, reduceMotion]);

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
    if (showAccessGranted || !visible) return;
    setShowArt(false);
    setIsGlitching(false);
    setShowAccessGranted(true);

    window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(finish, 700);
    }, reduceMotion ? 200 : ACCESS_GRANTED_MS + ACCESS_GRANTED_HOLD_MS);
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

          {/* SYSTEM ONLINE overlay — clean HUD stamp after CONNECTED */}
          <AnimatePresence>
            {showSystemOnline ? (
              <motion.div
                key="system-online"
                className="pointer-events-none absolute inset-0 z-[20] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.35, ease } }}
                transition={{ duration: 0.4, ease }}
              >
                <div className="absolute inset-0 bg-[oklch(0.16_0.04_350/0.72)] backdrop-blur-[2px]" />
                <div className="relative px-6 text-center">
                  <motion.p
                    className="hud-label mb-4 text-primary/80"
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 6 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease, delay: 0.05 }}
                  >
                    SZ-CORE
                  </motion.p>
                  <motion.p
                    className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, letterSpacing: "0.06em" }
                    }
                    animate={{ opacity: 1, letterSpacing: "0.22em" }}
                    transition={{
                      duration: 0.75,
                      ease,
                      delay: 0.12,
                    }}
                  >
                    SYSTEM ONLINE
                  </motion.p>
                  <motion.div
                    className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                    initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.55, ease, delay: 0.35 }}
                  />
                  <motion.p
                    className="mt-4 font-mono-hud text-[11px] tracking-[0.24em] text-primary/85"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease, delay: 0.45 }}
                  >
                    ARCHIVE · LINKED
                  </motion.p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* ACCESS GRANTED — scan authorize after Enter Studio */}
          <AnimatePresence>
            {showAccessGranted ? (
              <motion.div
                key="access-granted"
                className="pointer-events-none absolute inset-0 z-[30] flex items-center justify-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease }}
              >
                <motion.div
                  className="absolute inset-0 bg-[oklch(0.16_0.04_350/0.78)] backdrop-blur-[1px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                />

                {/* Auth scan line — sweeps once top → bottom */}
                {!reduceMotion ? (
                  <motion.div
                    aria-hidden
                    className="absolute inset-x-0 z-[2] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_oklch(0.78_0.11_15/0.65)]"
                    initial={{ top: "-2%", opacity: 0 }}
                    animate={{
                      top: ["0%", "100%"],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 0.85,
                      ease: [0.22, 1, 0.36, 1],
                      times: [0, 0.12, 0.82, 1],
                    }}
                  />
                ) : null}

                {/* Soft trail wash behind the scan */}
                {!reduceMotion ? (
                  <motion.div
                    aria-hidden
                    className="absolute inset-x-0 top-0 z-[1] h-full bg-gradient-to-b from-primary/10 via-transparent to-transparent"
                    initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                    animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : null}

                <div className="relative z-[3] px-6 text-center">
                  <motion.p
                    className="hud-label mb-3 text-primary"
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease, delay: 0.28 }}
                  >
                    SZ-AUTH
                  </motion.p>
                  <motion.p
                    className="font-display text-2xl font-semibold tracking-[0.18em] text-foreground sm:text-4xl"
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 16 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.36 }}
                  >
                    ACCESS GRANTED
                  </motion.p>
                  <motion.div
                    className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-primary/70 to-transparent"
                    initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease, delay: 0.48 }}
                  />
                  <motion.p
                    className="mt-3 font-mono-hud text-[11px] tracking-[0.28em] text-primary"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease, delay: 0.55 }}
                  >
                    WELCOME TO STUDIO ZERO
                  </motion.p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

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
                  {showEnter
                    ? "SZ-READY"
                    : expanded
                      ? "SZ-OPEN"
                      : showConnected
                        ? "SZ-LINK"
                        : "SZ-BOOT"}
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
                  showConnected ? (
                    <motion.div
                      className="flex flex-col items-center justify-center gap-2 py-3 text-center"
                      initial={
                        reduceMotion ? false : { opacity: 0, scale: 0.96 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease }}
                    >
                      <p className="hud-label text-primary/75">LINK STATUS</p>
                      <p
                        data-glitch="CONNECTED"
                        className={cn(
                          "font-display text-base font-semibold tracking-[0.28em] text-foreground sm:text-lg",
                          !reduceMotion && "connected-glitch"
                        )}
                      >
                        CONNECTED
                      </p>
                      <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/55 to-transparent" />
                      <p className="hud-label text-primary">ONLINE</p>
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono-hud truncate text-[11px] text-foreground/80">
                        {activeLine.label}
                      </p>
                      <p className="hud-label shrink-0">LOADING</p>
                    </div>
                  )
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
                        data-glitch="ENTER STUDIO"
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
