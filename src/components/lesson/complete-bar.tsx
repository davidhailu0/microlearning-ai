"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CompleteBar({
  lessonId,
  nextLessonId,
  courseId,
  completed,
  xpReward,
}: {
  lessonId: string;
  nextLessonId: string | null;
  courseId: string;
  completed: boolean;
  xpReward: number;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function complete() {
    setPending(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, { method: "POST" });
      if (!response.ok) throw new Error("Request failed");

      toast.success(`Lesson complete · +${xpReward} XP`, {
        description: nextLessonId ? "Next lesson unlocked." : "You finished the course.",
      });

      router.push(nextLessonId ? `/lesson/${nextLessonId}` : `/course/${courseId}`);
      router.refresh();
    } catch {
      toast.error("Couldn't save your progress. Try again.");
      setPending(false);
    }
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">
            {completed ? "You've finished this lesson" : "Finished reading?"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {completed
              ? "Revisit it any time — the flashcards will resurface on schedule."
              : `Completing adds ${xpReward} XP and schedules two flashcards for review.`}
          </p>
        </div>

        {completed ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-100 px-3 text-xs font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Check className="size-3.5" />
              Completed
            </span>
            <Button asChild size="sm" variant="outline">
              <Link href={`/course/${courseId}`}>
                Course
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        ) : (
          <Button onClick={() => void complete()} disabled={pending} className="shrink-0 gap-1.5">
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Complete lesson
            {!pending && <ArrowRight className="size-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}
