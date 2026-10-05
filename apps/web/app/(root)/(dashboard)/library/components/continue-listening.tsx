import Link from "next/link";
import { Play } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import type { LibraryBook } from "../library-data";
import BookCover from "./book-cover";

type ContinueListeningProps = { book: LibraryBook };

export default function ContinueListening({ book }: ContinueListeningProps) {
  return (
    <section aria-labelledby="continue-listening-title" className="flex flex-wrap items-center gap-x-5 gap-y-4 border-b pb-7">
      <BookCover title={book.title} author={book.author} style={book.coverStyle} compact />
      <div className="min-w-0 flex-1 sm:max-w-md">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Continue listening
        </p>
        <h2 id="continue-listening-title" className="mt-1 truncate text-xl font-semibold">
          {book.title}
        </h2>
        <p className="truncate text-sm text-muted-foreground">
          {book.author} · {book.currentChapter}
        </p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${book.title} listening progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={book.progress}>
          <div className="h-full rounded-full bg-primary" style={{ width: `${book.progress}%` }} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <LinkButton href={`/player?book=${book.id}`} size="sm">
            <Play fill="currentColor" /> Resume
          </LinkButton>
          <Link href={`/player?book=${book.id}`} className="rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            View details
          </Link>
        </div>
      </div>
    </section>
  );
}
