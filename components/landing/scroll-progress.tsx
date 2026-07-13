"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "features", label: "About" },
  { id: "gameplay", label: "Flow" },
  { id: "media", label: "Archive" },
  { id: "newsletter", label: "Connect" },
] as const;

/** How close progress must be to a marker to reveal its tooltip */
const HIT_ZONE = 0.022;
/** Keep end pins inset so labels aren't clipped off-screen */
const EDGE_PAD = 0.02;

type SectionMarker = {
  id: string;
  label: string;
  progress: number;
};

function getHeaderOffset() {
  const header = document.querySelector("header");
  return header?.getBoundingClientRect().height ?? 56;
}

function isHittingMarker(
  progress: number,
  marker: SectionMarker,
  index: number,
  total: number
) {
  // Intro: show while still near the top of the page
  if (index === 0) {
    return progress <= Math.max(HIT_ZONE * 2, marker.progress + HIT_ZONE);
  }
  // Connect: show while near the bottom
  if (index === total - 1) {
    return progress >= Math.min(1 - HIT_ZONE * 2, marker.progress - HIT_ZONE);
  }
  return Math.abs(progress - marker.progress) <= HIT_ZONE;
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [markers, setMarkers] = useState<SectionMarker[]>([]);

  useEffect(() => {
    const measure = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewport = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, scrollHeight - viewport);
      const next = Math.min(1, Math.max(0, scrollTop / maxScroll));
      setProgress(next);

      const headerOffset = getHeaderOffset();

      setMarkers(
        SECTIONS.map((section) => {
          const el = document.getElementById(section.id);
          if (!el) {
            return { id: section.id, label: section.label, progress: 0 };
          }

          const sectionTop = el.getBoundingClientRect().top + scrollTop;
          const triggerY = Math.max(0, sectionTop - headerOffset);

          return {
            id: section.id,
            label: section.label,
            progress: Math.min(1, triggerY / maxScroll),
          };
        })
      );
    };

    measure();

    const raf = requestAnimationFrame(measure);
    const timeouts = [100, 500, 1500].map((ms) => setTimeout(measure, ms));

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.documentElement);
    if (document.body) resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      timeouts.forEach(clearTimeout);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      resizeObserver.disconnect();
    };
  }, []);

  const hitMarker =
    markers.find((marker, index) =>
      isHittingMarker(progress, marker, index, markers.length)
    ) ?? null;

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = getHeaderOffset();
    const top =
      el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[60] hidden h-dvh w-44 overflow-visible md:block"
      aria-hidden
    >
      {/* Track */}
      <div className="absolute inset-y-0 left-0 w-3 bg-white/10" />

      {/* Fill */}
      <div
        className="absolute top-0 left-0 w-3 bg-primary shadow-[0_0_14px_oklch(0.78_0.11_15/0.55)] transition-[height] duration-100 ease-out"
        style={{ height: `${progress * 100}%` }}
      />

      {/* Section checkpoints */}
      {markers.map((marker, index) => {
        const isHit = hitMarker?.id === marker.id;
        const isPassed = progress >= marker.progress;
        // Inset first/last so pin + tooltip stay on screen
        const displayProgress = Math.min(
          1 - EDGE_PAD,
          Math.max(EDGE_PAD, marker.progress)
        );

        return (
          <div
            key={marker.id}
            className="absolute left-0 flex -translate-y-1/2 items-center"
            style={{ top: `${displayProgress * 100}%` }}
          >
            <button
              type="button"
              className="pointer-events-auto relative z-10 flex size-7 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
              onClick={() => jumpTo(marker.id)}
              aria-label={`Jump to ${marker.label}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ease-out ${
                  isHit
                    ? "size-2.5 bg-primary shadow-[0_0_12px_oklch(0.78_0.11_15/0.85)] ring-2 ring-primary/35"
                    : isPassed
                      ? "size-1.5 bg-primary/80"
                      : "size-1.5 bg-white/40"
                }`}
              />
            </button>

            <div
              className={`transition-all duration-300 ease-out ${
                isHit
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none -translate-x-1 opacity-0"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="h-px w-3 bg-primary/60" />
                <span className="whitespace-nowrap rounded-sm border border-primary/45 bg-[oklch(0.2_0.035_350/0.94)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary shadow-[0_4px_20px_oklch(0.1_0.02_350/0.45)]">
                  {marker.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
