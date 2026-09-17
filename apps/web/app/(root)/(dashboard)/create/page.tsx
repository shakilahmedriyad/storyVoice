"use client";

import { useState } from "react";
import { Check, CloudUpload, FileText } from "lucide-react";
import NavHeader from "./navheader";
import { Button } from "@/components/ui/button";
import useCreateAudioBook from "@/feature/create-audio-book/hooks/use-create-audio-book";

const styles = [
  { name: "Classic", description: "Warm and traditional storytelling" },
  { name: "Cinematic", description: "Expressive and dramatic narration" },
  { name: "Calm", description: "Relaxed and conversational" },
];

export default function CreatePage() {
  const [selectedStyle, setSelectedStyle] = useState("Cinematic");
  const [fileName, setFileName] = useState<string | null>(null);
  const { createAudioBook } = useCreateAudioBook();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    setFileName(file?.name ?? null);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("style", selectedStyle);

      try {
        const response = await createAudioBook(formData);
        console.log("Audio book created successfully:", response);
      } catch (error) {
        console.error("Error creating audio book:", error);
      }
    }
  };

  return (
    <div>
      <NavHeader />
      <div className="mx-auto max-w-3xl px-6 py-9 md:px-9">
        <label className="flex min-h-60 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 text-center transition-colors hover:border-primary hover:bg-primary/5">
          <input
            className="sr-only"
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
          />
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
            {fileName ? <FileText /> : <CloudUpload />}
          </span>
          <span className="mt-4 font-display text-2xl font-semibold">
            {fileName ?? "Drop your PDF here"}
          </span>
          <span className="mt-1 text-sm font-medium text-primary">
            or browse files
          </span>
          <span className="mt-2 text-xs text-muted-foreground">
            PDF up to 20MB
          </span>
        </label>
        <section className="mt-9">
          <h2 className="font-display text-2xl font-semibold">
            Choose a narration style
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {styles.map((style) => {
              const isSelected = selectedStyle === style.name;
              return (
                <button
                  key={style.name}
                  onClick={() => setSelectedStyle(style.name)}
                  className={`relative rounded-xl border p-4 text-left transition-colors ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/50"}`}
                >
                  <span className="font-semibold">{style.name}</span>
                  {isSelected && (
                    <Check
                      size={16}
                      className="absolute right-4 top-4 text-primary"
                    />
                  )}
                  <span className="mt-2 block text-sm leading-5 text-muted-foreground">
                    {style.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <div className="mt-9 flex items-center justify-between gap-4 border-t pt-5">
          <p className="text-sm text-muted-foreground">
            Voices are matched automatically and can be changed later.
          </p>
          <Button isDisabled={!fileName}>Continue</Button>
        </div>
      </div>
    </div>
  );
}
