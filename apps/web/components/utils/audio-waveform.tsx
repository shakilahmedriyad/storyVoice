import { cn } from "@/lib/utils";

const heights = [
  30, 55, 80, 45, 95, 60, 35, 70, 100, 50, 40, 85, 65, 30, 75, 55, 90, 45, 60,
  35, 80, 50, 70, 40, 95, 60, 30, 65, 85, 45, 55, 75, 35, 90, 50, 70, 40, 60,
  80, 30,
];

export default function AudioWaveform({
  playing = false,
  progress = 0,
  className,
  bars = heights.length,
}: {
  playing?: boolean;
  progress?: number;
  className?: string;
  bars?: number;
}) {
  const slice = heights.slice(0, bars);
  return (
    <div
      className={cn("flex h-12 items-center gap-0.75", className)}
      aria-hidden
    >
      {slice.map((h, i) => {
        const passed = (i / slice.length) * 100 <= progress;
        return (
          <span
            key={i}
            className={cn(
              "flex-1 rounded-full transition-colors",
              passed ? "bg-primary" : "bg-current opacity-25",
              playing && "wave-bar",
            )}
            style={{
              height: `${h}%`,
              animationDelay: `${(i % 10) * 90}ms`,
            }}
          />
        );
      })}
    </div>
  );
}
