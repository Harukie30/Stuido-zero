"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  children,
  value,
  orientation = "horizontal",
  ...props
}: ProgressPrimitive.Root.Props & {
  orientation?: "horizontal" | "vertical"
}) {
  const isVertical = orientation === "vertical"

  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      data-orientation={orientation}
      className={cn(
        "flex gap-3",
        isVertical ? "h-full flex-col items-center" : "flex-wrap",
        className
      )}
      {...props}
    >
      {children}
      <ProgressTrack
        className={cn(
          isVertical
            ? "h-full w-1.5 overflow-y-hidden"
            : "h-1.5 w-full overflow-x-hidden"
        )}
      >
        <ProgressIndicator
          className={cn(isVertical ? "w-full origin-top" : "h-full")}
        />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex items-center overflow-hidden rounded-full bg-muted",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("bg-primary transition-all", className)}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
