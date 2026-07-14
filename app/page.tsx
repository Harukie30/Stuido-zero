"use client";

import { BrandMark } from "@/components/landing/brand-mark";
import {
  ChannelHoverArt,
  type ChannelHoverMode,
} from "@/components/landing/channel-hover-games";
import { FadeIn } from "@/components/landing/fade-in";
import { HudFrame } from "@/components/landing/hud-frame";
import { LoadingScreen } from "@/components/landing/loading-screen";
import { ProtectedImage } from "@/components/landing/protected-image";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Heart,
  Mail,
  Sparkles,
  Tv,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type HeroSlide = {
  src: string;
  background: string;
  alt: string;
  title?: string;
};

type CarouselMode = "games" | "anime";

const gameSlides: HeroSlide[] = [
  {
    src: "/games-img/genshin1.png",
    background: "/games-img/genshin2.jpg",
    alt: "Genshin Impact",
    title: "Genshin Impact",
  },
  {
    src: "/games-img/endfild1.png",
    background: "/games-img/endfild2.png",
    alt: "Arknights Endfield",
    title: "Arknights: Endfield",
  },
  {
    src: "/games-img/lol logo.png",
    background: "/games-img/lol back.png",
    alt: "League of Legends",
    title: "League of Legends",
  },
  {
    src: "/games-img/pubgg.png",
    background: "/games-img/pubg back.jpg",
    alt: "PUBG: Battlegrounds",
    title: "PUBG: Battlegrounds",
  },
  {
    src: "/games-img/overw logo.png",
    background: "/games-img/overw back.jpg",
    alt: "Overwatch 2",
    title: "Overwatch 2",
  },
  {
    src: "/games-img/TFT.png",
    background: "/games-img/TFT back.jpg",
    alt: "Teamfight Tactics",
    title: "Teamfight Tactics",
  },
  {
    src: "/games-img/heart logo.png",
    background: "/games-img/heart back.jpg",
    alt: "Heartstone",
    title: "Heartstone",
  },
  {
    src: "/games-img/prag.png",
    background: "/games-img/prag back.jpg",
    alt: "Pragmata",
    title: "Pragmata",
  },
  {
    src: "/games-img/Osu logo.png",
    background: "/games-img/Osu back.jpg",
    alt: "Osu!",
    title: "Osu!",
  },
];

// Add your anime key visuals here later:
// { src: "/games-img/anime1.png", background: "/games-img/anime1-bg.jpg", alt: "...", title: "..." }
const animeSlides: HeroSlide[] = [


];

const dossierFields = [
  { label: "Status", value: "Solo build · Online" },
  { label: "Focus", value: "Games + Anime" },
  { label: "Signal", value: "Fan-made archive" },
  { label: "Built from", value: "Queues, seasons, late nights" },
] as const;

const dossierChannels = [
  {
    id: "games" as const,
    code: "CH-01",
    label: "Games",
    detail: "Titles that shaped the taste",
    icon: Gamepad2,
    href: "/games",
  },
  {
    id: "anime" as const,
    code: "CH-02",
    label: "Anime",
    detail: "Stories that stay after the credits",
    icon: Tv,
    href: "#media",
  },
  {
    id: "solo" as const,
    code: "CH-03",
    label: "Solo builds",
    detail: "Experiments between both worlds",
    icon: Sparkles,
    href: "#newsletter",
  },
] as const;

const loopSteps = [
  {
    phase: "01",
    label: "Discover",
    detail: "Find games and anime that hit different.",
  },
  {
    phase: "02",
    label: "Collect",
    detail: "Save the ones that matter into the archive.",
  },
  {
    phase: "03",
    label: "Connect",
    detail: "See how stories and systems overlap.",
  },
  {
    phase: "04",
    label: "Create",
    detail: "Turn that inspiration into my own work.",
  },
];

const navLinks = [
  { href: "#features", label: "About" },
  { href: "#gameplay", label: "Flow" },
  { href: "/games", label: "Games" },
  { href: "#newsletter", label: "Connect" },
];

const footerArchive = [
  {
    href: "/games",
    label: "Games",
    detail: "Diary · eras & entries",
    revealArt: true,
  },
  { href: "#media", label: "Anime", detail: "Coming soon" },
  { href: "#gameplay", label: "Creative flow", detail: "How ideas move" },
];

/** Footer Games hover art — swaps pair every 2 hovers */
const footerGameArtPairs = [
  {
    left: {
      src: "/footer-anime/anime-4.png",
      className: "object-cover object-[180%_6%] scale-[1.35]",
    },
    right: {
      src: "/footer-anime/anime-3.png",
      className: "object-cover object-[68%_8%] scale-[1.35]",
    },
  },
  {
    left: {
      src: "/footer-anime/endmin-nw.png",
      className: "object-cover object-[50%_2%] scale-[1.2]",
    },
    right: {
      src: "/footer-anime/anime-6.png",
      className: "object-cover object-[70%_28%] scale-[1.3]",
    },
  },
] as const;

const footerStudio = [
  { label: "Status", value: "Solo build" },
  { label: "Focus", value: "Games + Anime" },
  { label: "Mode", value: "Personal" },
];

const hudStats = [
  { label: "STATUS", value: "SOLO BUILD" },
  { label: "FOCUS", value: "GAMES + ANIME" },
  { label: "MODE", value: "PERSONAL" },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scrollMist = useTransform(scrollYProgress, [0, 0.45, 1], [0, 0.12, 0.28]);
  const [carouselMode, setCarouselMode] = useState<CarouselMode>("games");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchKey, setGlitchKey] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [bootDone, setBootDone] = useState(false);
  const [showFooterGamesArt, setShowFooterGamesArt] = useState(false);
  const [footerGamesHoverCount, setFooterGamesHoverCount] = useState(0);
  const [clearanceOpen, setClearanceOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState<ChannelHoverMode | null>(
    null
  );
  const [glitchingChannel, setGlitchingChannel] =
    useState<ChannelHoverMode | null>(null);
  const skipNextGlitch = useRef(true);

  // Hover 1–2 → pair 0, hover 3–4 → pair 1, then loops
  const footerArtPairIndex =
    footerGamesHoverCount === 0
      ? 0
      : Math.floor((footerGamesHoverCount - 1) / 2) % footerGameArtPairs.length;

  const footerArtPair =
    footerGameArtPairs[footerArtPairIndex] ?? footerGameArtPairs[0];

  const revealFooterGamesArt = () => {
    setFooterGamesHoverCount((count) => count + 1);
    setShowFooterGamesArt(true);
  };

  const showFooterGamesArtOnly = () => {
    setShowFooterGamesArt(true);
  };

  const hideFooterGamesArt = () => {
    setShowFooterGamesArt(false);
  };

  const heroSlides = carouselMode === "games" ? gameSlides : animeSlides;
  const slideCount = heroSlides.length;
  const activeBackground = heroSlides[activeSlide]?.background;
  const currentSlide = heroSlides[activeSlide];

  const switchMode = (mode: CarouselMode) => {
    if (mode === carouselMode) return;
    setCarouselMode(mode);
    setActiveSlide(0);
    skipNextGlitch.current = false;
  };

  const goPrev = () => {
    if (slideCount <= 1) return;
    setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const goNext = () => {
    if (slideCount <= 1) return;
    setActiveSlide((prev) => (prev + 1) % slideCount);
  };

  useEffect(() => {
    if (!bootDone) return;
    setHasMounted(true);
  }, [bootDone]);

  useEffect(() => {
    if (!hasMounted) return;

    if (skipNextGlitch.current) {
      skipNextGlitch.current = false;
      return;
    }

    setIsGlitching(true);
    setGlitchKey((key) => key + 1);

    const timeout = window.setTimeout(() => {
      setIsGlitching(false);
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [activeSlide, carouselMode, hasMounted]);

  useEffect(() => {
    if (!hasMounted || slideCount <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideCount);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [slideCount, activeSlide, hasMounted, carouselMode]);

  return (
    <div className="bg-tactical relative min-h-full flex flex-col">
      {!bootDone ? (
        <LoadingScreen onComplete={() => setBootDone(true)} />
      ) : null}
      <ScrollProgress />

      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-1/2 z-0 h-[65vh] w-[95vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,oklch(0.96_0.025_350/0.2),transparent_68%)]"
      />
      <motion.div
        aria-hidden
        style={{ opacity: scrollMist }}
        className="pointer-events-none fixed inset-0 z-0 bg-[oklch(0.18_0.04_350)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[40vh] bg-[linear-gradient(to_top,oklch(0.19_0.042_350/0.55),transparent)]"
      />

      <header className="sticky top-0 z-40 border-b border-primary/15 glass-panel">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <BrandMark href="#hero" priority />
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hud-label transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
          <Button
            size="sm"
            className="rounded-sm bg-primary font-medium text-primary-foreground hover:bg-primary/90"
            nativeButton={false}
            render={<a href="#newsletter" />}
          >
            Connect
          </Button>
        </nav>
      </header>

      <main className="relative z-10 flex-1">
        <section
          id="hero"
          className="relative scroll-mt-14 overflow-hidden px-6 pb-24 pt-20 md:pb-32 md:pt-28"
        >
          {activeBackground ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBackground}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute inset-0"
                >
                  <ProtectedImage
                    src={activeBackground}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover opacity-45 blur-[9px] scale-110"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/35" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />
            </div>
          ) : null}

          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[oklch(0.95_0.03_350/0.12)] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/3 right-0 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-[360px] w-[360px] rounded-full bg-accent/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={
                  bootDone ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }
                }
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
              >
                <Badge
                  variant="outline"
                  className="mb-6 gap-2 rounded-sm border-primary/40 bg-background/50 px-3 py-1 text-primary backdrop-blur-sm"
                >
                  
                  <span className="hud-label text-primary">Personal Studio</span>
                </Badge>

                <div className="relative mb-6 h-20 w-[min(100%,420px)] sm:h-24 sm:w-[480px] md:h-28 md:w-[560px]">
                  <ProtectedImage
                    src="/games-img/studio-full.png"
                    alt="Studio Zero"
                    fill
                    sizes="(max-width: 768px) 90vw, 560px"
                    className="object-contain object-left"
                    priority
                  />
                </div>

                <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] md:text-5xl lg:text-6xl">
                  Where{" "}
                  <span className="text-gradient-tactical">
                    Anime and Games Connect
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/85 md:text-lg">
                  My own mini studio for the hobbies that shaped me. collecting
                  the games I play, the anime I love, and the ideas that grow
                  between them.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="rounded-sm px-6"
                    nativeButton={false}
                    render={<a href="#features" />}
                  >
                    <Sparkles className="size-4" />
                    Explore Studio
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-sm border-primary/30 bg-background/40 px-6 backdrop-blur-sm hover:bg-primary/10"
                    nativeButton={false}
                    render={<Link href="/games" />}
                  >
                    <Gamepad2 className="size-4" />
                    Games Diary
                  </Button>
                </div>

                <div className="mt-10 flex flex-wrap gap-6 border-t border-primary/15 pt-6">
                  {hudStats.map((stat) => (
                    <div key={stat.label}>
                      <p className="hud-label">{stat.label}</p>
                      <p className="mt-1 font-mono-hud text-sm text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={
                  bootDone ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }
                }
                transition={{
                  duration: 0.8,
                  delay: bootDone ? 0.15 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative mx-auto w-full max-w-md"
              >
                {/* Games / Anime switch */}
                <div className="mb-4 flex items-center justify-center gap-1 rounded-sm border border-primary/20 bg-background/40 p-1 backdrop-blur-sm">
                  <Button
                    type="button"
                    size="sm"
                    variant={carouselMode === "games" ? "default" : "ghost"}
                    onClick={() => switchMode("games")}
                    className="flex-1 rounded-sm"
                  >
                    <Gamepad2 className="size-3.5" />
                    Games
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={carouselMode === "anime" ? "default" : "ghost"}
                    onClick={() => switchMode("anime")}
                    className="flex-1 rounded-sm"
                  >
                    <Tv className="size-3.5" />
                    Anime
                  </Button>
                </div>

                <div className="relative aspect-square w-full overflow-hidden">
                  {currentSlide ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${carouselMode}-${currentSlide.src}`}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={cn(
                          "absolute inset-0 z-10",
                          isGlitching && "glitch-image"
                        )}
                      >
                        <ProtectedImage
                          src={currentSlide.src}
                          alt={currentSlide.alt}
                          fill
                          sizes="(max-width: 768px) 90vw, 448px"
                          className="object-contain"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 border border-primary/15 bg-card/40 p-6 text-center backdrop-blur-sm">
                      <Tv className="size-8 text-primary/70" />
                      <p className="font-display text-xl">Anime archive</p>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        Coming soon — drop your anime visuals into{" "}
                        <span className="font-mono-hud text-xs text-primary">
                          /games-img
                        </span>{" "}
                        and add them to the list.
                      </p>
                    </div>
                  )}

                  {isGlitching ? (
                    <div
                      key={glitchKey}
                      aria-hidden
                      className="glitch-overlay is-active"
                    >
                      <div className="glitch-scanlines" />
                      <div className="glitch-noise" />
                    </div>
                  ) : null}

                  {slideCount > 1 ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={goPrev}
                        className="absolute top-1/2 left-2 z-30 -translate-y-1/2 rounded-full border-primary/30 bg-background/50 text-foreground hover:bg-primary/15 hover:text-primary"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={goNext}
                        className="absolute top-1/2 right-2 z-30 -translate-y-1/2 rounded-full border-primary/30 bg-background/50 text-foreground hover:bg-primary/15 hover:text-primary"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </>
                  ) : null}
                </div>

                {currentSlide?.title ? (
                  <p className="mt-3 text-center font-mono-hud text-xs tracking-widest text-muted-foreground uppercase">
                    {carouselMode === "games" ? "Played" : "Watched"} //{" "}
                    {currentSlide.title}
                  </p>
                ) : null}
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="relative scroll-mt-14 overflow-x-hidden px-6 py-20 md:py-28"
        >
          <ChannelHoverArt mode={activeChannel} />

          <div className="relative z-10 mx-auto max-w-6xl">
            <FadeIn>
              <p className="hud-label text-primary">About Studio Zero</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Operator dossier
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
                Not a company profile a clearance file for the person behind
                the archive.
              </p>
            </FadeIn>

            <FadeIn delay={0.08} className="mt-12">
              <HudFrame className="bg-[oklch(0.2_0.035_350/0.72)] p-6 backdrop-blur-sm md:p-8">
                <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
                  {/* Origin */}
                  <div>
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <p className="hud-label text-primary">SZ-DOSSIER</p>
                      <span
                        aria-hidden
                        className="h-px flex-1 min-w-8 bg-gradient-to-r from-primary/35 to-transparent"
                      />
                      <p className="font-mono-hud text-[10px] tracking-[0.22em] text-primary/70">
                        FILE // OPEN
                      </p>
                    </div>

                    <p className="font-display text-2xl leading-snug font-medium tracking-tight text-foreground md:text-3xl">
                      Studio Zero started in the gap between the next queue and
                      the next episode.
                    </p>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                      A personal mini studio for the games I play, the anime I
                      love, and the ideas that grow when both worlds collide
                      built solo, updated as I go.
                    </p>
                  </div>

                  {/* HUD fields */}
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

                {/* Channel strip */}
                <div className="mt-8 border-t border-primary/15 pt-6">
                  <p className="hud-label mb-4 text-primary/80">
                    Active channels
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                    {dossierChannels.map((channel) => {
                      const isActive = activeChannel === channel.id;
                      const isGlitching = glitchingChannel === channel.id;

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

                      return (
                        <Link
                          key={channel.code}
                          href={channel.href}
                          data-channel={channel.id}
                          className={cn(
                            "channel-glitch-chip group flex items-start gap-3 rounded-sm border border-primary/15 bg-background/25 px-3.5 py-3 transition-colors hover:border-primary/35 hover:bg-primary/5",
                            isActive && "is-glowing",
                            isGlitching && "is-glitching"
                          )}
                          onMouseEnter={triggerChannel}
                          onMouseLeave={clearChannel}
                          onFocus={triggerChannel}
                          onBlur={clearChannel}
                          onAnimationEnd={(event) => {
                            if (
                              event.animationName.includes(
                                "channel-glitch-chip-shake"
                              )
                            ) {
                              setGlitchingChannel(null);
                            }
                          }}
                        >
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
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </HudFrame>
            </FadeIn>
          </div>
        </section>

        <Separator className="mx-auto max-w-6xl bg-primary/15" />

        <section id="gameplay" className="scroll-mt-14 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <FadeIn className="text-center">
              <p className="hud-label text-accent">Creative Flow</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                How inspiration moves
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
                From the next game I boot up to the next show I finish this is
                the loop behind Studio Zero.
              </p>
            </FadeIn>

            <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-primary/15 bg-primary/10 sm:grid-cols-2 lg:grid-cols-4">
              {loopSteps.map((item, i) => (
                <FadeIn key={item.phase} delay={i * 0.08}>
                  <div className="h-full bg-card/70 p-6 backdrop-blur-sm transition-colors hover:bg-card/85">
                    <p className="hud-label text-primary">{item.phase}</p>
                    <h3 className="mt-3 font-display text-lg font-medium">
                      {item.label}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section id="media" className="scroll-mt-14 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <p className="hud-label text-primary">Archive</p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Collection in progress
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
                Games first. Anime next. More entries unlock as I keep building
                this space.
              </p>
            </FadeIn>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Games played", status: "ACTIVE" },
                { label: "Anime watched", status: "COMING SOON" },
                { label: "Studio notes", status: "SOLO LOG" },
              ].map((item, i) => (
                <FadeIn key={item.label} delay={i * 0.1}>
                  <HudFrame className="group glass-panel aspect-[4/3] overflow-hidden transition-colors hover:border-primary/30">
                    <div className="flex h-full flex-col justify-between p-5">
                      <span className="hud-label text-primary/50">
                        FILE // 0{i + 1}
                      </span>
                      <div>
                        <p className="font-display text-lg font-medium">
                          {item.label}
                        </p>
                        <p className="mt-1 font-mono-hud text-xs text-muted-foreground">
                          {item.status}
                        </p>
                      </div>
                    </div>
                  </HudFrame>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section id="newsletter" className="scroll-mt-14 px-6 py-20 md:py-28">
          <FadeIn>
            <HudFrame className="mx-auto max-w-3xl glass-panel p-8 md:p-12">
              <div className="text-center">
                <p className="hud-label text-accent">Stay Connected</p>
                <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                  Follow the studio
                </h2>
                <p className="mx-auto mt-4 max-w-md text-muted-foreground md:text-lg">
                  Occasional updates on what I’m playing, watching, and building
                  , no spam, just Studio Zero.
                </p>
                <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="h-10 flex-1 rounded-sm border border-primary/15 bg-background/50 px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                  <Button className="rounded-sm px-6">
                    <Mail className="size-4" />
                    Subscribe
                  </Button>
                </div>
              </div>
            </HudFrame>
          </FadeIn>
        </section>
      </main>

      <footer className="relative z-10 overflow-x-hidden border-t border-primary/15 bg-[oklch(0.19_0.042_350/0.92)] backdrop-blur-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />

        {/* Games hover art — left character */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-0 w-[min(48%,360px)] overflow-hidden transition-all duration-500 ease-out md:w-[min(42%,420px)]",
            showFooterGamesArt
              ? "translate-x-0 opacity-100"
              : "-translate-x-8 opacity-0"
          )}
        >
          {/* Image sits slightly shorter inside the same frame */}
          <div className="hover-art-fade-left absolute inset-x-0 bottom-0 top-[12%]">
            <ProtectedImage
              key={footerArtPair.left.src}
              src={footerArtPair.left.src}
              alt=""
              fill
              sizes="420px"
              className={cn(
                footerArtPair.left.className,
                "mix-blend-lighten opacity-70"
              )}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.19_0.042_350/0.35)] from-0% via-[oklch(0.19_0.042_350/0.2)] via-40% to-[oklch(0.19_0.042_350/0.95)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.19_0.042_350/0.55)] via-transparent to-[oklch(0.19_0.042_350/0.35)]" />
        </div>
        {/* Games hover art — right character */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-0 w-[min(48%,360px)] overflow-hidden transition-all duration-500 ease-out md:w-[min(42%,420px)]",
            showFooterGamesArt
              ? "translate-x-0 opacity-100"
              : "translate-x-8 opacity-0"
          )}
        >
          <div className="hover-art-fade-right absolute inset-x-0 bottom-0 top-[12%]">
            <ProtectedImage
              key={footerArtPair.right.src}
              src={footerArtPair.right.src}
              alt=""
              fill
              sizes="420px"
              className={cn(
                footerArtPair.right.className,
                "mix-blend-lighten opacity-70"
              )}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-l from-[oklch(0.19_0.042_350/0.35)] from-0% via-[oklch(0.19_0.042_350/0.2)] via-40% to-[oklch(0.19_0.042_350/0.95)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.19_0.042_350/0.55)] via-transparent to-[oklch(0.19_0.042_350/0.35)]" />
        </div>

        {/* Soft center veil — keeps copy readable without flattening the art */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,oklch(0.19_0.042_350/0.72)_0%,oklch(0.19_0.042_350/0.35)_42%,transparent_72%)] transition-opacity duration-500",
            showFooterGamesArt ? "opacity-100" : "opacity-0"
          )}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-14 pb-8">
          <div className="grid gap-12 md:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))] md:gap-10">
            {/* Brand */}
            <div className="max-w-sm">
              <BrandMark href="#hero" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                A personal mini studio for the games I play, the anime I love,
                and the ideas that grow between them.
              </p>
              <p className="mt-3 font-display text-sm text-primary/90">
                Where Anime and Games Connect
              </p>
              <Button
                size="sm"
                className="mt-6 rounded-sm"
                nativeButton={false}
                render={<a href="#newsletter" />}
              >
                <Mail className="size-3.5" />
                Stay connected
              </Button>
            </div>

            {/* Explore */}
            <div>
              <p className="hud-label text-primary">Explore</p>
              <ul className="mt-4 space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#hero"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Intro
                  </a>
                </li>
              </ul>
            </div>

            {/* Archive */}
            <div>
              <p className="hud-label text-accent">Archive</p>
              <ul className="mt-4 space-y-3">
                {footerArchive.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="group block"
                      onMouseEnter={
                        "revealArt" in item && item.revealArt
                          ? revealFooterGamesArt
                          : undefined
                      }
                      onMouseLeave={
                        "revealArt" in item && item.revealArt
                          ? hideFooterGamesArt
                          : undefined
                      }
                      onFocus={
                        "revealArt" in item && item.revealArt
                          ? showFooterGamesArtOnly
                          : undefined
                      }
                      onBlur={
                        "revealArt" in item && item.revealArt
                          ? hideFooterGamesArt
                          : undefined
                      }
                    >
                      <span className="text-sm text-foreground/90 transition-colors group-hover:text-primary">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.detail}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Studio */}
            <div>
              <p className="hud-label text-primary">Studio</p>
              <ul className="mt-4 space-y-3">
                {footerStudio.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-baseline justify-between gap-3 border-b border-primary/10 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="hud-label text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-right text-sm text-foreground/85">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <Heart className="size-3 text-primary/70" />
                Built solo, updated as I go
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-primary/10 pt-6 sm:flex-row sm:items-center">
            <p className="hud-label shrink-0">
              © {new Date().getFullYear()} Studio Zero
            </p>

            <div className="mx-auto w-full max-w-md text-center sm:px-4">
              <button
                type="button"
                aria-expanded={clearanceOpen}
                aria-controls="sz-clearance"
                onClick={() => setClearanceOpen((open) => !open)}
                className={cn(
                  "group inline-flex items-center gap-2.5 rounded-sm border px-3.5 py-1.5 transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                  clearanceOpen
                    ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_20px_oklch(0.78_0.11_15/0.12)]"
                    : "border-primary/20 bg-background/25 text-muted-foreground hover:border-primary/35 hover:text-primary"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "font-display text-[11px] leading-none transition-colors",
                    clearanceOpen ? "text-primary" : "text-primary/60 group-hover:text-primary"
                  )}
                >
                  ◆
                </span>
                <span className="hud-label text-[10px] tracking-[0.2em]">
                  Transmission clearance
                </span>
                <span
                  className={cn(
                    "rounded-[2px] border px-1.5 py-0.5 font-mono-hud text-[9px] tracking-[0.22em] transition-colors",
                    clearanceOpen
                      ? "border-primary/45 bg-primary/15 text-primary"
                      : "border-primary/25 bg-background/40 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary"
                  )}
                >
                  {clearanceOpen ? "OPEN" : "LOCKED"}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {clearanceOpen ? (
                  <motion.div
                    id="sz-clearance"
                    key="clearance"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mb-3 flex items-center justify-center gap-3">
                      <span
                        aria-hidden
                        className="h-px w-8 bg-gradient-to-r from-transparent to-primary/40"
                      />
                      <p className="hud-label text-primary/80">Seal released</p>
                      <span
                        aria-hidden
                        className="h-px w-8 bg-gradient-to-l from-transparent to-primary/40"
                      />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Built without license, partnership, or sponsorship from
                      any rights holder.
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/80">
                      Fan love only. Worlds referenced belong to their
                      creators.
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <a
              href="#hero"
              className="hud-label shrink-0 text-primary/80 transition-colors hover:text-primary sm:ml-auto"
            >
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
