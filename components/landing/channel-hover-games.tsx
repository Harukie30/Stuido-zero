"use client";

import { ProtectedImage } from "@/components/landing/protected-image";
import { cn } from "@/lib/utils";

export type ChannelHoverMode = "games" | "anime" | "solo";

type SideTile = {
  src: string;
  className: string;
  objectClassName?: string;
  delay: string;
};

type ChannelArt = {
  left: SideTile[];
  right: SideTile[];
  wash: string;
};

/**
 * Tile sizes are % of the side column — column width is fluid via CSS clamp,
 * so framing auto-adjusts from phone → desktop.
 */
const CHANNEL_ART: Record<ChannelHoverMode, ChannelArt> = {
  games: {
    left: [
      {
        src: "/games-img/genshin1.png",
        className:
          "left-[2%] top-[8%] h-[52%] w-[78%] -rotate-[3deg] sm:left-[4%] sm:top-[6%] sm:h-[58%] sm:w-[72%] sm:-rotate-[4deg]",
        objectClassName: "object-contain",
        delay: "0ms",
      },
      {
        src: "/games-img/lol logo.png",
        className:
          "left-[12%] bottom-[4%] h-[42%] w-[76%] rotate-[4deg] sm:left-[18%] sm:bottom-[2%] sm:h-[48%] sm:w-[70%] sm:rotate-[5deg]",
        objectClassName: "object-contain",
        delay: "70ms",
      },
    ],
    right: [
      {
        src: "/games-img/endfild1.png",
        className:
          "right-[2%] top-[6%] h-[50%] w-[80%] rotate-[3deg] sm:right-[2%] sm:top-[4%] sm:h-[56%] sm:w-[74%] sm:rotate-[4deg]",
        objectClassName: "object-contain",
        delay: "40ms",
      },
      {
        src: "/games-img/overw logo.png",
        className:
          "right-[10%] bottom-[2%] h-[44%] w-[74%] -rotate-[4deg] sm:right-[14%] sm:bottom-[0%] sm:h-[50%] sm:w-[68%] sm:-rotate-[5deg]",
        objectClassName: "object-contain",
        delay: "110ms",
      },
    ],
    wash: "channel-wash--games",
  },
  anime: {
    left: [
      {
        src: "/footer-anime/anime-3.png",
        className:
          "left-[-8%] top-[0%] h-[70%] w-[96%] -rotate-[2deg] sm:left-[-6%] sm:h-[78%] sm:w-[88%] sm:-rotate-[3deg]",
        objectClassName:
          "object-cover object-[62%_6%] scale-105 sm:object-[70%_8%] sm:scale-110 md:object-[72%_10%]",
        delay: "0ms",
      },
      {
        src: "/footer-anime/endmin-nw.png",
        className:
          "left-[16%] bottom-[-2%] h-[56%] w-[78%] rotate-[3deg] sm:left-[22%] sm:bottom-[-4%] sm:h-[62%] sm:w-[70%] sm:rotate-[4deg]",
        objectClassName:
          "object-cover object-[50%_6%] scale-100 sm:object-[50%_8%] sm:scale-105 md:object-[52%_10%]",
        delay: "70ms",
      },
    ],
    right: [
      {
        src: "/footer-anime/anime-4.png",
        className:
          "right-[-6%] top-[-2%] h-[68%] w-[94%] rotate-[2deg] sm:right-[-4%] sm:h-[76%] sm:w-[86%] sm:rotate-[3deg]",
        objectClassName:
          "object-cover object-[48%_8%] scale-105 sm:object-[45%_10%] sm:scale-110 md:object-[42%_12%]",
        delay: "40ms",
      },
      {
        src: "/footer-anime/anime-6.png",
        className:
          "right-[12%] bottom-[-4%] h-[58%] w-[80%] -rotate-[3deg] sm:right-[18%] sm:bottom-[-6%] sm:h-[64%] sm:w-[72%] sm:-rotate-[4deg]",
        objectClassName:
          "object-cover object-[55%_10%] scale-100 sm:object-[55%_12%] sm:scale-105 md:object-[58%_14%]",
        delay: "110ms",
      },
    ],
    wash: "channel-wash--anime",
  },
  solo: {
    left: [
      {
        src: "/games-img/studio-full.png",
        className:
          "left-[4%] top-[16%] h-[38%] w-[84%] -rotate-[2deg] sm:left-[6%] sm:top-[18%] sm:h-[42%] sm:w-[78%] sm:-rotate-[3deg]",
        objectClassName: "object-contain",
        delay: "0ms",
      },
      {
        src: "/games-img/studio-logo.png",
        className:
          "left-[16%] bottom-[10%] h-[32%] w-[58%] rotate-[5deg] sm:left-[20%] sm:bottom-[8%] sm:h-[36%] sm:w-[54%] sm:rotate-[6deg]",
        objectClassName: "object-contain opacity-80",
        delay: "70ms",
      },
    ],
    right: [
      {
        src: "/games-img/studio-logo.png",
        className:
          "right-[6%] top-[14%] h-[36%] w-[62%] rotate-[3deg] sm:right-[8%] sm:top-[12%] sm:h-[40%] sm:w-[58%] sm:rotate-[4deg]",
        objectClassName: "object-contain",
        delay: "40ms",
      },
      {
        src: "/games-img/studio-full.png",
        className:
          "right-[2%] bottom-[8%] h-[40%] w-[82%] -rotate-[4deg] sm:right-[4%] sm:bottom-[6%] sm:h-[44%] sm:w-[76%] sm:-rotate-[5deg]",
        objectClassName: "object-contain opacity-85",
        delay: "110ms",
      },
    ],
    wash: "channel-wash--solo",
  },
};

/** Compact collage sources for mobile channel-chip backgrounds. */
export const CHANNEL_CARD_BG: Record<
  ChannelHoverMode,
  { src: string; className: string; objectClassName: string }[]
> = {
  games: [
    {
      src: "/games-img/genshin1.png",
      className: "left-[-6%] top-[-18%] h-[110%] w-[58%] -rotate-[3deg]",
      objectClassName: "object-contain opacity-90",
    },
    {
      src: "/games-img/endfild1.png",
      className: "right-[-8%] bottom-[-22%] h-[105%] w-[55%] rotate-[4deg]",
      objectClassName: "object-contain opacity-85",
    },
  ],
  anime: [
    {
      src: "/footer-anime/anime-3.png",
      className: "left-[-10%] top-[-28%] h-[130%] w-[62%]",
      objectClassName: "object-cover object-[62%_10%] opacity-90",
    },
    {
      src: "/footer-anime/anime-4.png",
      className: "right-[-12%] bottom-[-30%] h-[125%] w-[58%]",
      objectClassName: "object-cover object-[42%_12%] opacity-85",
    },
  ],
  solo: [
    {
      src: "/games-img/studio-full.png",
      className: "left-[0%] top-[-12%] h-[90%] w-[68%] -rotate-[2deg]",
      objectClassName: "object-contain opacity-85",
    },
    {
      src: "/games-img/studio-logo.png",
      className: "right-[2%] bottom-[-8%] h-[62%] w-[46%] rotate-[6deg]",
      objectClassName: "object-contain opacity-70",
    },
  ],
};

type ChannelHoverArtProps = {
  mode?: ChannelHoverMode | null;
  className?: string;
};

function SideCollage({
  tiles,
  side,
  active,
}: {
  tiles: SideTile[];
  side: "left" | "right";
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "channel-side-collage pointer-events-none absolute inset-y-0 z-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        side === "left"
          ? cn(
              "left-0 hover-art-fade-left",
              active ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0 sm:-translate-x-10"
            )
          : cn(
              "right-0 hover-art-fade-right",
              active ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0 sm:translate-x-10"
            )
      )}
    >
      {tiles.map((tile) => (
        <div
          key={tile.src + tile.className}
          className={cn(
            "absolute transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            tile.className,
            active ? "scale-100 opacity-80" : "scale-90 opacity-0"
          )}
          style={{ transitionDelay: active ? tile.delay : "0ms" }}
        >
          <div className="relative size-full">
            <ProtectedImage
              src={tile.src}
              alt=""
              fill
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 32vw, 440px"
              className={cn(
                "drop-shadow-[0_12px_28px_oklch(0.1_0.03_350/0.45)] sm:drop-shadow-[0_16px_40px_oklch(0.1_0.03_350/0.5)]",
                tile.objectClassName
              )}
            />
          </div>
        </div>
      ))}

      <div
        className={cn(
          "absolute inset-0",
          side === "left"
            ? "bg-gradient-to-r from-transparent via-transparent to-background/80"
            : "bg-gradient-to-l from-transparent via-transparent to-background/80"
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/50" />
    </div>
  );
}

export function ChannelHoverArt({
  mode = null,
  className,
}: ChannelHoverArtProps) {
  const active = mode != null;
  const art = mode ? CHANNEL_ART[mode] : CHANNEL_ART.games;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] max-md:hidden",
          art.wash,
          active ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="channel-wash__base absolute inset-0" />
        <div className="channel-wash__blob-l absolute -left-10 top-1/4 h-[60%] w-[50%] rounded-full blur-3xl sm:-left-16 sm:h-[70%] sm:w-[46%]" />
        <div className="channel-wash__blob-r absolute -right-12 top-[18%] h-[55%] w-[52%] rounded-full blur-3xl sm:-right-20 sm:h-[64%] sm:w-[48%]" />
        <div className="channel-wash__blob-b absolute bottom-0 left-1/2 h-[36%] w-[80%] -translate-x-1/2 rounded-full blur-3xl sm:h-[42%] sm:w-[70%]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,oklch(0.18_0.04_350/0.35)_100%)]" />
      </div>

      {/* Side collage is desktop+; mobile uses chip card backgrounds instead */}
      <div className="hidden md:contents">
        <SideCollage tiles={art.left} side="left" active={active} />
        <SideCollage tiles={art.right} side="right" active={active} />
      </div>
    </div>
  );
}

/** @deprecated use ChannelHoverArt */
export const ChannelHoverGames = ChannelHoverArt;
