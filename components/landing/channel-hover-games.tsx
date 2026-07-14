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

const CHANNEL_ART: Record<ChannelHoverMode, ChannelArt> = {
  games: {
    left: [
      {
        src: "/games-img/genshin1.png",
        className: "left-[4%] top-[6%] h-[58%] w-[72%] -rotate-[4deg]",
        objectClassName: "object-contain",
        delay: "0ms",
      },
      {
        src: "/games-img/lol logo.png",
        className: "left-[18%] bottom-[2%] h-[48%] w-[70%] rotate-[5deg]",
        objectClassName: "object-contain",
        delay: "70ms",
      },
    ],
    right: [
      {
        src: "/games-img/endfild1.png",
        className: "right-[2%] top-[4%] h-[56%] w-[74%] rotate-[4deg]",
        objectClassName: "object-contain",
        delay: "40ms",
      },
      {
        src: "/games-img/overw logo.png",
        className: "right-[14%] bottom-[0%] h-[50%] w-[68%] -rotate-[5deg]",
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
        className: "left-[-6%] top-[0%] h-[78%] w-[88%] -rotate-[3deg]",
        objectClassName: "object-cover object-[70%_8%] scale-110",
        delay: "0ms",
      },
      {
        src: "/footer-anime/endmin-nw.png",
        className: "left-[22%] bottom-[-4%] h-[62%] w-[70%] rotate-[4deg]",
        objectClassName: "object-cover object-[50%_8%] scale-105",
        delay: "70ms",
      },
    ],
    right: [
      {
        src: "/footer-anime/anime-4.png",
        className: "right-[-4%] top-[-2%] h-[76%] w-[86%] rotate-[3deg]",
        objectClassName: "object-cover object-[45%_10%] scale-110",
        delay: "40ms",
      },
      {
        src: "/footer-anime/anime-6.png",
        className: "right-[18%] bottom-[-6%] h-[64%] w-[72%] -rotate-[4deg]",
        objectClassName: "object-cover object-[55%_12%] scale-105",
        delay: "110ms",
      },
    ],
    wash: "channel-wash--anime",
  },
  solo: {
    left: [
      {
        src: "/games-img/studio-full.png",
        className: "left-[6%] top-[18%] h-[42%] w-[78%] -rotate-[3deg]",
        objectClassName: "object-contain",
        delay: "0ms",
      },
      {
        src: "/games-img/studio-logo.png",
        className: "left-[20%] bottom-[8%] h-[36%] w-[54%] rotate-[6deg]",
        objectClassName: "object-contain opacity-80",
        delay: "70ms",
      },
    ],
    right: [
      {
        src: "/games-img/studio-logo.png",
        className: "right-[8%] top-[12%] h-[40%] w-[58%] rotate-[4deg]",
        objectClassName: "object-contain",
        delay: "40ms",
      },
      {
        src: "/games-img/studio-full.png",
        className: "right-[4%] bottom-[6%] h-[44%] w-[76%] -rotate-[5deg]",
        objectClassName: "object-contain opacity-85",
        delay: "110ms",
      },
    ],
    wash: "channel-wash--solo",
  },
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
        "pointer-events-none absolute inset-y-0 z-0 w-[min(42%,380px)] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:w-[min(38%,440px)]",
        side === "left"
          ? cn(
              "left-0 hover-art-fade-left",
              active ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            )
          : cn(
              "right-0 hover-art-fade-right",
              active ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
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
              sizes="440px"
              className={cn(
                "drop-shadow-[0_16px_40px_oklch(0.1_0.03_350/0.5)]",
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
          "absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          art.wash,
          active ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="channel-wash__base absolute inset-0" />
        <div className="channel-wash__blob-l absolute -left-16 top-1/4 h-[70%] w-[46%] rounded-full blur-3xl" />
        <div className="channel-wash__blob-r absolute -right-20 top-[18%] h-[64%] w-[48%] rounded-full blur-3xl" />
        <div className="channel-wash__blob-b absolute bottom-0 left-1/2 h-[42%] w-[70%] -translate-x-1/2 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,oklch(0.18_0.04_350/0.35)_100%)]" />
      </div>

      <SideCollage tiles={art.left} side="left" active={active} />
      <SideCollage tiles={art.right} side="right" active={active} />
    </div>
  );
}

/** @deprecated use ChannelHoverArt */
export const ChannelHoverGames = ChannelHoverArt;
