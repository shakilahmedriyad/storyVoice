import { Check, ListMusic } from "lucide-react";
import type { Chapter } from "../player-data";
import { formatTime } from "../player-data";

type ChapterListProps = {
  chapters: Chapter[];
  activeChapterId: string;
  onSelect: (chapter: Chapter) => void;
};

export default function ChapterList({
  chapters,
  activeChapterId,
  onSelect,
}: ChapterListProps) {
  return (
    <section aria-labelledby="chapters-title">
      <h2 id="chapters-title" className="mb-3 flex items-center gap-2 font-semibold">
        <ListMusic size={18} className="text-muted-foreground" aria-hidden="true" />
        Chapters
      </h2>
      <ol className="max-h-[min(68vh,680px)] divide-y overflow-y-auto border-y">
        {chapters.map((chapter) => {
          const active = chapter.id === activeChapterId;
          return (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => onSelect(chapter)}
                aria-current={active ? "true" : undefined}
                className={`grid w-full grid-cols-[2rem_minmax(0,1fr)_auto_1rem] items-center gap-2 px-2 py-3 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                  active ? "bg-accent/60" : ""
                }`}
              >
                <span className={`text-xs ${active ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                  {chapter.id}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{chapter.title}</span>
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-muted">
                    <span
                      className={`block h-full rounded-full ${active ? "bg-primary" : "bg-transparent"}`}
                      style={{ width: active ? "24%" : "0%" }}
                    />
                  </span>
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {formatTime(chapter.duration)}
                </span>
                <span className="text-success" aria-hidden="true">
                  {Number(chapter.id) < Number(activeChapterId) && <Check size={15} />}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
