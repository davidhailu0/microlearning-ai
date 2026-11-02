import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { listUserCourses } from "@/lib/repo";
import { CourseHistory } from "@/components/course/course-history";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My courses",
  description: "Every course you have generated, including PDFs and links.",
};

export default async function CoursesPage() {
  const user = await getCurrentUser();
  const courses = await listUserCourses(user.id, 100);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to today
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {courses.length === 0
              ? "Everything you generate from a topic, link, PDF, or EPUB lands here."
              : `${courses.length} course${courses.length === 1 ? "" : "s"} you generated.`}
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/">
            <Sparkles className="size-4" />
            New course
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <CourseHistory courses={courses} searchable />
      </div>
    </div>
  );
}
