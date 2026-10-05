export type BookStatus = "ready" | "processing";
export type CoverStyle = "city" | "signal" | "horizon";

export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  progress: number;
  timeRemaining: string;
  currentChapter: string;
  status: BookStatus;
  coverStyle: CoverStyle;
  favorite: boolean;
};

export const libraryBooks: LibraryBook[] = [
  {
    id: "silent-city",
    title: "The Silent City",
    author: "Elena Carter",
    progress: 42,
    timeRemaining: "4h 32m",
    currentChapter: "Chapter 7 — The Stranger",
    status: "ready",
    coverStyle: "city",
    favorite: true,
  },
  {
    id: "last-signal",
    title: "The Last Signal",
    author: "Marcus Reed",
    progress: 12,
    timeRemaining: "7h 18m",
    currentChapter: "Preparing chapter 3",
    status: "processing",
    coverStyle: "signal",
    favorite: false,
  },
  {
    id: "beyond-horizon",
    title: "Beyond the Horizon",
    author: "Ava Morgan",
    progress: 0,
    timeRemaining: "5h 41m",
    currentChapter: "Not started",
    status: "ready",
    coverStyle: "horizon",
    favorite: false,
  },
];
