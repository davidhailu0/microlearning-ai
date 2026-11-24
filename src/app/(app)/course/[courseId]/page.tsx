import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Layers,
  LockKeyhole,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getCourse } from "@/lib/repo";
import { coverTint, LEVEL_LABEL } from "@/lib/theme";
import { formatMinutes } from "@/lib/text";
import { checkpointRanges } from "@/lib/checkpoints";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const user = await getCurrentUser();
  const course = await getCourse(courseId, user.id);

  if (!course) notFound();

  const tint = coverTint(course.coverColor);
  const started = course.completedLessons > 0;
  const next = course.nextLessonId;
  const orderedLessons = course.modules.flatMap((module) => module.lessons);
  const checkpoints = checkpointRanges(orderedLessons.length).map((block, index) => {
    const group = orderedLessons.slice(block.start, block.end);
    const completed = group.filter((lesson) => lesson.completed).length;
    return {
      index: index + 1,
      from: group[0]?.position ?? block.start + 1,
      to: group[group.length - 1]?.position ?? block.end,
      total: group.length,
      completed,
      unlocked: group.length > 0 && completed === group.length,
      review: course.checkpointReviews.find((item) => item.index === index + 1) ?? null,
    };
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Today
      </Link>

      <header className="mt-5">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "grid size-16 shrink-0 place-items-center rounded-2xl text-3xl ring-1 ring-foreground/5",
              tint.tile,
            )}
          >
            {course.coverEmoji}
          </span>
          <div className="min-w-0 pt-0.5">
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>{course.category}</span>
              <span aria-hidden="true" className="size-0.5 rounded-full bg-current opacity-50" />
              <span>{LEVEL_LABEL[course.level] ?? course.level}</span>
            </div>
            <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight text-balance sm:text-[32px]">
              {course.title}
            </h1>
          </div>
        </div>

        <p className="mt-3 max-w-prose text-[15px] leading-7 text-foreground/75 text-pretty">
          {course.description}
        </p>

        {course.coverage && (
          <div className="mt-3 rounded-lg border border-border/70 bg-muted/30 px-3.5 py-2.5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <BookOpen className="size-3" />
              Book companion
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-background px-2 py-1 text-[11px] font-medium text-foreground/80">
                All {course.coverage.sections} sections
              </span>
              {course.coverage.words > 0 && (
                <span className="rounded-md bg-background px-2 py-1 text-[11px] font-medium text-foreground/80">
                  ~{course.coverage.words.toLocaleString()} words read
                </span>
              )}
              <span className="rounded-md bg-background px-2 py-1 text-[11px] font-medium text-foreground/80">
                Every lesson cites its source
              </span>
            </div>
            {course.coverage.throughline && (
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground text-pretty">
                <span className="font-medium text-foreground">Throughline: </span>
                {course.coverage.throughline}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="size-3.5" />
            {course.lessonCount} lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatMinutes(course.estimatedMinutes)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5" />
            {course.isCurated ? "Curated by Lumen" : "Made for you"}
          </span>
        </div>

        <div className="mt-6 rounded-xl border border-border/70 bg-card p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                {started ? "Your progress" : "Not started yet"}
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                {course.completedLessons} of {course.lessonCount} lessons
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 gap-1.5">
              <Link href={next ? `/lesson/${next}` : `/course/${course.id}`}>
                {started ? (
                  <>
                    Continue
                    <ArrowRight className="size-4" />
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" />
                    Start
                  </>
                )}
              </Link>
            </Button>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/80 transition-[width] duration-500"
              style={{ width: `${course.percent}%` }}
            />
          </div>
        </div>
      </header>

      {course.lessonCount >= 4 && (
        <section className="mt-8">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-tight">Review checkpoints</h2>
            <span className="text-[11px] text-muted-foreground">Every 4–5 lessons</span>
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Mixed questions from every lesson in a 4–5 lesson block, plus the key ideas to
            repair what you miss.
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {checkpoints.map((checkpoint) => {
              const range =
                checkpoint.from === checkpoint.to
                  ? `Lesson ${checkpoint.from}`
                  : `Lessons ${checkpoint.from}–${checkpoint.to}`;

              return checkpoint.unlocked ? (
                <Link
                  key={checkpoint.index}
                  href={`/course/${course.id}/review/${checkpoint.index}`}
                  className="group rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-foreground/25 hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Checkpoint {checkpoint.index}
                    </span>
                    {checkpoint.review ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        <Check className="size-3" />
                        Reviewed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        <RotateCcw className="size-3" />
                        Ready
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13px] font-medium">{range}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {checkpoint.review
                      ? `${checkpoint.review.score}/${checkpoint.review.total} correct · review again`
                      : `${checkpoint.completed}/${checkpoint.total} lessons · questions from every lesson`}
                  </p>
                </Link>
              ) : (
                <div
                  key={checkpoint.index}
                  className="rounded-xl border border-border/60 bg-muted/20 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Checkpoint {checkpoint.index}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <LockKeyhole className="size-3" />
                      Locked
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] font-medium text-muted-foreground">{range}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {checkpoint.completed}/{checkpoint.total} lessons complete
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-8 space-y-6">
        {course.modules.map((module, moduleIndex) => (
          <section key={module.id}>
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
                {String(moduleIndex + 1).padStart(2, "0")}
              </span>
              <h2 className="text-sm font-semibold tracking-tight">{module.title}</h2>
            </div>
            {module.summary && (
              <p className="ml-6 mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {module.summary}
              </p>
            )}

            <ul className="mt-2 overflow-hidden rounded-xl border border-border/70 bg-card">
              {module.lessons.map((lesson, lessonIndex) => (
                <li key={lesson.id} className="border-b border-border/60 last:border-b-0">
                  <Link
                    href={`/lesson/${lesson.id}`}
                    className="group flex items-center gap-3 px-3 py-3 transition-colors hover:bg-muted/50"
                  >
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-medium tabular-nums",
                        lesson.completed
                          ? "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {lesson.completed ? (
                        <Check className="size-3.5" />
                      ) : (
                        lessonIndex + 1
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">
                        {lesson.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                        {lesson.objective}
                      </span>
                    </span>

                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {lesson.estimatedMinutes} min
                    </span>
                    <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
