"use client";

import {
  BookOpen,
  FastForward,
  Gauge,
  Pause,
  Play,
  Rewind,
  SkipBack,
  SkipForward,
  Upload,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ChapterList from "./chapter-list";
import { book, formatTime, type Chapter } from "../player-data";
import TranscriptPanel from "./transcript-panel";

const playbackRates = [0.75, 1, 1.25, 1.5, 2];
const waveform = [12, 20, 30, 17, 36, 22, 14, 27, 39, 19, 15, 33, 25, 12, 29, 19, 36, 21, 14, 30, 23, 16, 39, 20, 13, 32, 17, 35, 23, 15, 28, 38, 18, 24, 14, 33, 19, 27, 12, 31, 23, 17, 36, 20, 29, 15, 34, 23, 14, 30, 18, 39, 22, 14, 26, 36, 17, 29, 12, 33, 24, 19, 37, 22, 14, 28, 18, 34, 20, 13, 31, 24];

type ChapterAudio = { url: string; name: string };

export default function PlayerExperience() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef(new Set<string>());
  const [activeChapter, setActiveChapter] = useState<Chapter>(book.chapters[6]!);
  const [chapterAudio, setChapterAudio] = useState<Record<string, ChapterAudio>>({});
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);

  const currentAudio = chapterAudio[activeChapter.id];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const activeIndex = useMemo(
    () => book.chapters.findIndex((chapter) => chapter.id === activeChapter.id),
    [activeChapter.id],
  );

  useEffect(() => () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.playbackRate = playbackRate;
  }, [volume, playbackRate, currentAudio]);

  function selectChapter(chapter: Chapter) {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setActiveChapter(chapter);
  }

  function selectRelativeChapter(offset: number) {
    const next = book.chapters[activeIndex + offset];
    if (next) selectChapter(next);
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !currentAudio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
    }
  }

  function skip(seconds: number) {
    const audio = audioRef.current;
    if (audio && duration > 0) audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.add(url);
    const previous = chapterAudio[activeChapter.id];
    if (previous) {
      URL.revokeObjectURL(previous.url);
      objectUrlsRef.current.delete(previous.url);
    }
    setChapterAudio((existing) => {
      return { ...existing, [activeChapter.id]: { url, name: file.name } };
    });
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    event.target.value = "";
  }

  function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
    const nextTime = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-9 px-5 py-7 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10 lg:px-10 lg:py-9">
      <section className="min-w-0" aria-label="Audio player">
        <div className="flex flex-wrap items-center gap-5 sm:gap-6">
          <div className="flex size-28 shrink-0 items-center justify-center rounded-xl border bg-muted text-muted-foreground shadow-soft sm:size-32">
            <BookOpen size={40} strokeWidth={1.4} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Chapter {activeChapter.id}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {activeChapter.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {book.title} · {book.author}
            </p>
            {currentAudio ? (
              <p className="mt-2 truncate text-xs text-muted-foreground" title={currentAudio.name}>
                {currentAudio.name}
              </p>
            ) : (
              <div className="mt-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-label={`Choose audio for chapter ${activeChapter.id}`}
                />
                <Button variant="outline" size="sm" onPress={() => fileInputRef.current?.click()}>
                  <Upload /> Load chapter audio
                </Button>
              </div>
            )}
          </div>
        </div>

        <audio
          ref={audioRef}
          src={currentAudio?.url}
          preload="metadata"
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onDurationChange={(event) => setDuration(event.currentTarget.duration)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onEmptied={() => {
            setCurrentTime(0);
            setDuration(0);
            setIsPlaying(false);
          }}
          className="sr-only"
          aria-label={`Audio for ${activeChapter.title}`}
        />

        <div className="mt-8" aria-label="Audio waveform and progress">
          <div className="flex h-12 items-center justify-between gap-[3px] overflow-hidden" aria-hidden="true">
            {waveform.map((height, index) => (
              <span
                key={index}
                className={`min-w-1 flex-1 rounded-full ${duration > 0 && index / waveform.length <= progress / 100 ? "bg-primary" : "bg-muted-foreground/35"}`}
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
          <label className="sr-only" htmlFor="audio-progress">Playback position</label>
          <input
            id="audio-progress"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={duration ? Math.min(currentTime, duration) : 0}
            onChange={handleSeek}
            disabled={!currentAudio || !duration}
            className="mt-3 h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? `-${formatTime(Math.max(0, duration - currentTime))}` : formatTime(activeChapter.duration)}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 sm:gap-5">
          <Button variant="ghost" size="icon" onPress={() => selectRelativeChapter(-1)} isDisabled={activeIndex <= 0} aria-label="Previous chapter">
            <SkipBack />
          </Button>
          <Button variant="ghost" size="icon" onPress={() => skip(-15)} isDisabled={!currentAudio} aria-label="Back 15 seconds">
            <Rewind />
          </Button>
          <Button
            size="icon-lg"
            className="size-16 rounded-full shadow-soft"
            onPress={togglePlayback}
            isDisabled={!currentAudio}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause fill="currentColor" /> : <Play className="ml-0.5" fill="currentColor" />}
          </Button>
          <Button variant="ghost" size="icon" onPress={() => skip(15)} isDisabled={!currentAudio} aria-label="Forward 15 seconds">
            <FastForward />
          </Button>
          <Button variant="ghost" size="icon" onPress={() => selectRelativeChapter(1)} isDisabled={activeIndex >= book.chapters.length - 1} aria-label="Next chapter">
            <SkipForward />
          </Button>
        </div>

        <div className="mt-7 grid gap-4 border-y py-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex flex-wrap items-center gap-1.5">
            <Gauge size={17} className="mr-2 text-muted-foreground" aria-hidden="true" />
            {playbackRates.map((rate) => (
              <Button
                key={rate}
                variant={playbackRate === rate ? "default" : "ghost"}
                size="xs"
                aria-pressed={playbackRate === rate}
                onPress={() => setPlaybackRate(rate)}
              >
                {rate}×
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:w-48">
            <Button variant="ghost" size="icon-xs" aria-label={volume === 0 ? "Muted" : "Volume"} onPress={() => setVolume(volume === 0 ? 0.8 : 0)}>
              {volume === 0 ? <VolumeX /> : <Volume2 />}
            </Button>
            <label className="sr-only" htmlFor="audio-volume">Volume</label>
            <input
              id="audio-volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-primary"
            />
          </div>
        </div>

        <div className="mt-6">
          <TranscriptPanel
            chapter={activeChapter}
            currentTime={currentTime}
            onSeek={(time) => {
              if (audioRef.current && duration > 0) audioRef.current.currentTime = time;
              setCurrentTime(time);
            }}
          />
        </div>
      </section>

      <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
        <ChapterList
          chapters={book.chapters}
          activeChapterId={activeChapter.id}
          onSelect={selectChapter}
        />
        <details className="group border-b py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium marker:hidden">
            Book details
            <span aria-hidden="true" className="text-muted-foreground transition-transform group-open:rotate-180">⌄</span>
          </summary>
          <p className="mt-3 text-sm text-muted-foreground">
            {book.title} by {book.author}. Load a local audio file for each chapter to listen from this page.
          </p>
        </details>
      </aside>
    </main>
  );
}
