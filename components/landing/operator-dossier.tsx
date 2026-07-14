"use client";

import { GamesLoadingScreen } from "@/components/games/games-loading-screen";
import type { ChannelHoverMode } from "@/components/landing/channel-hover-games";
import { HudFrame } from "@/components/landing/hud-frame";
import { dossierChannels, dossierFields } from "@/lib/dossier";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type OperatorDossierProps = {
  className?: string;
  activeChannel?: ChannelHoverMode | null;
  onActiveChannelChange?: (mode: ChannelHoverMode | null) => void;
};

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

  const activeChannel =
    controlledActive !== undefined ? controlledActive : uncontrolledActive;

  const setActiveChannel = (mode: ChannelHoverMode | null) => {
    onActiveChannelChange?.(mode);
    if (controlledActive === undefined) setUncontrolledActive(mode);
  };

  return (
    <>
      {showGamesLoading ? (
        <GamesLoadingScreen onComplete={() => router.push("/games")} />
      ) : null}

      <HudFrame
        className={cn(
          "relative z-10 bg-[oklch(0.2_0.035_350/0.72)] p-6 backdrop-blur-sm md:p-8",
          className
        )}
      >
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <p className="hud-label text-primary">SZ-DOSSIER</p>
              <span
                aria-hidden
                className="h-px min-w-8 flex-1 bg-gradient-to-r from-primary/35 to-transparent"
              />
              <p className="font-mono-hud text-[10px] tracking-[0.22em] text-primary/70">
                FILE // OPEN
              </p>
            </div>

            <p className="font-display text-2xl leading-snug font-medium tracking-tight text-foreground md:text-3xl">
              Studio Zero started in the gap between the next queue and the next
              episode.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              A personal mini studio for the games I play, the anime I love, and
              the ideas that grow when both worlds collide built solo, updated
              as I go.
            </p>
          </div>

          <div className="border-t border-primary/15 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <p className="hud-label mb-4 text-accent">Clearance data</p>
            <ul className="space-y-3">
              {dossierFields.map((field) => (
                <li
                  key={field.label}
                  className="flex items-baseline justify-between gap-4 border-b border-primary/10 pb-2.5 last:border-0 last:pb-0"
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

        <div className="mt-8 border-t border-primary/15 pt-6">
          <p className="hud-label mb-4 text-primary/80">Active channels</p>
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {dossierChannels.map((channel) => {
              const isActive = activeChannel === channel.id;
              const isGlitching = glitchingChannel === channel.id;
              const isGames = channel.id === "games";

              const triggerChannel = () => {
                setActiveChannel(channel.id);
                setGlitchingChannel(null);
                requestAnimationFrame(() => {
                  setGlitchingChannel(channel.id);
                });
              };

              const clearChannel = () => {
                setActiveChannel(null);
                setGlitchingChannel(null);
              };

              const className = cn(
                "channel-glitch-chip group flex items-start gap-3 rounded-sm border border-primary/15 bg-background/25 px-3.5 py-3 transition-colors hover:border-primary/35 hover:bg-primary/5",
                isActive && "is-glowing",
                isGlitching && "is-glitching"
              );

              const content = (
                <>
                  <div className="channel-glitch-icon relative z-[1] mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm border border-primary/25 bg-primary/10 text-primary transition-all">
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

              const sharedHandlers = {
                onMouseEnter: triggerChannel,
                onMouseLeave: clearChannel,
                onFocus: triggerChannel,
                onBlur: clearChannel,
                onAnimationEnd: (
                  event: React.AnimationEvent<HTMLElement>
                ) => {
                  if (
                    event.animationName.includes("channel-glitch-chip-shake")
                  ) {
                    setGlitchingChannel(null);
                  }
                },
              };

              // Games — run clearance loader, then enter diary
              if (isGames) {
                return (
                  <button
                    key={channel.code}
                    type="button"
                    data-channel={channel.id}
                    className={cn(className, "w-full text-left")}
                    {...sharedHandlers}
                    onClick={() => setShowGamesLoading(true)}
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
                  {...sharedHandlers}
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
