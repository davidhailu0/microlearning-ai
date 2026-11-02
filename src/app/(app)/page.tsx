import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { getDashboard } from "@/lib/repo";
import { CreateBar } from "@/components/dashboard/create-bar";
import { ProgressCard } from "@/components/course/progress-card";
import { CourseHistory } from "@/components/course/course-history";
import { LibraryGrid } from "@/components/course/library-grid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Today",
  description: "Your micro-learning dashboard.",
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const data = await getDashboard(user.id);
  const firstName = data.user.name.split(" ")[0];

  return (
    <div>
      {/* ------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_120%_at_50%_-30%,rgba(251,191,36,0.14),transparent_65%)] dark:bg-[radial-gradient(75%_120%_at_50%_-30%,rgba(251,191,36,0.09),transparent_65%)]"
        />
        <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pt-14">
          <p className="text-[13px] font-medium text-muted-foreground">
            {greeting()}, {firstName}
          </p>
          <h1 className="mt-1.5 max-w-2xl text-[30px] font-semibold leading-[1.12] tracking-tight text-balance sm:text-[40px]">
            What do you want to understand today?
          </h1>
          <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            A question, a link, or a whole book becomes a visual course you can finish in
            one sitting.
          </p>

          <div className="mt-7">
            <CreateBar />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* ----------------------------------------------------------- stats */}
        <section className="grid grid-cols-2 gap-3 py-6 lg:grid-cols-4">
          <Stat
            href="/review"
            icon={Layers}
            label="Due for review"
            value={data.dueCount}
            hint={data.dueCount > 0 ? "Clear the queue" : "All caught up"}
            highlight={data.dueCount > 0}
          />
          <Stat
            icon={Flame}
            label="Day streak"
            value={data.streak.current}
            hint={`Best ${data.streak.longest}`}
          />
          <Stat
            icon={Zap}
            label="Experience"
            value={data.user.xp.toLocaleString()}
            hint={`Level ${data.user.level}`}
          />
          <Stat
            icon={Clock}
            label="This week"
            value={`${data.stats.minutesThisWeek}m`}
            hint={`${data.stats.lessonsThisWeek} lessons read`}
          />
        </section>

        {/* --------------------------------------------------- active courses */}
        {data.active.length > 0 && (
          <section className="mt-6">
            <SectionHeading
              title="Pick up where you left off"
              subtitle="One lesson is about three minutes."
            />
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {data.active.map((course) => (
                <ProgressCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------ your courses */}
        {data.history.length > 0 && (
          <section className="mt-6">
            <SectionHeading
              title="Your courses"
              subtitle="Everything you've generated, newest first."
              action={
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all
                  <ArrowRight className="size-3.5" />
                </Link>
              }
            />
            <div className="mt-4">
              <CourseHistory courses={data.history} />
            </div>
          </section>
        )}

        {/* -------------------------------------------------- review callout */}
        {data.dueCount > 0 && (
          <section className="mt-6">
            <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(251,191,36,0.10)_45%,transparent_70%)]"
              />
              <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                    <Sparkles className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {data.dueCount} flashcard{data.dueCount === 1 ? "" : "s"} ready to
                      resurface
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      A five-minute pass now protects the ideas you just learned.
                    </p>
                  </div>
                </div>
                <Button asChild className="shrink-0">
                  <Link href="/review">
                    Start review
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* --------------------------------------------------------- library */}
        <section className="mt-12">
          <SectionHeading
            title="The library"
            subtitle="Short courses built to be finished, not bookmarked."
            action={
              <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
                <BookOpen className="size-3.5" />
                {data.curated.length} curated courses
              </span>
            }
          />
          <div className="mt-4">
            <LibraryGrid courses={data.curated} />
          </div>
        </section>

        <ModeNote />
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  href,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  hint: string;
  href?: string;
  highlight?: boolean;
}) {
  const body = (
    <>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid size-7 place-items-center rounded-md bg-muted text-muted-foreground",
            highlight && "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
          )}
        >
          <Icon className="size-3.5" />
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground">{hint}</p>
    </>
  );

  const className = cn(
    "rounded-xl border border-border/70 bg-card/60 p-3.5 transition-colors",
    href && "hover:border-foreground/20 hover:bg-card",
  );

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

function ModeNote() {
  if (env.dbEnabled && env.aiEnabled && env.ttsEnabled) return null;

  const provider = env.aiProviderLabel;

  return (
    <div className="mt-12 rounded-xl border border-dashed border-border/70 bg-muted/30 p-4">
      <p className="text-xs font-medium text-muted-foreground">
        {env.dbEnabled ? "Storage connected" : "Demo mode"} · {provider}
        {env.aiEnabled && !env.ttsEnabled ? " · text only" : ""}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {env.dbEnabled
          ? "Courses, streaks, and review schedules persist in Postgres."
          : "Without DATABASE_URL, everything lives in memory and resets when the server restarts. Curated courses and the full review loop still work."}{" "}
        {!env.aiEnabled
          ? "Add OPENAI_API_KEY, OPENROUTER_API_KEY, or FREELLMAPI_API_KEY to generate real courses and a live tutor. Until then, new courses use the deterministic local generator."
          : env.ttsEnabled
            ? `New courses are written with ${provider} and narrated with OpenAI TTS.`
            : `Generation and the tutor run through ${provider}. Narration needs a direct OPENAI_API_KEY.`}
      </p>
    </div>
  );
}
