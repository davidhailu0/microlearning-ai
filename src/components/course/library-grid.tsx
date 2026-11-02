"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { CourseCard } from "@/components/course/course-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CourseSummary } from "@/lib/types";

export function LibraryGrid({ courses }: { courses: CourseSummary[] }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("All");

  const categories = React.useMemo(
    () => Array.from(new Set(courses.map((course) => course.category))),
    [courses],
  );

  const visible = courses.filter((course) => {
    if (category !== "All" && course.category !== category) return false;
    if (!query.trim()) return true;
    const haystack = [
      course.title,
      course.description,
      course.category,
      ...course.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", ...categories].slice(0, 6).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                category === item
                  ? "border-transparent bg-foreground text-background"
                  : "border-border/70 text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the library"
            className="h-9 rounded-full pl-9 text-[13px]"
            aria-label="Search the library"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-border/70 px-6 py-10 text-center text-sm text-muted-foreground">
          Nothing matches that search yet. Generate a course from the bar above.
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
