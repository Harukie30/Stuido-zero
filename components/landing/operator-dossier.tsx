"use client";

import { GamesLoadingScreen } from "@/components/games/games-loading-screen";
import {
  CHANNEL_CARD_BG,
  type ChannelHoverMode,
} from "@/components/landing/channel-hover-games";
import { HudFrame } from "@/components/landing/hud-frame";
import { ProtectedImage } from "@/components/landing/protected-image";
import { dossierChannels, dossierFields } from "@/lib/dossier";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type AnimationEvent } from "react";

function ChannelChipArtBg({
  mode,
  active,
}: {
  mode: ChannelHoverMode;
  active: boolean;
}) {
  const tiles = CHANNEL_CARD_BG[mode];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-sm md:hidden",
        "transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        active ? "opacity-100" : "opacity-0"
      )}
    >
      {tiles.map((tile) => (
        <div
          key={tile.src + tile.className}
          className={cn(
            "absolute transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            tile.className,
            active ? "scale-100" : "scale-95"
          )}
        >
          <div className="relative size-full">
            <ProtectedImage
              src={tile.src}
              alt=""
              fill
              sizes="(max-width: 768px) 80vw, 1px"
              className={tile.objectClassName}
            />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/75 to-background/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-background/40" />
    </div>
  );
}

type OperatorDossierProps = {
  className?: string;
  activeChannel?: ChannelHoverMode | null;
  onActiveChannelChange?: (mode: ChannelHoverMode | null) => void;
};

/**
 * Desktop: hover previews channel art on the sides.
 * Mobile: first tap pins art inside the chip background; second tap enters.
 * (Games opens clearance after preview is pinned.)
 */
export function OperatorDossier({
  className,
  activeChannel: controlledActive,
  onActiveChannelChange,
}: OperatorDossierProps) {
  const router = useRouter();
  const [uncontrolledActive, setUncontrolledActive] =
    useState<ChannelHoverMode | null>(null);
  const [glitchingChannel, setGlitchingChannel] =
    useState<ChannelHoverMode | null>(null);
  const [showGamesLoading, setShowGamesLoading] = useState(false);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const activeChannel =
    controlledActive !== undefined ? controlledActive : uncontrolledActive;

  const setActiveChannel = (mode: ChannelHoverMode | null) => {
    onActiveChannelChange?.(mode);
    if (controlledActive === undefined) setUncontrolledActive(mode);
  };

  const pulseGlitch = (id: ChannelHoverMode) => {
    setGlitchingChannel(null);
    requestAnimationFrame(() => setGlitchingChannel(id));
  };

  const pinChannel = (id: ChannelHoverMode) => {
    setActiveChannel(id);
    pulseGlitch(id);
  };

  const clearChannel = () => {
    setActiveChannel(null);
    setGlitchingChannel(null);
  };

  return (
    <>
      {showGamesLoading ? (
        <GamesLoadingScreen onComplete={() => router.push("/games")} />
      ) : null}

      <HudFrame
        className={cn(
          "relative z-10 bg-[oklch(0.2_0.035_350/0.72)] p-4 backdrop-blur-sm sm:p-6 md:p-8",
          className
        )}
      >
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
              <p className="hud-label text-primary">SZ-DOSSIER</p>
              <span
                aria-hidden
                className="h-px min-w-8 flex-1 bg-gradient-to-r from-primary/35 to-transparent"
              />
              <p className="font-mono-hud text-[10px] tracking-[0.22em] text-primary/70">
                FILE // OPEN
              </p>
            </div>

            <p className="font-display text-xl leading-snug font-medium tracking-tight text-foreground sm:text-2xl md:text-3xl">
              Studio Zero started in the gap between the next queue and the next
              episode.
            </p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:mt-4 md:text-base">
              A personal mini studio for the games I play, the anime I love, and
              the ideas that grow when both worlds collide built solo, updated
              as I go.
            </p>
            {!canHover ? (
              <p className="mt-3 font-mono-hud text-[9px] tracking-[0.18em] text-primary/55">
                TAP A CHANNEL TO PREVIEW · TAP AGAIN TO ENTER
              </p>
            ) : null}
          </div>

          <div className="border-t border-primary/15 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <p className="hud-label mb-4 text-accent">Clearance data</p>
            <ul className="space-y-3">
              {dossierFields.map((field) => (
                <li
                  key={field.label}
                  className="flex items-baseline justify-between gap-3 border-b border-primary/10 pb-2.5 last:border-0 last:pb-0 sm:gap-4"
                >
                  <span className="hud-label shrink-0 text-muted-foreground">
                    {field.label}
                  </span>
                  <span className="text-right text-sm text-foreground/90">
                    {field.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-7 border-t border-primary/15 pt-5 sm:mt-8 sm:pt-6">
          <p className="hud-label mb-3 text-primary/80 sm:mb-4">
            Active channels
          </p>
          <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-4">
            {dossierChannels.map((channel) => {
              const isActive = activeChannel === channel.id;
              const isGlitching = glitchingChannel === channel.id;
              const isGames = channel.id === "games";

              const className = cn(
                "channel-glitch-chip group flex min-h-[4.5rem] items-start gap-3 rounded-sm border border-primary/15 bg-background/25 px-3.5 py-3.5 transition-colors hover:border-primary/35 hover:bg-primary/5 active:scale-[0.99] sm:min-h-0 sm:py-3 md:min-h-0",
                isActive && "is-glowing",
                isGlitching && "is-glitching"
              );

              const content = (
                <>
                  <ChannelChipArtBg mode={channel.id} active={isActive} />
                  <div className="channel-glitch-icon relative z-[1] mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-sm border border-primary/25 bg-primary/10 text-primary transition-all sm:size-8">
                    <channel.icon className="size-3.5" />
                  </div>
                  <div className="relative z-[1] min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-sm font-medium text-foreground">
                        {channel.label}
                      </p>
                      <span className="hud-label text-primary/55">
                        {channel.code}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {channel.detail}
                    </p>
                  </div>
                </>
              );

              const onAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
                if (event.animationName.includes("channel-glitch-chip-shake")) {
                  setGlitchingChannel(null);
                }
              };

              if (isGames) {
                return (
                  <button
                    key={channel.code}
                    type="button"
                    data-channel={channel.id}
                    className={cn(className, "w-full text-left")}
                    onMouseEnter={canHover ? () => pinChannel(channel.id) : undefined}
                    onMouseLeave={canHover ? clearChannel : undefined}
                    onFocus={canHover ? () => pinChannel(channel.id) : undefined}
                    onBlur={canHover ? clearChannel : undefined}
                    onAnimationEnd={onAnimationEnd}
                    onClick={() => {
                      if (!canHover && activeChannel !== channel.id) {
                        pinChannel(channel.id);
                        return;
                      }
                      pinChannel(channel.id);
                      setShowGamesLoading(true);
                    }}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={channel.code}
                  href={channel.href}
                  data-channel={channel.id}
                  className={className}
                  onMouseEnter={canHover ? () => pinChannel(channel.id) : undefined}
                  onMouseLeave={canHover ? clearChannel : undefined}
                  onFocus={canHover ? () => pinChannel(channel.id) : undefined}
                  onBlur={canHover ? clearChannel : undefined}
                  onAnimationEnd={onAnimationEnd}
                  onClick={(event) => {
                    if (!canHover && activeChannel !== channel.id) {
                      event.preventDefault();
                      pinChannel(channel.id);
                    }
                  }}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </HudFrame>
    </>
  );
}
