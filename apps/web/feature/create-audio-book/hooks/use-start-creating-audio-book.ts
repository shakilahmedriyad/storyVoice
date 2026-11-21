export default function useStartCreatingAudioBook() {
  const startCreatingAudioBook = async (selected_chapters: number[]) => {
    const response = await fetch("/api/audio-book", {
      method: "POST",
      body: JSON.stringify({ selected_chapters }),
    });

    if (!response.ok) {
      throw new Error("Failed to create audio book");
    }

    return response.json();
  };

  return { startCreatingAudioBook };
}
