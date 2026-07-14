import type { LucideIcon } from "lucide-react";
import { Gamepad2, Sparkles, Tv } from "lucide-react";
import type { ChannelHoverMode } from "@/components/landing/channel-hover-games";

export const dossierFields = [
  { label: "Status", value: "Solo build · Online" },
  { label: "Focus", value: "Games + Anime" },
  { label: "Signal", value: "Fan-made archive" },
  { label: "Built from", value: "Queues, seasons, late nights" },
] as const;

export type DossierChannel = {
  id: ChannelHoverMode;
  code: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  href: string;
};

export const dossierChannels: DossierChannel[] = [
  {
    id: "games",
    code: "CH-01",
    label: "Games",
    detail: "Titles that shaped the taste",
    icon: Gamepad2,
    href: "/games",
  },
  {
    id: "anime",
    code: "CH-02",
    label: "Anime",
    detail: "Stories that stay after the credits",
    icon: Tv,
    href: "/#media",
  },
  {
    id: "solo",
    code: "CH-03",
    label: "Solo builds",
    detail: "Experiments between both worlds",
    icon: Sparkles,
    href: "/#newsletter",
  },
];
