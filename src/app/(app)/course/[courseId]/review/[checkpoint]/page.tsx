import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, LockKeyhole } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getCheckpointReview } from "@/lib/repo";
import { Button } from "@/components/ui/button";
import { CheckpointReviewDeck } from "@/components/review/checkpoint-review";

export const dynamic = "force-dynamic";

export default async function CheckpointReviewPage({
  params,
}: {
  params: Promise<{ courseId: string; checkpoint: string }>;
}) {
  const { courseId, checkpoint } = await params;
  const checkpointIndex = Number(checkpoint);
  if (!Number.isInteger(checkpointIndex) || checkpointIndex < 1) notFound();

  const user = await getCurrentUser();
  const review = await getCheckpointReview(courseId, checkpointIndex, user.id);
  if (!review) notFound();
  const range =
    review.fromLesson === review.toLesson
      ? `lesson ${review.fromLesson}`
      : `lessons ${review.fromLesson}–${review.toLesson}`;

  if (review.locked) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 pb-20 pt-10 sm:px-6">
        <Link
          href={`/course/${review.courseId}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to course
        </Link>

        <div className="mt-8 rounded-2xl border border-border/70 bg-card p-7 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <LockKeyhole className="size-5" />
          </span>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Checkpoint {review.index}
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">
            Finish {range} first
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            You have completed {review.completedLessons} of {review.totalLessons} lessons in
            this block. The review unlocks when the whole block is done.
          </p>
          <Button asChild className="mt-5">
            <Link href={`/course/${review.courseId}`}>Back to course</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-20 pt-8 sm:px-6">
      <Link
        href={`/course/${review.courseId}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {review.courseTitle}
      </Link>

      <header className="mt-5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <BookOpen className="size-3.5" />
          Checkpoint {review.index} of {review.totalCheckpoints}
        </p>
        <h1 className="mt-1.5 text-[28px] font-semibold leading-tight tracking-tight text-balance sm:text-[32px]">
          Review {range}
        </h1>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted-foreground text-pretty">
          This checkpoint pulls questions from every lesson in the block. Answer without
          looking back first; the explanations and key ideas are here to repair what you miss.
        </p>
      </header>

      <div className="mt-7">
        <CheckpointReviewDeck review={review} />
      </div>
    </div>
  );
}
