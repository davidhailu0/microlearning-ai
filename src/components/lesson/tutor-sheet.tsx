"use client";

import * as React from "react";
import { ArrowUp, Loader2, Sparkles, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Explain that in simpler terms",
  "Give me a concrete example",
  "Why does this matter in practice?",
];

export function TutorSheet({
  lessonId,
  lessonTitle,
}: {
  lessonId: string;
  lessonTitle: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        "I'm your tutor for this lesson. Ask for a simpler explanation, an example, or a check on whether you understood it.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const bottomRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open, pending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lessonId,
          messages: next.filter((message, index) => !(index === 0 && message.role === "assistant")),
        }),
      });
      const payload = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !payload.reply) {
        setError(payload.error ?? "The tutor didn't answer. Try again.");
        return;
      }

      setMessages((current) => [...current, { role: "assistant", content: payload.reply! }]);
    } catch {
      setError("Couldn't reach the tutor. Check your connection.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="fixed bottom-5 right-5 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-foreground pl-4 pr-5 text-sm font-medium text-background shadow-[0_12px_30px_-8px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.03] active:scale-95 sm:bottom-7 sm:right-7"
          aria-label="Ask the lesson tutor"
        >
          <Sparkles className="size-4" />
          Ask tutor
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        showCloseButton={false}
      >
        <SheetHeader className="border-b border-border/70 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="flex items-center gap-2 text-sm">
                <span className="grid size-6 place-items-center rounded-md bg-foreground text-background">
                  <Sparkles className="size-3.5" />
                </span>
                Lesson tutor
              </SheetTitle>
              <SheetDescription className="mt-1 line-clamp-1 text-[11px]">
                {lessonTitle}
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(false)}
              aria-label="Close tutor"
            >
              <X className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[92%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap",
                  message.role === "user"
                    ? "ml-auto bg-foreground text-background"
                    : "bg-muted/70 text-foreground",
                )}
              >
                {message.content}
              </div>
            ))}

            {pending && (
              <div className="flex w-fit items-center gap-2 rounded-xl bg-muted/70 px-3.5 py-2.5">
                <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Thinking…</span>
              </div>
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}

            {messages.length === 1 && !pending && (
              <div className="pt-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Try
                </p>
                <div className="mt-2 flex flex-col gap-1.5">
                  {STARTERS.map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      onClick={() => void send(starter)}
                      className="rounded-lg border border-border/70 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-muted/50 hover:text-foreground"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
          className="border-t border-border/70 p-4"
        >
          <div className="flex items-end gap-2 rounded-xl border border-border/70 bg-background p-2 focus-within:border-foreground/30">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              placeholder="Ask about this lesson…"
              className="max-h-32 min-h-8 flex-1 resize-none bg-transparent px-1.5 py-1.5 text-[13px] outline-none placeholder:text-muted-foreground"
              aria-label="Message the tutor"
            />
            <Button
              type="submit"
              size="icon-sm"
              disabled={!input.trim() || pending}
              aria-label="Send message"
              className="shrink-0 rounded-lg"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Grounded in this lesson. It won&apos;t invent sources.
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
}
