import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Layers,
  Play,
  Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getCourse } from "@/lib/repo";
import { coverTint, LEVEL_LABEL } from "@/lib/theme";
import { formatMinutes } from "@/lib/text";
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

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        {course.coverage && (
          <div className="mt-3 rounded-lg border border-border/70 bg-muted/30 px-3.5 py-2.5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <BookOpen className="size-3" />
              Book companion
            </p>
            <p className="mt-1 text-xs font-medium">
              {[
                `Covers all ${course.coverage.sections} sections`,
                course.coverage.words > 0
                  ? `~${course.coverage.words.toLocaleString()} words read`
                  : null,
                "every lesson cites its source",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {course.coverage.throughline && (
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
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
