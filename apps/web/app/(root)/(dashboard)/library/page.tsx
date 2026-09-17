import { BookOpen, Clock3, MoreHorizontal, Play } from "lucide-react";
import NavHeader from "./navheader";
import { Button } from "@/components/ui/button";

const books = [
  { title: "The Silent City", author: "Elena Carter", progress: 68, time: "5h 42m left" },
  { title: "Letters from Winter", author: "Mara Ellison", progress: 24, time: "8h 16m left" },
];

export default function LibraryPage() {
  return (
    <div>
      <NavHeader />
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Your collection</p>
            <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight">Continue listening</h2>
          </div>
          <Button variant="outline" size="sm"><BookOpen /> Add a book</Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {books.map((book) => (
            <article key={book.title} className="surface p-5">
              <div className="flex gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-ink text-ink-foreground"><BookOpen size={24} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="truncate font-display text-2xl font-semibold">{book.title}</h3><p className="text-sm text-muted-foreground">{book.author}</p></div>
                    <Button variant="ghost" size="icon-sm" aria-label={`More options for ${book.title}`}><MoreHorizontal /></Button>
                  </div>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${book.progress}%` }} /></div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground"><span>{book.progress}% complete</span><span className="flex items-center gap-1"><Clock3 size={13} /> {book.time}</span></div>
                </div>
              </div>
              <Button className="mt-5 w-full" size="sm"><Play fill="currentColor" /> Resume listening</Button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}