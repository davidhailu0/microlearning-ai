"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Layers,
  Loader2,
  PartyPopper,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CheckpointReview } from "@/lib/types";

type Result = {
  correct: boolean;
  correctOptionId: string | null;
  explanation: string;
  points: number;
};

const LETTERS = ["A", "B", "C", "D"];

export function CheckpointReviewDeck({ review }: { review: CheckpointReview }) {
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [correct, setCorrect] = React.useState(0);
  const [earned, setEarned] = React.useState(0);
  const [answered, setAnswered] = React.useState(0);
  const savedRef = React.useRef(review.completed);

  const question = review.questions[index];
  const finished = index >= review.questions.length;

  React.useEffect(() => {
    if (!finished || savedRef.current || review.questions.length === 0) return;
    savedRef.current = true;
    void fetch(`/api/courses/${review.courseId}/review/${review.index}/submit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ score: correct, total: review.questions.length }),
    }).catch(() => {
      /* the review remains usable even if the save request fails */
    });
  }, [finished, correct, review.courseId, review.index, review.questions.length]);

  async function submit() {
    if (!question || !selected || pending || result) return;
    setPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/quizzes/${question.id}/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ optionId: selected, questionId: question.questionId }),
      });
      const payload = (await response.json()) as Result & { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "That answer didn't go through.");
        return;
      }

      setResult(payload);
      setAnswered((count) => count + 1);
      if (payload.correct) {
        setCorrect((count) => count + 1);
        setEarned((points) => points + payload.points);
      }
    } catch {
      setError("Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  function next() {
    setIndex((current) => current + 1);
    setSelected(null);
    setResult(null);
    setError(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setResult(null);
    setError(null);
    setCorrect(0);
    setEarned(0);
    setAnswered(0);
    savedRef.current = false;
  }

  if (review.questions.length === 0) {
    return (
      <div className="rounded-xl border border-border/70 bg-card p-6">
        <p className="text-sm font-semibold">No review questions yet</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
          This checkpoint needs questions from its lessons before it can run.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href={`/course/${review.courseId}`}>Back to course</Link>
        </Button>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((correct / review.questions.length) * 100);
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-border/70 bg-card p-6 text-center sm:p-8">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <PartyPopper className="size-6" />
          </span>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Checkpoint {review.index} complete
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            {correct} of {review.questions.length} correct
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {percent >= 80
              ? "Strong recall. These lessons are sticking."
              : percent >= 60
                ? "A solid pass. Reread the lessons behind the misses, then run this checkpoint again."
                : "This block needs another pass. Revisit the missed lessons before moving on."}
          </p>
          <div className="mx-auto mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/80 transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          {review.bestScore != null && review.bestTotal != null ? (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Best recorded: {review.bestScore}/{review.bestTotal}
            </p>
          ) : null}
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <Button asChild>
              <Link href={`/course/${review.courseId}`}>
                Back to course
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" onClick={restart}>
              <RotateCcw className="size-4" />
              Review again
            </Button>
          </div>
        </div>

        <section className="mt-6 rounded-xl border border-border/70 bg-card p-5">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Sparkles className="size-3.5" />
            Key ideas from{" "}
            {review.fromLesson === review.toLesson
              ? `lesson ${review.fromLesson}`
              : `lessons ${review.fromLesson}–${review.toLesson}`}
          </p>
          <ul className="mt-3 space-y-4">
            {review.lessons.map((lesson) => (
              <li key={lesson.id} className="border-l-2 border-border pl-3">
                <Link
                  href={`/lesson/${lesson.id}`}
                  className="text-[13px] font-medium leading-snug underline-offset-2 hover:underline"
                >
                  {lesson.position}. {lesson.title}
                </Link>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground text-pretty">
                  {lesson.takeaway}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          {answered} answered · +{earned} XP earned from correct answers
        </p>
      </div>
    );
  }

  const isWrong = Boolean(result) && Boolean(selected) && !result?.correct;

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="size-3.5" />
          Question {index + 1} of {review.questions.length}
        </span>
        <span className="tabular-nums">
          {correct} correct · {Math.round((index / review.questions.length) * 100)}%
        </span>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground/80 transition-[width] duration-300"
          style={{ width: `${(index / review.questions.length) * 100}%` }}
        />
      </div>

      <section className="mt-5 rounded-xl border border-border/70 bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Lesson {question.lessonPosition} · {question.lessonTitle}
          </p>
          <span className="text-[10px] text-muted-foreground">+{question.points} XP</span>
        </div>

        <h2 className="mt-2 text-[17px] font-medium leading-snug text-pretty">
          {question.question}
        </h2>

        <div className="mt-4 space-y-2">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected === option.id;
            const isAnswer = result?.correctOptionId === option.id;
            const isWrongPick = isWrong && isSelected;

            return (
              <button
                key={option.id}
                type="button"
                disabled={Boolean(result)}
                onClick={() => setSelected(option.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-[13.5px] transition-colors",
                  "disabled:cursor-default",
                  !result && "hover:border-foreground/25 hover:bg-muted/40",
                  isAnswer
                    ? "border-emerald-300 bg-emerald-50/70 dark:border-emerald-500/40 dark:bg-emerald-500/10"
                    : isWrongPick
                      ? "border-destructive/40 bg-destructive/5"
                      : isSelected
                        ? "border-foreground/40 bg-muted/50"
                        : "border-border/70",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-md border text-[10px] font-semibold",
                    isAnswer
                      ? "border-transparent bg-emerald-600 text-white"
                      : isWrongPick
                        ? "border-transparent bg-destructive text-white"
                        : isSelected
                          ? "border-transparent bg-foreground text-background"
                          : "border-border text-muted-foreground",
                  )}
                >
                  {isAnswer ? (
                    <Check className="size-3.5" />
                  ) : isWrongPick ? (
                    <X className="size-3.5" />
                  ) : (
                    LETTERS[optionIndex] ?? optionIndex + 1
                  )}
                </span>
                <span className="flex-1">{option.label}</span>
              </button>
            );
          })}
        </div>

        {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

        {result ? (
          <div
            className={cn(
              "mt-4 flex gap-2.5 rounded-lg p-3",
              result.correct
                ? "bg-emerald-50 text-emerald-950 dark:bg-emerald-500/10 dark:text-emerald-100"
                : "bg-muted/60 text-foreground",
            )}
          >
            <Sparkles className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-semibold">
                {result.correct ? `Correct — +${result.points} XP` : "Not quite"}
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed opacity-80">
                {result.explanation}
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            {result ? "Read the explanation before moving on." : "One answer. No timer."}
          </p>
          {result ? (
            <Button size="sm" onClick={next}>
              {index + 1 === review.questions.length ? "Finish review" : "Next question"}
              <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button size="sm" onClick={() => void submit()} disabled={!selected || pending}>
              {pending ? <Loader2 className="size-3.5 animate-spin" /> : null}
              Check answer
            </Button>
          )}
        </div>
      </section>

      <p className="mt-4 text-center text-[10px] text-muted-foreground">
        {review.questions.length} questions · {review.lessons.length} lessons in this checkpoint
      </p>
    </div>
  );
}
