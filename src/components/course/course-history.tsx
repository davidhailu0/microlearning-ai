"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Link2,
  Search,
  Sparkles,
  Type,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { coverTint } from "@/lib/theme";
import { relativeTime } from "@/lib/text";
import type { UserCourse } from "@/lib/types";

type Icon = React.ComponentType<{ className?: string }>;

const SOURCE_META: Record<string, { label: string; icon: Icon }> = {
  pdf: { label: "PDF", icon: FileText },
  epub: { label: "EPUB", icon: BookOpen },
  url: { label: "Link", icon: Link2 },
  text: { label: "Text", icon: Type },
  prompt: { label: "Topic", icon: Sparkles },
};

/**
 * Full generation history. Unlike the "pick up where you left off" cards this
 * lists every course the user made, including ones they never opened.
 */
export function CourseHistory({
  courses,
  searchable = false,
}: {
  courses: UserCourse[];
  searchable?: boolean;
}) {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  const kinds = React.useMemo(
    () => Array.from(new Set(courses.map((course) => course.sourceKind))).filter(Boolean),
    [courses],
  );

  const visible = React.useMemo(() => {
    const needle = query.trim().toLowerCase();

    return courses.filter((course) => {
      if (filter !== "all" && course.sourceKind !== filter) return false;
      if (!needle) return true;
      return [course.title, course.description, course.sourceTitle ?? "", course.category, ...course.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [courses, filter, query]);

  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center">
        <p className="text-sm font-medium">Nothing here yet</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
          Courses you generate from a topic, link, PDF, or EPUB appear here — even if you
          never open them.
        </p>
      </div>
    );
  }

  return (
    <div>
      {searchable && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterChip>
            {kinds.map((kind) => {
              const meta = SOURCE_META[kind];
              if (!meta) return null;
              return (
                <FilterChip
                  key={kind}
                  active={filter === kind}
                  onClick={() => setFilter(kind)}
                >
                  {meta.label}
                </FilterChip>
              );
            })}
          </div>

          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your courses"
              className="h-9 rounded-full pl-9 text-[13px]"
              aria-label="Search your courses"
            />
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border/70 px-6 py-8 text-center text-sm text-muted-foreground">
          Nothing matches that search.
        </p>
      ) : (
        <ul
          className={cn(
            "overflow-hidden rounded-xl border border-border/70 bg-card",
            searchable && "mt-4",
          )}
        >
          {visible.map((course, index) => {
            const meta = SOURCE_META[course.sourceKind] ?? SOURCE_META.text;
            const SourceIcon = meta.icon;
            const tint = coverTint(course.coverColor);
            const started = course.percent > 0 && course.currentLessonId != null;
            const href = started
              ? `/lesson/${course.currentLessonId}`
              : `/course/${course.id}`;
            const sourceLine =
              course.sourceTitle && course.sourceTitle !== course.title
                ? course.sourceTitle
                : null;

            return (
              <li key={course.id} className={cn(index > 0 && "border-t border-border/60")}>
                <Link
                  href={href}
                  className="group flex items-center gap-3.5 p-3.5 transition-colors hover:bg-muted/40 sm:gap-4 sm:p-4"
                >
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-lg text-xl ring-1 ring-foreground/5",
                      tint.tile,
                    )}
                  >
                    {course.coverEmoji}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold tracking-tight">
                        {course.title}
                      </p>
                      <span className="hidden shrink-0 items-center gap-1 rounded-full border border-border/70 px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:inline-flex">
                        <SourceIcon className="size-2.5" />
                        {meta.label}
                      </span>
                    </div>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {sourceLine ? `${sourceLine} · ` : ""}
                      {course.lessonCount} lessons ·{" "}
                      <span suppressHydrationWarning>{relativeTime(course.createdAt)}</span>
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 w-24 overflow-hidden rounded-full bg-muted sm:w-32">
                        <div
                          className="h-full rounded-full bg-foreground/70"
                          style={{ width: `${Math.max(course.percent, 0)}%` }}
                        />
                      </div>
                      <span className="text-[10px] tabular-nums text-muted-foreground">
                        {course.percent > 0
                          ? `${course.percent}% · ${course.completedLessons}/${course.lessonCount}`
                          : "Not started"}
                      </span>
                    </div>
                  </div>

                  <span className="ml-1 grid size-8 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors group-hover:border-foreground/20 group-hover:bg-foreground group-hover:text-background">
                    <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-transparent bg-foreground text-background"
          : "border-border/70 text-muted-foreground hover:border-foreground/20 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
