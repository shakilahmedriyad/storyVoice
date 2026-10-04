"use client";

import { AudioLines } from "lucide-react";
import { getActiveCueIndex, type Chapter } from "../player-data";

type TranscriptPanelProps = {
  chapter: Chapter;
  currentTime: number;
  onSeek: (time: number) => void;
};

export default function TranscriptPanel({
  chapter,
  currentTime,
  onSeek,
}: TranscriptPanelProps) {
  const cues = chapter.cues ?? [];
  const activeCueIndex = getActiveCueIndex(cues, currentTime);

  return (
    <section aria-labelledby="transcript-title" className="border-t pt-6">
      <div className="flex items-center justify-between gap-4">
        <h2 id="transcript-title" className="text-base font-semibold">
          Transcript
        </h2>
        {cues.length > 0 && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <AudioLines size={14} aria-hidden="true" /> Synced to audio
          </span>
        )}
      </div>

      {cues.length > 0 ? (
        <div className="mt-4 space-y-3 leading-7">
          {cues.map((cue, index) => (
            <button
              key={`${cue.start}-${index}`}
              type="button"
              onClick={() => onSeek(cue.start)}
              aria-current={index === activeCueIndex ? "true" : undefined}
              className={`block w-full rounded-md text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                index === activeCueIndex
                  ? "bg-primary/10 px-2 py-1 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cue.text}
            </button>
          ))}
        </div>
      ) : chapter.transcript.length > 0 ? (
        <div className="mt-4 space-y-3 leading-7">
          {chapter.transcript.map((line) => (
            <p key={line} className="text-muted-foreground">
              {line}
            </p>
          ))}
          <p className="text-xs text-muted-foreground">
            Word highlighting needs timestamped transcript cues from the audio
            generation step.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          A transcript is not available for this chapter yet.
        </p>
      )}
    </section>
  );
}
