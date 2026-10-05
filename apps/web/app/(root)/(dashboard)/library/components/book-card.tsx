import { Check, Heart, LoaderCircle, Play } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import type { LibraryBook } from "../library-data";
import BookCover from "./book-cover";

type BookCardProps = {
  book: LibraryBook;
  onFavoriteChange: (bookId: string) => void;
};

export default function BookCard({ book, onFavoriteChange }: BookCardProps) {
  return (
    <article className="min-w-0">
      <div className="group relative">
        <BookCover title={book.title} author={book.author} style={book.coverStyle} />
        {book.status === "processing" && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/95 px-2.5 py-1 text-xs font-medium shadow-soft">
            <LoaderCircle size={13} className="animate-spin" aria-hidden="true" /> Processing
          </span>
        )}
        <Button
          variant="secondary"
          size="icon-sm"
          onPress={() => onFavoriteChange(book.id)}
          aria-label={book.favorite ? `Remove ${book.title} from favorites` : `Add ${book.title} to favorites`}
          aria-pressed={book.favorite}
          className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Heart size={16} fill={book.favorite ? "currentColor" : "none"} />
        </Button>
      </div>

      <div className="mt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{book.title}</h3>
            <p className="truncate text-sm text-muted-foreground">{book.author}</p>
          </div>
          {book.favorite && <Heart size={15} className="mt-0.5 shrink-0 text-primary" fill="currentColor" aria-label="Favorite" />}
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${book.title} listening progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={book.progress}>
          <div className="h-full rounded-full bg-primary" style={{ width: `${book.progress}%` }} />
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{book.progress}% complete</span>
          <span>{book.timeRemaining}</span>
        </div>

        <details className="group/details mt-3">
          <summary className="cursor-pointer list-none text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            View details
          </summary>
          <div className="mt-2 rounded-lg border bg-card p-3 text-sm">
            <p className="text-muted-foreground">{book.currentChapter}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              {book.status === "ready" ? <Check size={13} /> : <LoaderCircle size={13} className="animate-spin" />}
              {book.status === "ready" ? "Ready to listen" : "Audio is processing"}
            </p>
          </div>
        </details>
        {book.status === "ready" && (
          <LinkButton href={`/player?book=${book.id}`} size="sm" className="mt-3 w-full">
            <Play fill="currentColor" /> Resume
          </LinkButton>
        )}
      </div>
    </article>
  );
}
