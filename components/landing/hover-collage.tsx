"use client";

import { ProtectedImage } from "@/components/landing/protected-image";
import { cn } from "@/lib/utils";

type CollageTile = {
  src: string;
  className: string;
  objectClassName: string;
  delayMs: number;
  tileClassName?: string;
};

/**
 * Soft collage — overlapping tiles, no borders, feathered edges.
 * Rosaria · Albedo · Endmin · Yvone (footer-anime)
 */
const COLLAGE_TILES: CollageTile[] = [
  {
    src: "/footer-anime/anime-3.png", // Rosaria — upper left, extends behind bottom row
    className: "top-[2%] right-[43%] h-[68%] w-[48%] -rotate-[2deg] z-[1]",
    objectClassName: "object-cover object-[100%_8%] scale-[1.25] -translate-x-[12%]",
    tileClassName: "hover-collage-tile--rosaria",
    delayMs: 60,
  },
  {
    src: "/footer-anime/anime-4.png", // Albedo — upper right, extends behind bottom row
    className: "top-[4%] -right-[2%] h-[68%] w-[48%] rotate-[2deg] z-[1]",
    objectClassName: "object-cover object-[48%_18%] scale-[0.85]",
    tileClassName: "hover-collage-tile--albedo",
    delayMs: 120,
  },
  {
    src: "/footer-anime/endmin-nw.png", // Endmin — sits in front of top pair
    className: "top-[50%] right-[28%] h-[42%] w-[52%] rotate-[2deg] z-[3]",
    objectClassName: "object-cover object-[50%_12%] scale-[1.08]",
    tileClassName: "hover-collage-tile--endmin",
    delayMs: 180,
  },
  {
    src: "/footer-anime/anime-6.png", // Yvone — sits in front of top pair
    className: "top-[54%] right-[2%] h-[44%] w-[54%] -rotate-[3deg] z-[4]",
    objectClassName: "object-cover object-[50%_14%] scale-[1.06]",
    tileClassName: "hover-collage-tile--bottom",
    delayMs: 240,
  },
];

type HoverCollageProps = {
  active?: boolean;
  className?: string;
};

export function HoverCollage({ active = false, className }: HoverCollageProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "hover-art-fade-right pointer-events-none absolute inset-y-0 right-0 z-[1] w-[min(58%,640px)] overflow-hidden transition-all duration-500 ease-out md:w-[min(54%,720px)] lg:w-[min(50%,780px)]",
        active ? "translate-x-0 opacity-100" : "translate-x-14 opacity-0",
        className
      )}
    >
      <div className="absolute inset-0">
        {COLLAGE_TILES.map((tile, index) => (
          <div
            key={`${tile.src}-${index}`}
            className={cn(
              "hover-collage-tile absolute overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              tile.className,
              tile.tileClassName,
              active
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-8 scale-[0.96] opacity-0"
            )}
            style={{
              transitionDelay: active ? `${tile.delayMs}ms` : "0ms",
            }}
          >
            <ProtectedImage
              src={tile.src}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 400px"
              className={cn(tile.objectClassName, "mix-blend-lighten")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
