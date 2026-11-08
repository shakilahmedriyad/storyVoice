"use client";

import { Check, ListMusic } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CreatedAudioBook } from "@/feature/create-audio-book/types";

type ChapterSelectionProps = {
  book: CreatedAudioBook;
  selectedChapterIds: number[];
  confirmedChapterIds: number[] | null;
  onSelectionChange: (chapterIds: number[]) => void;
  onConfirm: (chapterIds: number[]) => void;
};

export default function ChapterSelection({
  book,
  selectedChapterIds,
  confirmedChapterIds,
  onSelectionChange,
  onConfirm,
}: ChapterSelectionProps) {
  const allSelected =
    book.chapters.length > 0 &&
    selectedChapterIds.length === book.chapters.length;
  const isConfirmed =
    confirmedChapterIds !== null &&
    confirmedChapterIds.length === selectedChapterIds.length &&
    confirmedChapterIds.every((id) => selectedChapterIds.includes(id));

  function toggleChapter(chapterId: number, checked: boolean) {
    const nextSelection = checked
      ? [...selectedChapterIds, chapterId]
      : selectedChapterIds.filter((id) => id !== chapterId);

    onSelectionChange(nextSelection);
  }

  function toggleAllChapters() {
    onSelectionChange(
      allSelected ? [] : book.chapters.map((chapter) => chapter.id),
    );
  }

  return (
    <section
      aria-labelledby="chapter-selection-title"
      className="chapter-selection-enter mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col px-4 py-4 sm:px-6 sm:py-6 md:px-9"
    >
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-primary/20 bg-muted/70 p-4 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              id="chapter-selection-title"
              className="flex items-center gap-2 font-display text-2xl font-semibold"
            >
              <ListMusic
                size={20}
                className="text-primary"
                aria-hidden="true"
              />
              Choose chapters
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select the chapters you want in your audiobook.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onPress={toggleAllChapters}
            isDisabled={book.chapters.length === 0}
          >
            {allSelected ? "Deselect all" : "Select all"}
          </Button>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
          <span className="truncate pr-4 font-medium text-foreground">
            {book.book_name}
          </span>
          <span className="shrink-0 tabular-nums">
            {selectedChapterIds.length} of {book.chapters.length} selected
          </span>
        </div>

        <ul className="mt-3 min-h-0 flex-1 divide-y overflow-y-auto overscroll-contain rounded-lg border bg-background/60">
          {book.chapters.map((chapter, index) => {
            const checked = selectedChapterIds.includes(chapter.id);

            return (
              <li key={chapter.id}>
                <label
                  className={`flex cursor-pointer items-start gap-3 border-l-2 px-4 py-3 transition-colors ${
                    checked
                      ? "border-l-primary/60 bg-primary/5 hover:bg-primary/10"
                      : "border-l-transparent hover:bg-accent/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 accent-primary"
                    checked={checked}
                    onChange={(event) =>
                      toggleChapter(chapter.id, event.currentTarget.checked)
                    }
                    aria-label={`Select chapter ${index + 1}: ${chapter.title}`}
                  />
                  <span className="min-w-0 flex-1 text-sm font-medium leading-6">
                    <span className="mr-2 text-xs tabular-nums text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {chapter.title}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-col items-stretch justify-between gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center">
          <p
            aria-live="polite"
            className="min-h-5 text-sm text-muted-foreground"
          >
            {isConfirmed ? (
              <span className="flex items-center gap-2 text-primary">
                <Check size={16} aria-hidden="true" />
                Selection confirmed locally.
              </span>
            ) : null}
          </p>
          <Button
            type="button"
            className="sm:ml-auto"
            isDisabled={selectedChapterIds.length === 0}
            onPress={() => onConfirm(selectedChapterIds)}
          >
            Confirm selection
          </Button>
        </div>
      </div>
    </section>
  );
}
