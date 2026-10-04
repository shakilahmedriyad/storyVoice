export type TranscriptCue = {
  start: number;
  end: number;
  text: string;
};

export type Chapter = {
  id: string;
  title: string;
  duration: number;
  transcript: string[];
  cues?: TranscriptCue[];
};

export const book = {
  title: "The Silent City",
  author: "Elena Carter",
  chapters: [
    { id: "01", title: "The Beginning", duration: 763, transcript: [] },
    { id: "02", title: "Into the Fog", duration: 1101, transcript: [] },
    { id: "03", title: "The Stranger", duration: 1274, transcript: [] },
    { id: "04", title: "The Crossing", duration: 1012, transcript: [] },
    { id: "05", title: "Harbour Lights", duration: 848, transcript: [] },
    { id: "06", title: "Old Debts", duration: 1176, transcript: [] },
    {
      id: "07",
      title: "The Stranger Returns",
      duration: 2537,
      transcript: [
        "Emma stepped onto the landing and let the door fall shut behind her.",
        "The room suddenly became silent.",
        "Somewhere below, a tram bell rang twice and then thought better of it.",
        "“You came,” he said, without turning around.",
        "She did not answer. Answers, in this city, were currency.",
      ],
    },
    { id: "08", title: "Quiet Streets", duration: 1065, transcript: [] },
    { id: "09", title: "The Ledger", duration: 1323, transcript: [] },
    { id: "10", title: "A Name in Chalk", duration: 929, transcript: [] },
    { id: "11", title: "Under the Bridge", duration: 1211, transcript: [] },
  ] satisfies Chapter[],
};

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = Math.floor(seconds % 60);
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function getActiveCueIndex(cues: TranscriptCue[], time: number) {
  return cues.findIndex((cue) => time >= cue.start && time < cue.end);
}
