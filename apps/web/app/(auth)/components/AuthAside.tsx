import { Headphones, Library, Sparkles, Waves } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import AudioWaveform from "@/components/utils/audio-waveform";

const benefits = [
  {
    icon: Sparkles,
    title: "AI book analysis",
    description: "Chapters, scenes, and characters organized for you.",
  },
  {
    icon: Waves,
    title: "Natural narration",
    description: "Expressive voices that make every chapter feel alive.",
  },
  {
    icon: Library,
    title: "Your listening library",
    description: "Pick up where you left off across all your books.",
  },
];

export function AuthAside() {
  return (
    <aside className="ink-panel m-4 flex flex-col justify-between p-6 sm:p-8 lg:min-h-[calc(100vh-2rem)] lg:p-10">
      <div>
        <div className="flex items-center gap-2.5">
          <Avatar className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Headphones size={18} />
          </Avatar>
          <span className="font-display text-xl">StoryVoice</span>
        </div>

        <div className="mt-12 max-w-lg lg:mt-24">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
            Your next chapter starts here
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.02] sm:text-5xl">
            Turn the books you love into something you can hear.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-ink-muted">
            StoryVoice transforms your books into immersive audiobooks with
            intelligent narration and consistent character voices.
          </p>
        </div>

        <div className="mt-10 border-y border-ink-border py-5">
          <AudioWaveform
            playing
            progress={42}
            bars={32}
            className="h-12 text-ink-muted"
          />
          <div className="mt-2 flex justify-between text-[11px] text-ink-muted">
            <span>Chapter 7</span>
            <span>14:32 / 42:17</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div key={benefit.title} className="flex gap-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">{benefit.title}</p>
                <p className="mt-1 text-xs leading-5 text-ink-muted">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
