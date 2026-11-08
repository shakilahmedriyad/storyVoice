export type AudioBookChapter = {
  id: number;
  title: string;
};

export type CreatedAudioBook = {
  book_name: string;
  book_id: number;
  total_chapters: number;
  language: string;
  storytelling_style: string;
  pacing: string;
  chapters: AudioBookChapter[];
};

export type CreateAudioBookResponse = {
  message: string;
  code: number;
  data: CreatedAudioBook;
};
