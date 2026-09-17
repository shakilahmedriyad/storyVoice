"use client";
import {
  ArrowRight,
  Headphones,
  Pause,
  Play,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AudioWaveform from "@/components/utils/audio-waveform";
import { useState } from "react";

const features = [
  {
    icon: Sparkles,
    title: "AI Book Analysis",
    description:
      "Automatically understands chapters, scenes, dialogue, and characters.",
  },
  {
    icon: Waves,
    title: "Natural AI Voices",
    description: "Generate expressive narration using different voices.",
  },
  {
    icon: Users,
    title: "Character Voices",
    description: "Automatically assign consistent voices to characters.",
  },
  {
    icon: Headphones,
    title: "Smart Chapter Navigation",
    description: "Listen to your book chapter by chapter.",
  },
  {
    icon: Pause,
    title: "Continue Listening",
    description: "Resume exactly where you stopped.",
  },
];

function AudioPreview() {
  const [isPlaying, setIsPlaying] = useState(true);
  return (
    <div className="ink-panel w-full max-w-116.25 p-5 shadow-lift">
      <div className="flex gap-4">
        <img
          src="/cover-silent-city.jpg"
          alt="The Silent City book cover"
          className="h-31.5 w-21 rounded-lg object-cover"
        />
        <div className="min-w-0 pt-0.5">
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">
            Now playing
          </p>
          <h2 className="mt-1 truncate font-sans text-xl font-bold tracking-normal">
            The Silent City
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">Elena Carter</p>
          <p className="mt-3 text-sm">Chapter 7 - The Stranger</p>
          <p className="mt-1 text-xs italic text-ink-muted">
            "The room suddenly became silent."
          </p>
        </div>
      </div>

      <AudioWaveform
        playing={isPlaying}
        progress={38}
        bars={38}
        className="mt-5 h-14 text-ink-muted [&_span:first-child]:bg-primary"
      />

      <div className="mt-1 flex justify-between text-xs text-ink-muted">
        <span>14:32</span>
        <span>42:17</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            size="icon-lg"
            className="rounded-full"
            aria-label="Pause preview"
          >
            {isPlaying ? (
              <Pause fill="currentColor" />
            ) : (
              <Play fill="currentColor" />
            )}
          </Button>
          <div>
            <p className="text-xs font-bold">Narrator - Warm</p>
            <p className="text-[11px] text-ink-muted">Voice: Aria</p>
          </div>
        </div>
        <span className="rounded-full border border-ink-border px-2.5 py-1 text-xs text-ink-muted">
          1.25x
        </span>
      </div>
    </div>
  );
}

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  const Icon = feature.icon;

  return (
    <article className="surface hover-lift min-h-40.5 p-5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary-foreground">
        <Icon size={17} />
      </div>
      <h3 className="mt-4 font-sans text-lg font-bold tracking-normal">
        {feature.title}
      </h3>
      <p className="mt-1.5 max-w-67.5 text-sm leading-5 text-muted-foreground">
        {feature.description}
      </p>
    </article>
  );
}

export default function Home() {
  return (
    <main>
      <section className="grid items-center gap-12 border-b py-20 md:grid-cols-[1fr_1fr] md:gap-16 md:py-24">
        <div>
          <Badge
            variant="outline"
            className="gap-1.5 bg-card px-3 py-1 text-muted-foreground"
          >
            <Sparkles size={13} className="text-primary" />
            AI narration studio
          </Badge>
          <h1 className="mt-6 max-w-127.5 font-sans text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
            Turn any book into an immersive audiobook.
          </h1>
          <p className="mt-6 max-w-127.5 text-base leading-7 text-muted-foreground sm:text-lg">
            Upload a PDF and let AI transform your book into a natural,
            expressive audiobook with intelligent narration and character
            voices.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg">
              Create Audiobook <ArrowRight />
            </Button>
            <Button variant="outline" size="lg">
              Explore Demo
            </Button>
          </div>
          <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">
            No setup / 40+ voices / chapter-aware
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <AudioPreview />
        </div>
      </section>

      <section className="py-20 md:py-24">
        <h2 className="max-w-130 font-sans text-4xl font-bold leading-[1.05] tracking-[-0.035em]">
          Everything you need to bring books to life
        </h2>
        <div className="mt-9 grid gap-3 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
          <article className="ink-panel flex min-h-40.5 flex-col justify-between p-5">
            <h3 className="font-sans text-lg font-bold tracking-normal">
              Start with your first book
            </h3>
            <Button className="w-fit" size="sm">
              Upload a PDF
            </Button>
          </article>
        </div>
      </section>

      <footer className="flex items-center justify-between border-t py-8 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">StoryVoice</span>
        <span>Turn your books into immersive audiobooks.</span>
      </footer>
    </main>
  );
}
