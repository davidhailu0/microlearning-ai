import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { coverTint } from "@/lib/theme";
import { relativeTime } from "@/lib/text";
import type { ActiveCourse } from "@/lib/types";

export function ProgressCard({ course }: { course: ActiveCourse }) {
  const tint = coverTint(course.coverColor);
  const href = course.currentLessonId
    ? `/lesson/${course.currentLessonId}`
    : `/course/${course.id}`;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border/70 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]",
        tint.hover,
      )}
    >
      <span
        className={cn(
          "grid size-14 shrink-0 place-items-center rounded-xl text-2xl ring-1 ring-foreground/5",
          tint.tile,
        )}
      >
        {course.coverEmoji}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold tracking-tight">{course.title}</p>
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {relativeTime(course.lastActivityAt)}
          </span>
        </div>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {course.currentLessonTitle ? `Next · ${course.currentLessonTitle}` : "Course complete"}
        </p>

        <div className="mt-2.5 flex items-center gap-2.5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/80 transition-[width] duration-500"
              style={{ width: `${Math.max(3, course.percent)}%` }}
            />
          </div>
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {course.completedLessons}/{course.lessonCount}
          </span>
        </div>
      </div>

      <span className="ml-1 grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-background transition-transform duration-200 group-hover:scale-105">
        {course.percent > 0 ? (
          <Play className="size-3.5 translate-x-px" />
        ) : (
          <ArrowUpRight className="size-4" />
        )}
      </span>
    </Link>
  );
}
