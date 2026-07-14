import { GamesDiary } from "@/components/games/games-diary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games Diary — Studio Zero",
  description:
    "A personal logbook of games that moved me — from kid spark through growing up, to the pandemic years and beyond.",
  openGraph: {
    title: "Games Diary — Studio Zero",
    description:
      "Not reviews. Eras, feelings, and the worlds that stayed with me.",
    type: "website",
  },
};

export default function GamesPage() {
  return <GamesDiary />;
}
