export type GameDiaryEntry = {
  slug: string;
  title: string;
  span: string;
  logo: string;
  background: string;
  /** One-line feeling — the sticky emotional beat */
  feeling: string;
  /** Short diary note — rewrite anytime */
  note: string;
};

export type GameEra = {
  id: string;
  code: string;
  title: string;
  period: string;
  summary: string;
  entries: GameDiaryEntry[];
};

/**
 * Games diary — eras from kid signal → growing up → pandemic years → now.
 * Notes are starter voice; replace with your real memories anytime.
 */
export const gameEras: GameEra[] = [
  {
    id: "kid-signal",
    code: "ERA-01",
    title: "Kid signal",
    period: "Early years",
    summary:
      "Before ranks and battle passes — just the spark. Controllers after school, borrowed cartridges, staying up past bedtime because one more run felt necessary.",
    entries: [
      {
        slug: "first-spark",
        title: "The first spark",
        span: "Before the archive",
        logo: "/games-img/studio-logo.png",
        background: "/games-img/studio-full.png",
        feeling: "Games were not a hobby yet. They were weather.",
        note: "I didn’t have a library then — just moments. Loud living rooms, shared screens, and that feeling that a world could open from nowhere. Studio Zero starts here, even without a proper logo to hang on it.",
      },
    ],
  },
  {
    id: "growing-signal",
    code: "ERA-02",
    title: "Growing signal",
    period: "Teens → early online years",
    summary:
      "Queues, lobbies, and late-night friends. Games stopped being just play — they became rooms I kept returning to while figuring out who I was.",
    entries: [
      {
        slug: "osu",
        title: "osu!",
        span: "Rhythm & focus",
        logo: "/games-img/Osu Logo.png",
        background: "/games-img/Osu back.jpg",
        feeling: "Click-click calm when everything else felt loud.",
        note: "Maps, combos, retries. A private practice room where progress was honest — miss = miss, no excuses. It taught me focus before I had language for it.",
      },
      {
        slug: "league-of-legends",
        title: "League of Legends",
        span: "Lobbies & lessons",
        logo: "/games-img/lol logo.png",
        background: "/games-img/lol back.png",
        feeling: "One more game — and the clock already knew.",
        note: "Wins felt huge. Losses taught patience the hard way. Between drafts and post-game silence, it was a whole social weather system I grew up inside.",
      },
      {
        slug: "pubg",
        title: "PUBG: Battlegrounds",
        span: "Drop & hold breath",
        logo: "/games-img/pubgg.png",
        background: "/games-img/pubg back.jpg",
        feeling: "The plane door opening still hits different.",
        note: "Blue zone tension, buddy callouts, the ridiculous joy of a clean circle. Survival as a shared ritual — half strategy, half chaos.",
      },
      {
        slug: "overwatch-2",
        title: "Overwatch 2",
        span: "Team pulse",
        logo: "/games-img/overw logo.png",
        background: "/games-img/overw back.jpg",
        feeling: "Heroes, roles, and the hope of a perfect push.",
        note: "When a team finally clicks, it feels like music. When it doesn’t, you still queue again. That optimism is part of the diary.",
      },
      {
        slug: "hearthstone",
        title: "Hearthstone",
        span: "Quiet combat",
        logo: "/games-img/heart logo.png",
        background: "/games-img/heart back.jpg",
        feeling: "Card sounds at midnight. Soft wins. Softer losses.",
        note: "A slower battlefield for when I needed thinking more than reflex. Turns, tempo, and that tiny dopamine of a drawn answer.",
      },
    ],
  },
  {
    id: "quarantine-years",
    code: "ERA-03",
    title: "Quarantine years",
    period: "≈ last 6 years · pandemic stretch",
    summary:
      "When the outside world paused, games became the hallway between days. Escapes, routines, and worlds that kept moving when everything else stood still.",
    entries: [
      {
        slug: "genshin-impact",
        title: "Genshin Impact",
        span: "Open sky escape",
        logo: "/games-img/genshin1.png",
        background: "/games-img/genshin2.jpg",
        feeling: "A place to walk when I couldn’t leave home.",
        note: "Traveling without traveling. Daily commissions as soft structure. The pandemic years needed a horizon — Teyvat gave me one I could keep returning to.",
      },
      {
        slug: "teamfight-tactics",
        title: "Teamfight Tactics",
        span: "Board & spiral",
        logo: "/games-img/TFT.png",
        background: "/games-img/TFT back.jpg",
        feeling: "One more round while the world stayed home.",
        note: "Autochess loops, economy puzzles, that sneaky ‘okay last one.’ Perfect pandemic cadence — absorbable, social enough, quiet enough.",
      },
    ],
  },
  {
    id: "still-transmitting",
    code: "ERA-04",
    title: "Still transmitting",
    period: "Now → next",
    summary:
      "The diary isn’t closed. New titles still arrive — some as curiosities, some as the next chapter waiting to be written.",
    entries: [
      {
        slug: "arknights-endfield",
        title: "Arknights: Endfield",
        span: "New frontier",
        logo: "/games-img/endfild1.png",
        background: "/games-img/endfild2.png",
        feeling: "Another world opening on purpose this time.",
        note: "Less ‘accident of childhood,’ more chosen wonder. Logging it here so the next era has a starting mark.",
      },
      {
        slug: "pragmata",
        title: "Pragmata",
        span: "On the horizon",
        logo: "/games-img/prag.png",
        background: "/games-img/prag back.jpg",
        feeling: "A signal I haven’t fully decoded yet.",
        note: "Parked in the archive as a future entry. When the story lands, this page gets a longer note.",
      },
    ],
  },
];
