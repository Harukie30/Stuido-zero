"use client";

import Image, { type ImageProps } from "next/image";
import type { DragEvent, MouseEvent } from "react";
import { cn } from "@/lib/utils";

type ProtectedImageProps = Omit<
  ImageProps,
  "onContextMenu" | "onDragStart"
> & {
  /** Soft protection against casual drag / right-click save. Default true. */
  protect?: boolean;
  onContextMenu?: (event: MouseEvent<HTMLDivElement>) => void;
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
};

/**
 * Next.js Image wrapper that discourages casual copying (drag, right-click save).
 * Not real DRM — screenshots and DevTools can still grab the file.
 * Lazy-loads by default unless `priority` is set (same as next/image).
 */
export function ProtectedImage({
  protect = true,
  fill,
  className,
  alt,
  onContextMenu,
  onDragStart,
  ...props
}: ProtectedImageProps) {
  const block = (event: MouseEvent<HTMLDivElement> | DragEvent<HTMLDivElement>) => {
    if (!protect) return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className={cn(
        "select-none",
        fill ? "absolute inset-0" : "relative inline-block max-w-full"
      )}
      onContextMenu={(event) => {
        block(event);
        onContextMenu?.(event);
      }}
      onDragStart={(event) => {
        block(event);
        onDragStart?.(event);
      }}
    >
      <Image
        {...props}
        alt={alt}
        fill={fill}
        draggable={false}
        className={cn(
          "pointer-events-none select-none [-webkit-user-drag:none]",
          className
        )}
      />
      {protect ? (
        <div className="absolute inset-0 z-[1]" aria-hidden />
      ) : null}
    </div>
  );
}
