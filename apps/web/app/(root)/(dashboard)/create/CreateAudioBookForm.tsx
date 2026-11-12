"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, FileText, LoaderCircle, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FormError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ChapterSelection from "@/feature/create-audio-book/components/ChapterSelection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useCreateAudioBook from "@/feature/create-audio-book/hooks/use-create-audio-book";
import useGetAudioBook from "@/feature/create-audio-book/hooks/use-get-audio-book";
import type {
  CreatedAudioBook,
} from "@/feature/create-audio-book/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const createAudioBookSchema = z.object({
  file: z
    .custom<File | null>()
    .refine((value) => value instanceof File, "Please choose a PDF file.")
    .refine(
      (value) => value instanceof File && value.type === "application/pdf",
      "Please choose a PDF file.",
    )
    .refine(
      (value) => value instanceof File && value.size <= MAX_FILE_SIZE,
      "Your PDF must be 10MB or smaller.",
    ),
  language: z.enum([
    "English",
    "Spanish",
    "French",
    "Bangla",
    "Urdu",
    "Hindi",
    "Arabic",
  ]),
  style: z.enum(["Cinematic", "Classic", "Calm", "Joyful", "Documentary"]),
  pacing: z.enum(["Balanced", "Relaxed", "Energetic"]),
  instructions: z
    .string()
    .max(500, "Instructions must be 500 characters or fewer."),
});

type CreateAudioBookFormInput = z.input<typeof createAudioBookSchema>;
export type CreateAudioBookFormValues = z.output<typeof createAudioBookSchema>;

type CreateAudioBookFormProps = {
  initialBookId?: string;
};

export default function CreateAudioBookForm({
  initialBookId,
}: CreateAudioBookFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [createdBook, setCreatedBook] = useState<CreatedAudioBook | null>(null);
  const [isLoadingBook, setIsLoadingBook] = useState(Boolean(initialBookId));
  const [bookLoadError, setBookLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [selectedChapterIds, setSelectedChapterIds] = useState<number[]>([]);
  const [confirmedChapterIds, setConfirmedChapterIds] = useState<number[] | null>(
    null,
  );
  const { createAudioBook } = useCreateAudioBook();
  const { getAudioBook } = useGetAudioBook();
  const form = useForm<
    CreateAudioBookFormInput,
    unknown,
    CreateAudioBookFormValues
  >({
    resolver: zodResolver(createAudioBookSchema),
    defaultValues: {
      file: null,
      language: "English",
      style: "Cinematic",
      pacing: "Balanced",
      instructions: "",
    },
  });

  useEffect(() => {
    if (!initialBookId) return;

    const bookId = Number(initialBookId);
    if (!Number.isSafeInteger(bookId) || bookId <= 0) {
      setBookLoadError("The book ID in this URL is invalid.");
      setIsLoadingBook(false);
      return;
    }

    const controller = new AbortController();
    setIsLoadingBook(true);
    setBookLoadError(null);

    getAudioBook(bookId, controller.signal)
      .then((response) => {
        if (response.code !== 200) {
          throw new Error(response.message || "Unable to load this audiobook.");
        }

        setCreatedBook(response.data);
        setSelectedChapterIds(response.data.chapters.map((chapter) => chapter.id));
        setConfirmedChapterIds(null);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setBookLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load this audiobook.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingBook(false);
      });

    return () => controller.abort();
  }, [getAudioBook, initialBookId, loadAttempt]);

  function startNewBook() {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("bookId");
    window.history.replaceState(null, "", currentUrl);
    setCreatedBook(null);
    setBookLoadError(null);
    setIsLoadingBook(false);
  }

  function selectFile(nextFile: File | undefined) {
    if (!nextFile) return;
    setFile(nextFile);
    form.setValue("file", nextFile, { shouldValidate: true });
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }

  async function handleSubmit(values: CreateAudioBookFormValues) {
    if (!(values.file instanceof File)) return;
    try {
      const formData = new FormData();

      formData.append("file", values.file);
      formData.append("language", values.language);
      formData.append("style", values.style);
      formData.append("pacing", values.pacing);
      formData.append("instructions", values.instructions);
      const response = await createAudioBook(formData);
      if (response.code !== 200) {
        form.setError("root.server", {
          message: response.message || "Unable to create your audiobook.",
        });
        return;
      }

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("bookId", String(response.data.book_id));
      window.history.replaceState(null, "", currentUrl);

      setCreatedBook(response.data);
      setSelectedChapterIds(response.data.chapters.map((chapter) => chapter.id));
      setConfirmedChapterIds(null);
    } catch {
      form.setError("root.server", {
        message: "Something went wrong while creating your audiobook.",
      });
    }
  }

  return (
    <main
      className={
        createdBook || isLoadingBook || bookLoadError
          ? "h-[calc(100svh-5.5rem)] overflow-hidden"
          : undefined
      }
    >
      <form
        hidden={createdBook !== null || isLoadingBook || bookLoadError !== null}
        className="mx-auto max-w-3xl px-6 py-9 md:px-9"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <label
          className={`flex min-h-52  cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"}`}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            if (event.currentTarget === event.target) setIsDragging(false);
          }}
          onDrop={handleDrop}
        >
          <Input
            aria-label="book input"
            ref={inputRef}
            className="sr-only w-fit"
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => selectFile(event.target.files?.[0])}
          />
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
            {file ? <FileText /> : <CloudUpload />}
          </span>
          <span className="mt-4 max-w-full truncate font-display text-2xl font-semibold">
            {file ? file.name : "Drop your PDF here"}
          </span>
          <span className="mt-1 text-sm font-medium text-primary">
            or browse files
          </span>
          <span className="mt-2 text-xs text-muted-foreground">
            PDF up to 10MB
          </span>
        </label>

        <section className="mt-9 border-t border-border pt-8">
          <h2 className="font-display text-2xl font-semibold">
            Customize your audiobook
          </h2>
          <FieldGroup className="mt-5 min-w-0 gap-5 md:grid-cols-3 md:gap-4">
            <Controller
              control={form.control}
              name="language"
              render={({ field, fieldState }) => (
                <Field className="min-w-0">
                  <FieldLabel htmlFor="language">Language</FieldLabel>
                  <Select
                    aria-label="language"
                    className="w-full min-w-0"
                    {...field}
                  >
                    <SelectTrigger id="language" className="min-w-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem id="English">English</SelectItem>
                      <SelectItem id="Bangla">Bangla</SelectItem>
                      <SelectItem id="Hindi">Hindi</SelectItem>
                      <SelectItem id="Urdu">Urdu</SelectItem>
                      <SelectItem id="Arabic">Arabic</SelectItem>
                      <SelectItem id="Spanish">Spanish</SelectItem>
                      <SelectItem id="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="style"
              render={({ field, fieldState }) => (
                <Field className="min-w-0">
                  <FieldLabel htmlFor="style">Storytelling style</FieldLabel>
                  <Select
                    aria-label="Storytelling style"
                    className="w-full min-w-0"
                    {...field}
                  >
                    <SelectTrigger id="style" className="min-w-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem id="Clasic">Clasic</SelectItem>
                      <SelectItem id="Cinematic">Cinematic</SelectItem>
                      <SelectItem id="Calm" value="Calm">
                        Calm
                      </SelectItem>
                      <SelectItem id="Playful">Playful</SelectItem>
                      <SelectItem id="Documentary">Documentary</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="pacing"
              render={({ field, fieldState }) => (
                <Field className="min-w-0">
                  <FieldLabel htmlFor="pacing">Pacing</FieldLabel>
                  <Select
                    aria-label="Pacing"
                    className="w-full min-w-0"
                    {...field}
                  >
                    <SelectTrigger id="pacing" className="min-w-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem id="Balanced">Balanced</SelectItem>
                      <SelectItem id="Relaxed">Relaxed</SelectItem>
                      <SelectItem id="Energetic">Energetic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </FieldGroup>
          <Field className="mt-5">
            <FieldLabel htmlFor="instructions">
              Anything you want to change? (optional)
            </FieldLabel>
            <Textarea
              aria-label="instruction"
              id="instructions"
              rows={10}
              className="h-24 min-h-32 max-h-32 resize-none rounded-lg bg-card"
              placeholder="e.g. make the narrator warmer, give the detective a dry humour, shorten the opening"
              {...form.register("instructions")}
            />
            <FieldError>
              {form.formState.errors.instructions?.message}
            </FieldError>
          </Field>
        </section>

        <FormError className="mt-4">
          {form.formState.errors.root?.server?.message}
        </FormError>

        <div className="mt-8 flex flex-col items-stretch justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
          <Button
            type="submit"
            className="ml-auto"
            isDisabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <LoaderCircle className="animate-spin" />
            ) : null}
            {form.formState.isSubmitting ? "Creating..." : "Continue"}
          </Button>
        </div>
      </form>
      {isLoadingBook ? (
        <div
          className="flex h-full min-h-64 items-center justify-center gap-3 text-sm text-muted-foreground"
          role="status"
        >
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          Loading audiobook chapters...
        </div>
      ) : null}
      {bookLoadError ? (
        <div
          className="mx-auto flex h-full min-h-64 max-w-xl flex-col items-center justify-center gap-4 px-6 text-center"
          role="alert"
        >
          <p className="text-sm text-destructive">{bookLoadError}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {initialBookId ? (
              <Button
                type="button"
                variant="outline"
                onPress={() => setLoadAttempt((attempt) => attempt + 1)}
              >
                Try again
              </Button>
            ) : null}
            <Button type="button" onPress={startNewBook}>
              Back to upload
            </Button>
          </div>
        </div>
      ) : null}
      {createdBook ? (
        <ChapterSelection
          book={createdBook}
          selectedChapterIds={selectedChapterIds}
          confirmedChapterIds={confirmedChapterIds}
          onSelectionChange={(chapterIds) => {
            setSelectedChapterIds(chapterIds);
            setConfirmedChapterIds(null);
          }}
          onConfirm={setConfirmedChapterIds}
        />
      ) : null}
    </main>
  );
}
