"use client";

import * as React from "react";
import { Headphones, Loader2, Pause, Play } from "lucide-react";

type AudioStatus = "none" | "queued" | "generating" | "ready" | "failed";

const MESSAGES: Record<Exclude<AudioStatus, "ready">, string> = {
  none: "No narration for this lesson yet",
  queued: "Narration queued",
  generating: "Recording narration…",
  failed: "Narration unavailable",
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  title,
  status,
}: {
  src: string | null;
  title: string;
  status: AudioStatus;
}) {
  const ref = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [lastSrc, setLastSrc] = React.useState(src);

  // Adjust state while rendering when the lesson changes; an effect would
  // cause a second render pass and a flash of the previous track's time.
  if (lastSrc !== src) {
    setLastSrc(src);
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
  }

  if (!src) {
    const pending = status === "queued" || status === "generating";
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/20 px-3.5 py-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted">
          {pending ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <Headphones className="size-4 text-muted-foreground" />
          )}
        </span>
        <p className="text-xs text-muted-foreground">
          {MESSAGES[status === "ready" ? "none" : status]}
          {!pending && " — read it instead, it's a three-minute lesson."}
        </p>
      </div>
    );
  }

  async function toggle() {
    const audio = ref.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-2.5">
      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />

      <button
        type="button"
        onClick={() => void toggle()}
        aria-label={playing ? "Pause narration" : "Play narration"}
        className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-background transition-transform hover:scale-105 active:scale-95"
      >
        {playing ? (
          <Pause className="size-3.5" />
        ) : (
          <Play className="size-3.5 translate-x-px" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate text-[11px] font-medium text-muted-foreground">
            Listen · {title}
          </span>
          <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
            {formatTime(current)} / {formatTime(duration)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(current, duration || 0)}
          onChange={(event) => {
            const audio = ref.current;
            if (!audio) return;
            audio.currentTime = Number(event.target.value);
            setCurrent(Number(event.target.value));
          }}
          aria-label="Seek narration"
          className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
        />
      </div>
    </div>
  );
}
