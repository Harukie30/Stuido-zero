import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type HudFrameProps = {
  children: ReactNode;
  className?: string;
};

export function HudFrame({ children, className }: HudFrameProps) {
  return (
    <div className={cn("hud-frame relative", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-4 w-4 border-t border-l border-primary"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-4 w-4 border-t border-r border-primary"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b border-l border-primary"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 h-4 w-4 border-r border-b border-primary"
      />
      {children}
    </div>
  );
}
