import type { CSSProperties } from "react";
import type { CoverStyle } from "../library-data";

const coverBackgrounds: Record<CoverStyle, string> = {
  city: "radial-gradient(ellipse at 82% 78%, color-mix(in oklch, var(--color-primary) 62%, transparent), transparent 43%), linear-gradient(150deg, var(--color-ink), color-mix(in oklch, var(--color-ink) 55%, var(--color-background)))",
  signal: "radial-gradient(circle at 82% 56%, color-mix(in oklch, var(--color-primary) 38%, transparent), transparent 5%), linear-gradient(150deg, var(--color-ink), color-mix(in oklch, var(--color-ink) 78%, var(--color-muted)))",
  horizon: "radial-gradient(ellipse at 50% 64%, color-mix(in oklch, var(--color-primary) 68%, var(--color-background)), transparent 39%), linear-gradient(180deg, color-mix(in oklch, var(--color-primary) 40%, var(--color-background)), var(--color-ink))",
};

type BookCoverProps = {
  title: string;
  author: string;
  style: CoverStyle;
  compact?: boolean;
};

export default function BookCover({ title, author, style, compact = false }: BookCoverProps) {
  return (
    <div
      role="img"
      aria-label={`Cover of ${title} by ${author}`}
      className={`relative isolate flex aspect-[2/3] w-full flex-col items-center overflow-hidden rounded-lg border border-border/60 px-4 py-7 text-center text-ink-foreground shadow-soft ${compact ? "max-w-[5.5rem]" : ""}`}
      style={{ background: coverBackgrounds[style] } as CSSProperties}
    >
      <span className="text-[0.42rem] uppercase tracking-[0.4em] text-ink-foreground/60">
        A StoryVoice audiobook
      </span>
      <span className={`relative z-10 mt-[22%] font-display font-medium uppercase leading-tight tracking-[0.24em] ${compact ? "text-[0.65rem]" : "text-xl sm:text-2xl"}`}>
        {title}
      </span>
      {style === "city" && (
        <svg viewBox="0 0 240 110" className="absolute bottom-[18%] w-full text-primary/50" aria-hidden="true">
          <path fill="currentColor" d="M0 110V76h14V58h11v52h8V71h16V45h9v65h12V60h14V28h11v82h8V52h17V16h12v94h9V67h17V42h13v68h12V53h14v57h18V70h15v40Z" />
        </svg>
      )}
      {style === "signal" && (
        <svg viewBox="0 0 240 120" className="absolute bottom-[25%] w-full text-primary/50" aria-hidden="true">
          <path d="M0 68c25 0 25-35 50-35s25 56 50 56 25-73 50-73 25 46 50 46 25-14 40-14" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 79c25 0 25-35 50-35s25 56 50 56 25-73 50-73 25 46 50 46 25-14 40-14" fill="none" stroke="currentColor" strokeWidth="1" opacity=".45" />
        </svg>
      )}
      {style === "horizon" && (
        <span className="absolute bottom-[17%] size-[52%] rounded-full border-[1.5rem] border-primary/25" aria-hidden="true" />
      )}
      <span className={`absolute bottom-[7%] z-10 text-[0.55rem] uppercase tracking-[0.45em] text-ink-foreground/70 ${compact ? "text-[0.38rem]" : ""}`}>
        {author}
      </span>
      <span className="absolute inset-x-0 bottom-0 h-[23%] bg-ink/25" aria-hidden="true" />
    </div>
  );
}
