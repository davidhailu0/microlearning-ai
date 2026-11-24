import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getLesson } from "@/lib/repo";
import {
  getSourceReading,
  reflowSourceText,
  type ReadingPassage,
} from "@/lib/source-reading";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function pageLabel(section: ReadingPassage) {
  if (section.pageStart == null) return null;
  if (section.pageEnd != null && section.pageEnd !== section.pageStart) {
    return `pp. ${section.pageStart}–${section.pageEnd}`;
  }
  return `p. ${section.pageStart}`;
}

function SourceText({ text }: { text: string }) {
  const paragraphs = reflowSourceText(text);

  return (
    <div className="space-y-4">
      {paragraphs.map((part, index) => {
        if (/^#{1,3}\s+/.test(part)) {
          return (
            <h3
              key={index}
              className="mt-8 text-[19px] font-semibold leading-snug tracking-tight text-balance first:mt-0"
            >
              {part.replace(/^#{1,3}\s+/, "")}
            </h3>
          );
        }

        return (
          <p
            key={index}
            className="max-w-[68ch] text-[16.5px] leading-[1.8] tracking-[-0.006em] text-foreground/85 text-pretty"
          >
            {part.replace(/\[page \d+\]\s*/g, "").trim()}
          </p>
        );
      })}
    </div>
  );
}

export default async function SourceReadingPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const user = await getCurrentUser();
  const lesson = await getLesson(lessonId, user.id);
  if (!lesson) notFound();

  const indexes = lesson.sourceRef?.sectionIndexes ?? [];
  const reading = indexes.length ? await getSourceReading(lesson.courseTitle, indexes) : null;
  const missingSections = reading ? Math.max(0, indexes.length - reading.sections.length) : 0;

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-3 px-4 sm:px-6">
          <Link
            href={`/lesson/${lesson.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Lesson
          </Link>
          <span className="hidden min-w-0 flex-1 truncate text-center text-[11px] text-muted-foreground sm:block">
            {lesson.courseTitle}
          </span>
          <span className="ml-auto text-[11px] text-muted-foreground">Source reading</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-9 sm:px-6">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <BookOpen className="size-3.5" />
          Read the original
        </div>

        <h1 className="mt-2 text-[28px] font-semibold leading-[1.15] tracking-tight text-balance sm:text-[34px]">
          {lesson.title}
        </h1>

        {lesson.sourceRef && (
          <p className="mt-3 max-w-[68ch] text-[14px] leading-6 text-muted-foreground text-pretty">
            {lesson.sourceRef.label}
            {indexes.length > 0 ? (
              <span className="text-foreground/50">
                {" "}
                · {indexes.length} cited section{indexes.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </p>
        )}

        <p className="mt-4 max-w-[68ch] rounded-lg border border-border/70 bg-muted/30 px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
          This is the exact source material this lesson distills. Read a section here, then
          return to the lesson and use the quiz and teach-back prompt to check what stayed
          with you.
        </p>

        {reading ? (
          <>
            {missingSections > 0 && (
              <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3 text-[12.5px] leading-relaxed text-amber-950 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-100">
                {missingSections} cited section{missingSections === 1 ? " was" : "s were"} not
                found in the local source cache. The remaining sections are shown below.
              </p>
            )}

            {reading.sections.length > 1 && (
              <nav aria-label="Cited sections" className="mt-6 flex flex-wrap gap-2">
                {reading.sections.map((section, index) => (
                  <a
                    key={section.index}
                    href={`#section-${index + 1}`}
                    className="rounded-md border border-border/70 bg-card px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                  >
                    {index + 1}. {section.title}
                  </a>
                ))}
              </nav>
            )}

            <div className="mt-8 space-y-10">
              {reading.sections.map((section, index) => (
                <article
                  key={section.index}
                  id={`section-${index + 1}`}
                  className="scroll-mt-24 border-t border-border/70 pt-7 first:border-t-0 first:pt-0"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Section {index + 1}
                    </span>
                    {pageLabel(section) && (
                      <span className="text-[11px] text-muted-foreground">
                        {pageLabel(section)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      {section.wordCount.toLocaleString()} words
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-[22px] font-semibold leading-tight tracking-tight text-balance">
                    {section.title}
                  </h2>
                  <div className="mt-4">
                    <SourceText text={section.text} />
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
              <Link
                href={`/lesson/${lesson.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Back to lesson
              </Link>
              <p className="text-[11px] text-muted-foreground">
                Finished reading? Take the lesson quiz next.
              </p>
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-xl border border-border/70 bg-card p-5">
            <p className="text-sm font-semibold">Source text isn’t available here</p>
            <p className="mt-1.5 max-w-[60ch] text-[13.5px] leading-relaxed text-muted-foreground">
              The lesson still cites the exact section
              {lesson.sourceRef ? `: ${lesson.sourceRef.label}` : "."} Open your copy at the
              cited page or chapter to read the original passage.
            </p>
            <Link
              href={`/lesson/${lesson.id}`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-foreground underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              Back to lesson
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
