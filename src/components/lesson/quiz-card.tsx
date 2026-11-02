"use client";

import * as React from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuizView } from "@/lib/types";

type Result = {
  correct: boolean;
  correctOptionId: string | null;
  explanation: string;
  points: number;
};

const LETTERS = ["A", "B", "C", "D"];

export function QuizCard({ quiz }: { quiz: QuizView }) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit() {
    if (!selected || pending) return;
    setPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ optionId: selected }),
      });
      const payload = (await response.json()) as Result & { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "That didn't go through.");
        return;
      }
      setResult(payload);
    } catch {
      setError("Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-xl border border-border/70 bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Check your understanding
        </p>
        <span className="text-[10px] text-muted-foreground">+{quiz.points} XP</span>
      </div>

      <h3 className="mt-2 text-[15px] font-medium leading-snug">{quiz.question}</h3>

      <div className="mt-4 space-y-2">
        {quiz.options.map((option, index) => {
          const isSelected = selected === option.id;
          const isCorrect = result?.correctOptionId === option.id;
          const isWrongPick = Boolean(result) && isSelected && !result?.correct;

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
                isCorrect
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
                  isCorrect
                    ? "border-transparent bg-emerald-600 text-white"
                    : isWrongPick
                      ? "border-transparent bg-destructive text-white"
                      : isSelected
                        ? "border-transparent bg-foreground text-background"
                        : "border-border text-muted-foreground",
                )}
              >
                {isCorrect ? (
                  <Check className="size-3.5" />
                ) : isWrongPick ? (
                  <X className="size-3.5" />
                ) : (
                  LETTERS[index] ?? index + 1
                )}
              </span>
              <span className="flex-1">{option.label}</span>
            </button>
          );
        })}
      </div>

      {!result ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          {error ? (
            <p className="text-xs text-destructive">{error}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              One answer. No timer.
            </p>
          )}
          <Button size="sm" onClick={() => void submit()} disabled={!selected || pending}>
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : null}
            Check answer
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "mt-4 flex gap-2.5 rounded-lg p-3",
            result.correct
              ? "bg-emerald-50 text-emerald-950 dark:bg-emerald-500/10 dark:text-emerald-100"
              : "bg-muted/60 text-foreground",
          )}
        >
          <Sparkles
            className={cn(
              "mt-0.5 size-4 shrink-0",
              result.correct ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
            )}
          />
          <div>
            <p className="text-xs font-semibold">
              {result.correct ? `Correct — +${result.points} XP` : "Not quite"}
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed opacity-80">
              {result.explanation}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
