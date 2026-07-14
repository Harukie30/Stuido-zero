"use client";

import { AboutExperience } from "@/components/about/about-experience";
import { skipStudioBootOnce } from "@/lib/studio-boot";
import { useRouter } from "next/navigation";

/** Deep-link entry — mounts AboutExperience fresh */
export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-[oklch(0.16_0.035_350)]">
      <AboutExperience
        onClose={() => {
          skipStudioBootOnce();
          router.push("/");
        }}
      />
    </div>
  );
}
