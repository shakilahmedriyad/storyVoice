"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import BookCard from "./book-card";
import ContinueListening from "./continue-listening";
import { libraryBooks, type LibraryBook, type BookStatus } from "../library-data";

type BookFilter = "all" | BookStatus | "favorites";

const filters: { id: BookFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "processing", label: "Processing" },
  { id: "ready", label: "Ready" },
  { id: "favorites", label: "Favorites" },
];

export default function LibraryExperience() {
  const [books, setBooks] = useState(libraryBooks);
  const [filter, setFilter] = useState<BookFilter>("all");
  const [search, setSearch] = useState("");

  const continueBook = books.find((book) => book.id === "silent-city");
  const visibleBooks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return books.filter((book) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "favorites" ? book.favorite : book.status === filter);
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${book.title} ${book.author}`.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [books, filter, search]);

  function toggleFavorite(bookId: string) {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === bookId ? { ...book, favorite: !book.favorite } : book,
      ),
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10">
      {continueBook && <ContinueListening book={continueBook} />}

      <section aria-labelledby="all-books-title" className="pt-7">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 id="all-books-title" className="text-xl font-semibold">All books</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">Search books</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search books..."
                className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm shadow-soft outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-muted p-1" role="group" aria-label="Filter books">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={filter === item.id}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${filter === item.id ? "bg-accent text-accent-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {visibleBooks.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {visibleBooks.map((book: LibraryBook) => (
              <BookCard key={book.id} book={book} onFavoriteChange={toggleFavorite} />
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
            No books match your search and filter.
          </p>
        )}
      </section>
    </main>
  );
}
