"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Layers, Loader2, PartyPopper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DueCard } from "@/lib/types";

type Grade = "hard" | "good" | "easy";

const GRADE_ORDER: Grade[] = ["hard", "good", "easy"];

export function ReviewDeck({ cards }: { cards: DueCard[] }) {
  const router = useRouter();
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [pending, setPending] = React.useState<Grade | null>(null);
  const [reviewed, setReviewed] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const card = cards[index];
  const finished = index >= cards.length;

  const grade = React.useCallback(
    async (value: Grade) => {
      if (!card || pending) return;
      setPending(value);
      setError(null);

      try {
        const response = await fetch("/api/review", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ flashcardId: card.flashcardId, rating: value }),
        });

        if (!response.ok) throw new Error("Request failed");

        setReviewed((count) => count + 1);
        setFlipped(false);
        setIndex((current) => current + 1);
        router.refresh();
      } catch {
        setError("Couldn't save that review. Try again.");
      } finally {
        setPending(null);
      }
    },
    [card, pending, router],
  );

  React.useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && event.target.tagName === "INPUT") return;

      if (event.code === "Space" || event.key === "Enter") {
        if (!flipped) {
          event.preventDefault();
          setFlipped(true);
        }
        return;
      }

      if (!flipped) return;
      const map: Record<string, Grade> = {
        "1": "hard",
        h: "hard",
        "2": "good",
        g: "good",
        "3": "easy",
        e: "easy",
      };
      const value = map[event.key.toLowerCase()];
      if (value) {
        event.preventDefault();
        void grade(value);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, grade]);

  if (finished) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border/70 bg-card p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <PartyPopper className="size-6" />
        </span>
        <h2 className="mt-4 text-xl font-semibold tracking-tight">
          {reviewed === 0 ? "Nothing to review yet" : "Queue cleared"}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {reviewed === 0
            ? "Finish a lesson and its flashcards will appear here on schedule."
            : `${reviewed} card${reviewed === 1 ? "" : "s"} reviewed · +${reviewed * 8} XP. The schedule adjusted itself — come back when the next card is due.`}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              Back to Today
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="size-3.5" />
          Card {index + 1} of {cards.length}
        </span>
        <span className="tabular-nums">{Math.round((index / cards.length) * 100)}%</span>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground/80 transition-[width] duration-300"
          style={{ width: `${(index / cards.length) * 100}%` }}
        />
      </div>

      <div className="perspective-1200 mt-6">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setFlipped((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              setFlipped((value) => !value);
            }
          }}
          aria-label={flipped ? "Hide answer" : "Reveal answer"}
          className={cn(
            "preserve-3d relative min-h-[300px] w-full cursor-pointer outline-none transition-transform duration-500 ease-out focus-visible:ring-2 focus-visible:ring-ring",
            flipped && "rotate-y-180",
          )}
        >
          {/* front */}
          <div className="backface-hidden absolute inset-0 flex flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {card.concept || card.courseTitle}
              </span>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                {card.state === "new" ? "New" : `${card.reps} reviews`}
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center py-6">
              <p className="text-center text-[20px] font-medium leading-snug tracking-tight text-balance sm:text-[23px]">
                {card.front}
              </p>
            </div>

            <p className="text-center text-[11px] text-muted-foreground">
              Tap or press space to reveal
            </p>
          </div>

          {/* back */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Answer
              </span>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {card.courseTitle}
              </span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-5">
              <p className="text-center text-[12px] leading-snug text-muted-foreground">
                {card.front}
              </p>
              <p className="text-center text-[18px] font-medium leading-relaxed text-balance sm:text-[20px]">
                {card.back}
              </p>
            </div>

            <p className="text-center text-[11px] text-muted-foreground">
              How well did you recall that?
            </p>
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-center text-xs text-destructive">{error}</p>}

      <div className="mt-5">
        {flipped ? (
          <div className="grid grid-cols-3 gap-2">
            {GRADE_ORDER.map((value) => {
              const meta = {
                hard: { label: "Hard", tone: "border-amber-300/70 hover:bg-amber-50 dark:border-amber-500/30 dark:hover:bg-amber-500/10" },
                good: { label: "Good", tone: "border-border/70 hover:bg-muted/60" },
                easy: { label: "Easy", tone: "border-emerald-300/70 hover:bg-emerald-50 dark:border-emerald-500/30 dark:hover:bg-emerald-500/10" },
              }[value];

              return (
                <button
                  key={value}
                  type="button"
                  disabled={pending !== null}
                  onClick={() => void grade(value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border bg-card px-2 py-2.5 transition-colors disabled:opacity-60",
                    meta.tone,
                  )}
                >
                  <span className="flex items-center gap-1 text-[13px] font-medium">
                    {pending === value && <Loader2 className="size-3 animate-spin" />}
                    {meta.label}
                  </span>
                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    {card.previews[value]}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <Button className="w-full" onClick={() => setFlipped(true)}>
            <Sparkles className="size-4" />
            Show answer
          </Button>
        )}
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
        <Check className="size-3" />
        {reviewed} reviewed · FSRS schedules the next appearance
      </p>
    </div>
  );
}
