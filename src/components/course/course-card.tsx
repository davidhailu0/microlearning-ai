import Link from "next/link";
import { Clock, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { coverTint, LEVEL_LABEL } from "@/lib/theme";
import { formatMinutes } from "@/lib/text";
import type { CourseSummary } from "@/lib/types";

export function CourseCard({ course }: { course: CourseSummary }) {
  const tint = coverTint(course.coverColor);

  return (
    <Link
      href={`/course/${course.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]",
        tint.hover,
      )}
    >
      <div className={cn("relative flex h-24 items-center justify-center", tint.tile)}>
        <span className="grid size-12 place-items-center rounded-xl bg-background/70 text-2xl shadow-sm ring-1 ring-foreground/5 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
          {course.coverEmoji}
        </span>
        {course.isCurated && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur-sm">
            Curated
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>{course.category}</span>
          <span aria-hidden="true" className="size-0.5 rounded-full bg-current opacity-50" />
          <span>{LEVEL_LABEL[course.level] ?? course.level}</span>
        </div>

        <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-balance">
          {course.title}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Layers className="size-3" />
            {course.lessonCount} lessons
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {formatMinutes(course.estimatedMinutes)}
          </span>
        </div>
      </div>
    </Link>
  );
}
