"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  FileText,
  Link2,
  Loader2,
  Paperclip,
  Sparkles,
  TriangleAlert,
  Type,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { JobView } from "@/lib/types";

type Mode = "prompt" | "url" | "file" | "text";
type Level = "beginner" | "intermediate" | "advanced";

type IngestedFile = {
  name: string;
  title: string;
  text: string;
  wordCount: number;
  pageCount: number | null;
};

const SUGGESTIONS = [
  "How large language models work",
  "Stoicism in ten minutes",
  "Why inflation happens",
  "The science of sleep",
];

const LEVELS: { value: Level; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const POLL_MS = 1200;
// Whole-book generation makes several model calls; allow up to ~48 minutes.
const MAX_POLLS = 2400;

export function CreateBar() {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("prompt");
  const [prompt, setPrompt] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [text, setText] = React.useState("");
  const [level, setLevel] = React.useState<Level>("beginner");
  const [file, setFile] = React.useState<IngestedFile | null>(null);
  const [ingesting, setIngesting] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [job, setJob] = React.useState<JobView | null>(null);
  const busy = job != null;

  const fileInput = React.useRef<HTMLInputElement>(null);
  const pollTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (pollTimer.current) window.clearTimeout(pollTimer.current);
    };
  }, []);

  async function handleFile(candidate: globalThis.File) {
    setError(null);
    setIngesting(true);
    try {
      const form = new FormData();
      form.append("file", candidate);
      const response = await fetch("/api/ingest", { method: "POST", body: form });
      const payload = (await response.json()) as IngestedFile & { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "We couldn't read that file.");
        return;
      }

      setFile({
        name: candidate.name,
        title: payload.title ?? candidate.name,
        text: payload.text,
        wordCount: payload.wordCount,
        pageCount: payload.pageCount ?? null,
      });
    } catch {
      setError("The upload failed. Check your connection and try again.");
    } finally {
      setIngesting(false);
    }
  }

  async function start() {
    setError(null);

    let body: Record<string, unknown>;
    if (mode === "prompt") {
      if (prompt.trim().length < 6) {
        setError("Describe what you want to learn in a few words.");
        return;
      }
      body = { kind: "prompt", prompt: prompt.trim(), level };
    } else if (mode === "url") {
      if (!/^https?:\/\//i.test(url.trim())) {
        setError("Add a full link, starting with http:// or https://");
        return;
      }
      body = { kind: "url", url: url.trim(), level };
    } else if (mode === "text") {
      if (text.trim().split(/\s+/).length < 30) {
        setError("Paste at least a few paragraphs.");
        return;
      }
      body = { kind: "text", text: text.trim(), title: "Pasted notes", level };
    } else {
      if (!file) {
        setError("Choose a PDF or EPUB first.");
        return;
      }
      body = {
        kind: "text",
        text: file.text,
        title: file.title,
        sourceKind: file.name.toLowerCase().endsWith(".epub") ? "epub" : "pdf",
        level,
      };
    }

    setJob({
      id: "pending",
      status: "queued",
      stage: "Queued",
      progress: 2,
      courseId: null,
      error: null,
      result: null,
    });

    try {
      const response = await fetch("/api/courses/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as { jobId?: string; error?: string };

      if (!response.ok || !payload.jobId) {
        setJob(null);
        setError(payload.error ?? "We couldn't start that course.");
        return;
      }

      poll(payload.jobId);
    } catch {
      setJob(null);
      setError("We couldn't reach the server. Try again.");
    }
  }

  function poll(jobId: string) {
    let attempts = 0;

    const tick = async () => {
      attempts += 1;
      if (attempts > MAX_POLLS) {
        setJob(null);
        setError("This is taking longer than expected. Check your library in a minute.");
        return;
      }

      try {
        const response = await fetch(`/api/jobs/${jobId}`, { cache: "no-store" });
        const current = (await response.json()) as JobView;

        if (!response.ok) {
          setJob(null);
          setError("We lost track of that job. Try again.");
          return;
        }

        setJob(current);

        if (current.status === "succeeded" && current.courseId) {
          router.push(`/course/${current.courseId}`);
          router.refresh();
          return;
        }

        if (current.status === "failed") {
          setError(current.error ?? "Course generation failed.");
          setJob(null);
          return;
        }
      } catch {
        /* transient network blip — keep polling */
      }

      pollTimer.current = window.setTimeout(tick, POLL_MS);
    };

    pollTimer.current = window.setTimeout(tick, 400);
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.18)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 size-64 rounded-full bg-amber-400/10 blur-3xl"
        />

        {busy ? (
          <GeneratingState job={job!} />
        ) : (
          <div className="relative p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
                <TabsList variant="line" className="h-8 gap-0.5">
                  <TabItem value="prompt" icon={Sparkles} label="Prompt" />
                  <TabItem value="url" icon={Link2} label="Link" />
                  <TabItem value="file" icon={Paperclip} label="File" />
                  <TabItem value="text" icon={Type} label="Text" />
                </TabsList>
              </Tabs>

              <div className="hidden items-center gap-1 rounded-full bg-muted/60 p-0.5 sm:flex">
                {LEVELS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLevel(option.value)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                      level === option.value
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              {mode === "prompt" && (
                <Textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                      event.preventDefault();
                      void start();
                    }
                  }}
                  placeholder="What do you want to understand? e.g. how the immune system remembers a virus"
                  rows={2}
                  className="min-h-20 resize-none border-0 bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0 dark:bg-transparent"
                  aria-label="Course topic"
                />
              )}

              {mode === "url" && (
                <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/60 px-3">
                  <Link2 className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void start();
                      }
                    }}
                    placeholder="https://en.wikipedia.org/wiki/Free_will"
                    className="h-12 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
                    aria-label="Source link"
                  />
                </div>
              )}

              {mode === "text" && (
                <Textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Paste an article, notes, or a chapter…"
                  rows={4}
                  className="min-h-24 resize-none border-0 bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0 dark:bg-transparent"
                  aria-label="Source text"
                />
              )}

              {mode === "file" && (
                <div>
                  <input
                    ref={fileInput}
                    type="file"
                    accept=".pdf,.epub,application/pdf,application/epub+zip"
                    className="sr-only"
                    onChange={(event) => {
                      const chosen = event.target.files?.[0];
                      if (chosen) void handleFile(chosen);
                      event.target.value = "";
                    }}
                  />

                  {file ? (
                    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted">
                        <FileText className="size-5 text-muted-foreground" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.wordCount.toLocaleString()} words
                          {file.pageCount ? ` · ${file.pageCount} pages` : ""}
                        </p>
                        {file.wordCount >= 7000 && (
                          <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-foreground">
                            <Sparkles className="size-3" />
                            Book companion · every section will be read
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInput.current?.click()}
                      >
                        Replace
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(event) => {
                        event.preventDefault();
                        setDragging(false);
                        const dropped = event.dataTransfer.files?.[0];
                        if (dropped) void handleFile(dropped);
                      }}
                      className={cn(
                        "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/40 px-4 py-8 text-center transition-colors hover:border-foreground/25 hover:bg-muted/40",
                        dragging && "border-foreground/40 bg-muted/60",
                      )}
                    >
                      {ingesting ? (
                        <>
                          <Loader2 className="size-5 animate-spin text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Reading your book…</span>
                        </>
                      ) : (
                        <>
                          <span className="grid size-9 place-items-center rounded-full bg-muted">
                            <Paperclip className="size-4 text-muted-foreground" />
                          </span>
                          <span className="text-sm font-medium">
                            Drop a PDF or EPUB, or browse
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Up to 50 MB · long books welcome
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setMode("prompt");
                      setPrompt(suggestion);
                    }}
                    className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-muted/60 hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <Button onClick={() => void start()} className="ml-auto h-9 gap-1.5 px-4">
                <Wand2 className="size-4" />
                Create course
                <ArrowRight className="size-3.5 opacity-70" />
              </Button>
            </div>

            {error && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
                <TriangleAlert className="mt-px size-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabItem({
  value,
  icon: Icon,
  label,
}: {
  value: Mode;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <TabsTrigger value={value} className="gap-1.5 px-2.5 text-[13px]">
      <Icon className="size-3.5" />
      {label}
    </TabsTrigger>
  );
}

function GeneratingState({ job }: { job: JobView }) {
  const progress = Math.max(4, Math.min(100, job.progress || 4));

  return (
    <div className="relative p-5 sm:p-6">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="size-4 text-amber-500" />
        Building your course
        <Loader2 className="ml-auto size-4 animate-spin text-muted-foreground" />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{job.stage}</p>
      <Progress value={progress} className="mt-4 h-1.5" />
      <p className="mt-2 text-xs text-muted-foreground tabular-nums">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
