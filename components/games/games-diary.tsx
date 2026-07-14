"use client";

import { BrandMark } from "@/components/landing/brand-mark";
import { FadeIn } from "@/components/landing/fade-in";
import { HudFrame } from "@/components/landing/hud-frame";
import { ProtectedImage } from "@/components/landing/protected-image";
import { Button } from "@/components/ui/button";
import { gameEras } from "@/lib/games-diary";
import { skipStudioBootOnce } from "@/lib/studio-boot";
import { cn } from "@/lib/utils";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function GamesDiary() {
  const [titleGlitch, setTitleGlitch] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setTitleGlitch(false), 780);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="bg-tactical relative min-h-full flex flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.95_0.03_350/0.08),transparent_55%)]"
      />

      <header className="relative z-20 border-b border-primary/15 bg-[oklch(0.19_0.042_350/0.72)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
          <BrandMark href="/" />
          <nav className="flex items-center gap-4">
            <p className="hud-label hidden text-primary sm:block">
              SZ-ARCHIVE // GAMES
            </p>
            <Button
              size="sm"
              variant="outline"
              className="rounded-sm border-primary/25 bg-background/30"
              nativeButton={false}
              render={<Link href="/" onClick={() => skipStudioBootOnce()} />}
            >
              <ArrowLeft className="size-3.5" />
              Studio
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* Intro transmission */}
        <section className="px-6 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <p className="hud-label text-primary">Games diary</p>
                <span
                  aria-hidden
                  className="h-px w-10 bg-gradient-to-r from-primary/40 to-transparent"
                />
                <p className="font-mono-hud text-[10px] tracking-[0.22em] text-primary/70">
                  FILE // OPEN
                </p>
              </div>

              <h1
                className={cn(
                  "font-display max-w-3xl text-4xl leading-tight font-semibold tracking-tight md:text-5xl lg:text-6xl",
                  titleGlitch && "diary-title-glitch"
                )}
              >
                A logbook of worlds that{" "}
                <span
                  data-glitch="moved me"
                  className={cn(
                    "text-gradient-tactical",
                    titleGlitch && "diary-title-glitch-word"
                  )}
                >
                  moved me
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Not reviews. Not rankings. Just the eras — kid spark, growing
                up in lobbies, and the quiet years when the pandemic made games
                feel like hallways between days.
              </p>

              <div className="mt-8 flex flex-wrap gap-6 border-t border-primary/15 pt-6">
                <div>
                  <p className="hud-label">Eras</p>
                  <p className="mt-1 font-mono-hud text-sm text-foreground">
                    {String(gameEras.length).padStart(2, "0")}
                  </p>
                </div>
                <div>
                  <p className="hud-label">Entries</p>
                  <p className="mt-1 font-mono-hud text-sm text-foreground">
                    {String(
                      gameEras.reduce((n, era) => n + era.entries.length, 0)
                    ).padStart(2, "0")}
                  </p>
                </div>
                <div>
                  <p className="hud-label">Mode</p>
                  <p className="mt-1 font-mono-hud text-sm text-foreground">
                    Personal
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Era jump chips */}
            <FadeIn delay={0.08} className="mt-10">
              <div className="flex flex-wrap gap-2">
                {gameEras.map((era) => (
                  <a
                    key={era.id}
                    href={`#${era.id}`}
                    className="inline-flex items-center gap-2 rounded-sm border border-primary/20 bg-background/30 px-3 py-1.5 transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  >
                    <span className="hud-label text-primary/70">{era.code}</span>
                    <span className="text-xs text-foreground/85">{era.title}</span>
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Eras */}
        <div className="mx-auto max-w-6xl space-y-20 px-6 pb-24 md:pb-32">
          {gameEras.map((era, eraIndex) => (
            <section
              key={era.id}
              id={era.id}
              className="scroll-mt-20"
            >
              <FadeIn>
                <HudFrame className="overflow-hidden bg-[oklch(0.2_0.035_350/0.5)] p-6 backdrop-blur-sm md:p-8">
                  <div className="flex flex-col gap-4 border-b border-primary/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <p className="hud-label text-primary">{era.code}</p>
                        <span
                          aria-hidden
                          className="inline-block size-1.5 rounded-full bg-primary/70"
                        />
                        <p className="font-mono-hud text-[10px] tracking-[0.2em] text-muted-foreground">
                          {era.period}
                        </p>
                      </div>
                      <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                        {era.title}
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                        {era.summary}
                      </p>
                    </div>
                    <p className="hud-label shrink-0 text-primary/55">
                      {String(eraIndex + 1).padStart(2, "0")} /{" "}
                      {String(gameEras.length).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="mt-8 space-y-6">
                    {era.entries.map((entry) => (
                      <article
                        key={entry.slug}
                        className="group grid gap-5 rounded-sm border border-primary/12 bg-background/20 p-4 transition-colors hover:border-primary/30 hover:bg-primary/[0.04] sm:grid-cols-[7.5rem_1fr] sm:gap-6 sm:p-5"
                      >
                        <div className="relative mx-auto aspect-square w-24 overflow-hidden sm:mx-0 sm:w-full">
                          <ProtectedImage
                            src={entry.logo}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-contain p-1 opacity-90 transition-opacity group-hover:opacity-100"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h3 className="font-display text-xl font-medium tracking-tight text-foreground">
                              {entry.title}
                            </h3>
                            <span className="font-mono-hud text-[10px] tracking-[0.18em] text-primary/65">
                              {entry.span}
                            </span>
                          </div>

                          <p className="mt-2 font-display text-base leading-snug text-primary/90 md:text-lg">
                            “{entry.feeling}”
                          </p>

                          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            {entry.note}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </HudFrame>
              </FadeIn>
            </section>
          ))}

          <FadeIn>
            <div className="flex flex-col items-start justify-between gap-6 border-t border-primary/15 pt-10 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 size-4 text-primary/70" />
                <div>
                  <p className="hud-label text-primary">Transmission open</p>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    More entries get written as seasons pass. This diary grows
                    with the archive.
                  </p>
                </div>
              </div>
              <Button
                className="rounded-sm"
                nativeButton={false}
                render={<Link href="/" onClick={() => skipStudioBootOnce()} />}
              >
                <ArrowLeft className="size-4" />
                Back to Studio Zero
              </Button>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
