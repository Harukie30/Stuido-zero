"use client";

import {
  ChannelHoverArt,
  type ChannelHoverMode,
} from "@/components/landing/channel-hover-games";
import { FadeIn } from "@/components/landing/fade-in";
import { OperatorDossier } from "@/components/landing/operator-dossier";
import { GamesLoadingScreen } from "@/components/games/games-loading-screen";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AboutExperienceProps = {
  onClose: () => void;
};

/**
 * Full-screen About dossier overlay.
 * Games channel / diary CTA runs GamesLoadingScreen, then routes to /games.
 */
export function AboutExperience({ onClose }: AboutExperienceProps) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeChannel, setActiveChannel] = useState<ChannelHoverMode | null>(
    null
  );
  const [showGamesLoading, setShowGamesLoading] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !showGamesLoading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, showGamesLoading]);

  // Lock background scroll without jumping the landing page to the top
  useEffect(() => {
    const scrollY = window.scrollY;
    const { style } = document.body;
    const previous = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      width: style.width,
      paddingRight: style.paddingRight,
    };
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    if (scrollbar > 0) style.paddingRight = `${scrollbar}px`;

    return () => {
      style.overflow = previous.overflow;
      style.position = previous.position;
      style.top = previous.top;
      style.width = previous.width;
      style.paddingRight = previous.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Always start the dossier from the top (no scroll-anchoring jump)
  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = 0;
    const id = window.requestAnimationFrame(() => {
      node.scrollTop = 0;
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-[oklch(0.16_0.035_350)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {showGamesLoading ? (
        <GamesLoadingScreen onComplete={() => router.push("/games")} />
      ) : null}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.95_0.03_350/0.08),transparent_55%)]"
      />

      <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-primary/15 bg-[oklch(0.19_0.042_350/0.85)] px-6 backdrop-blur-md">
        <p className="hud-label text-primary">SZ-DOSSIER // ABOUT</p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-sm border-primary/25 bg-background/30"
            onClick={onClose}
          >
            <ArrowLeft className="size-3.5" />
            Studio
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="rounded-sm"
            onClick={onClose}
            aria-label="Close dossier"
          >
            <X className="size-4" />
          </Button>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className="relative z-10 flex-1 overflow-y-auto overscroll-contain [overflow-anchor:none]"
      >
        <section className="relative overflow-x-hidden px-6 pt-12 pb-24 md:pt-16 md:pb-32">
          <ChannelHoverArt mode={activeChannel} />

          <div className="relative z-10 mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <p className="hud-label text-primary">About Studio Zero</p>
                <span
                  aria-hidden
                  className="h-px w-10 bg-gradient-to-r from-primary/40 to-transparent"
                />
                <p className="font-mono-hud text-[10px] tracking-[0.22em] text-primary/70">
                  FILE // OPEN
                </p>
              </div>

              <h1 className="font-display max-w-3xl text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
                Operator dossier
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Not a company profile a clearance file for the person behind
                the archive. Click Games to unlock the diary with clearance.
              </p>
            </FadeIn>

            <FadeIn delay={0.1} className="mt-12">
              <OperatorDossier
                activeChannel={activeChannel}
                onActiveChannelChange={setActiveChannel}
              />
            </FadeIn>

            <FadeIn delay={0.18} className="mt-10">
              <div className="flex flex-col items-start justify-between gap-4 border-t border-primary/15 pt-8 sm:flex-row sm:items-center">
                <p className="max-w-md text-sm text-muted-foreground">
                  Open Games for the diary. Anime and solo builds stay linked to
                  the studio landing until their own files unlock.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className="rounded-sm"
                    onClick={() => setShowGamesLoading(true)}
                  >
                    Open Games Diary
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-sm border-primary/25"
                    onClick={onClose}
                  >
                    Back to Studio
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
