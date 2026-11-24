import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Clock, X } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getLesson } from "@/lib/repo";
import { checkpointForCompleted } from "@/lib/checkpoints";
import { AudioPlayer } from "@/components/lesson/audio-player";
import { BlockRenderer } from "@/components/lesson/block-renderer";
import { CompleteBar } from "@/components/lesson/complete-bar";
import { QuizCard } from "@/components/lesson/quiz-card";
import { TeachBack } from "@/components/lesson/teach-back";
import { TutorSheet } from "@/components/lesson/tutor-sheet";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const user = await getCurrentUser();
  const lesson = await getLesson(lessonId, user.id);

  if (!lesson) notFound();

  const position = lesson.position + 1;
  const percent = Math.round((position / Math.max(1, lesson.totalLessons)) * 100);
  const keyPoints = lesson.blocks.flatMap((block) =>
    block.type === "bullets" ? block.items : [],
  );
  const pages =
    lesson.sourceRef?.pageStart != null
      ? `pp. ${lesson.sourceRef.pageStart}${
          lesson.sourceRef.pageEnd && lesson.sourceRef.pageEnd !== lesson.sourceRef.pageStart
            ? `–${lesson.sourceRef.pageEnd}`
            : ""
        }`
      : null;
  const checkpointIndex =
    lesson.totalLessons >= 4
      ? checkpointForCompleted(lesson.totalLessons, position + 1)
      : null;
  const checkpointHref = checkpointIndex
    ? `/course/${lesson.courseId}/review/${checkpointIndex}`
    : null;

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center gap-3 px-4 sm:px-6">
          <Link
            href={`/course/${lesson.courseId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Course</span>
          </Link>

          <span className="hidden min-w-0 flex-1 truncate text-center text-[11px] text-muted-foreground sm:block">
            {lesson.courseTitle}
          </span>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {position} / {lesson.totalLessons}
            </span>
            <Link
              href="/"
              aria-label="Close lesson"
              className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </Link>
          </div>
        </div>
        <div className="h-px w-full bg-muted">
          <div
            className="h-px bg-foreground/70 transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </header>

      <article className="mx-auto w-full max-w-2xl px-4 pb-28 pt-9 sm:px-6">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>{lesson.moduleTitle}</span>
          <span aria-hidden="true" className="size-0.5 rounded-full bg-current opacity-50" />
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {lesson.estimatedMinutes} min
          </span>
          {lesson.completed && (
            <>
              <span aria-hidden="true" className="size-0.5 rounded-full bg-current opacity-50" />
              <span className="text-emerald-600 dark:text-emerald-400">Completed</span>
            </>
          )}
        </div>

        <h1 className="mt-2 text-[28px] font-semibold leading-[1.15] tracking-tight text-balance sm:text-[34px]">
          {lesson.title}
        </h1>

        {lesson.objective && (
          <p className="mt-3 max-w-[68ch] text-[15px] leading-6 text-foreground/65 text-pretty">
            {lesson.objective}
          </p>
        )}

        <div className="mt-6">
          <AudioPlayer
            src={lesson.audioUrl}
            title={lesson.title}
            status={lesson.audioStatus}
          />
        </div>

        <div className="mt-9">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              The lesson
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
          </div>
          <div className="mt-5">
            <BlockRenderer blocks={lesson.blocks} />
          </div>
        </div>

        {lesson.sourceRef && lesson.sourceRef.sectionIndexes.length > 0 && (
          <aside className="mt-8 border-l-2 border-foreground/20 pl-4">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <BookOpen className="size-3" />
              From the book
            </p>
            <p className="mt-1 text-[13px] font-medium leading-snug">
              {lesson.sourceRef.label}
              {pages ? <span className="font-normal text-muted-foreground"> · {pages}</span> : null}
            </p>
            {lesson.sourceRef.note && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {lesson.sourceRef.note}
              </p>
            )}
            {lesson.sourceRef.sectionIndexes.length > 0 && (
              <Link
                href={`/lesson/${lesson.id}/read`}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
              >
                <BookOpen className="size-3.5" />
                Read the original sections
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </Link>
            )}
          </aside>
        )}

        <div className="mt-12 flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Practice
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
        </div>

        <TeachBack
          lessonId={lesson.id}
          bullets={keyPoints}
          takeaway={lesson.takeaway}
        />

        {lesson.quiz && (
          <div className="mt-8 space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {lesson.extraQuizzes.length > 0
                ? `${lesson.extraQuizzes.length + 1} questions`
                : "Check your understanding"}
            </p>
            {[lesson.quiz, ...lesson.extraQuizzes].map((quiz, index) => (
              <QuizCard
                key={quiz.questionId}
                quiz={quiz}
                position={index + 1}
                total={lesson.extraQuizzes.length + 1}
              />
            ))}
          </div>
        )}

        <div className="mt-4">
          <CompleteBar
            lessonId={lesson.id}
            nextLessonId={lesson.nextLessonId}
            courseId={lesson.courseId}
            completed={lesson.completed}
            xpReward={lesson.xpReward}
            reviewHref={checkpointHref}
          />
        </div>

        <nav className="mt-6 flex items-center justify-between gap-3">
          {lesson.prevLessonId ? (
            <Link
              href={`/lesson/${lesson.prevLessonId}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Previous
            </Link>
          ) : (
            <span />
          )}

          {lesson.nextLessonId && (
            <Link
              href={`/lesson/${lesson.nextLessonId}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Next lesson
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </nav>
      </article>

      <TutorSheet lessonId={lesson.id} lessonTitle={lesson.title} />
    </div>
  );
}
