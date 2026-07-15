"use client";

import { ProtectedImage } from "@/components/landing/protected-image";
import { cn } from "@/lib/utils";
import { useState, type MouseEvent } from "react";

type BrandMarkProps = {
  href?: string;
  className?: string;
  priority?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Cube mark by default; full wordmark reveals on hover/focus with a glitch.
 */
export function BrandMark({
  href = "#hero",
  className,
  priority,
  onClick,
}: BrandMarkProps) {
  const [expanded, setExpanded] = useState(false);
  const [glitchKey, setGlitchKey] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  const open = () => {
    setExpanded(true);
    setGlitchKey((key) => key + 1);
    setIsGlitching(true);
  };

  const close = () => {
    setExpanded(false);
    setIsGlitching(false);
  };

  return (
    <a
      href={href}
      aria-label="Studio Zero"
      className={cn(
        "inline-flex h-8 items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className
      )}
      onClick={onClick}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
    >
      <span
        className={cn(
          "relative block h-8 overflow-hidden",
          "transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          expanded ? "w-[10.5rem]" : "w-8"
        )}
      >
        <span
          key={glitchKey}
          className={cn(
            "relative block h-full w-max",
            isGlitching && "brand-glitch"
          )}
          onAnimationEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.animationName.includes("brand-glitch")
            ) {
              setIsGlitching(false);
            }
          }}
        >
          <ProtectedImage
            src="/games-img/studio-full.png"
            alt=""
            width={200}
            height={32}
            priority={priority}
            className={cn(
              "h-8 w-auto max-w-none object-contain object-left",
              isGlitching && "brand-glitch-img"
            )}
          />

          {/* In-bounds RGB ghosts — visible even with overflow clip + black logo bg */}
          {isGlitching ? (
            <>
              <span
                className="brand-glitch-ghost brand-glitch-ghost--r"
                aria-hidden
              >
                <ProtectedImage
                  src="/games-img/studio-full.png"
                  alt=""
                  width={200}
                  height={32}
                  protect={false}
                  className="h-8 w-auto max-w-none object-contain object-left"
                />
              </span>
              <span
                className="brand-glitch-ghost brand-glitch-ghost--c"
                aria-hidden
              >
                <ProtectedImage
                  src="/games-img/studio-full.png"
                  alt=""
                  width={200}
                  height={32}
                  protect={false}
                  className="h-8 w-auto max-w-none object-contain object-left"
                />
              </span>
              <span className="brand-glitch-overlay" aria-hidden>
                <span className="brand-glitch-scan" />
              </span>
            </>
          ) : null}
        </span>
      </span>
    </a>
  );
}
